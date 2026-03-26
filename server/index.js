import crypto from "crypto";
import express from "express";
import cors from "cors";
import { buildResultsFromAttempt, startAssessmentSession, unlockResults } from "../shared/assessment.js";

const PORT = Number(process.env.PORT || 8787);
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";
const CERTIFICATE_AMOUNT_PAISE = Number(process.env.CERTIFICATE_AMOUNT_PAISE || 3900);
const CERTIFICATE_CURRENCY = process.env.CERTIFICATE_CURRENCY || "INR";
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";

const app = express();
const paymentState = new Map();
const allowedOrigins = FRONTEND_ORIGIN.split(",").map((v) => v.trim()).filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

function requireConfig(res) {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    res.status(500).json({
      error: "Razorpay keys are missing on server. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
    });
    return false;
  }
  return true;
}

function basicAuthHeader() {
  const token = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
  return `Basic ${token}`;
}

function safeEqualHex(expectedHex, receivedHex) {
  try {
    const a = Buffer.from(String(expectedHex || ""), "hex");
    const b = Buffer.from(String(receivedHex || ""), "hex");
    if (a.length === 0 || b.length === 0 || a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

app.post("/api/razorpay/webhook", express.raw({ type: "application/json" }), (req, res) => {
  if (!RAZORPAY_WEBHOOK_SECRET) {
    return res.status(500).json({ error: "Webhook secret missing on server." });
  }

  const signature = req.headers["x-razorpay-signature"];
  if (!signature || typeof signature !== "string") {
    return res.status(400).json({ error: "Missing webhook signature." });
  }

  const expected = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(req.body)
    .digest("hex");

  if (!safeEqualHex(expected, signature)) {
    return res.status(400).json({ error: "Invalid webhook signature." });
  }

  let eventPayload = {};
  try {
    eventPayload = JSON.parse(req.body.toString());
  } catch {
    return res.status(400).json({ error: "Invalid webhook payload." });
  }

  const event = String(eventPayload?.event || "");
  if (event === "payment.captured" || event === "order.paid") {
    const paymentEntity = eventPayload?.payload?.payment?.entity;
    const orderEntity = eventPayload?.payload?.order?.entity;
    const orderId = paymentEntity?.order_id || orderEntity?.id;
    if (orderId) {
      const existing = paymentState.get(orderId) || {};
      paymentState.set(orderId, {
        ...existing,
        status: "paid",
        paymentId: paymentEntity?.id || existing.paymentId || null,
        paidAt: Date.now(),
        webhookEvent: event,
      });
    }
  }

  return res.json({ ok: true });
});

app.use(express.json());

app.post("/api/test/start", (_req, res) => {
  try {
    return res.json(startAssessmentSession());
  } catch {
    return res.status(500).json({ error: "Unable to start assessment." });
  }
});

app.post("/api/test/submit", (req, res) => {
  const attemptToken = String(req.body?.attemptToken || "");
  if (!attemptToken) {
    return res.status(400).json({ error: "Missing attempt token." });
  }

  try {
    const { lockedResults } = buildResultsFromAttempt(
      attemptToken,
      req.body?.answers || {},
      req.body?.timeUsed || 0
    );
    return res.json(lockedResults);
  } catch {
    return res.status(400).json({ error: "Unable to submit assessment." });
  }
});

app.post("/api/payment/create-order", async (req, res) => {
  if (!requireConfig(res)) return;

  const certName = String(req.body?.certName || "").trim();
  if (!certName) {
    return res.status(400).json({ error: "Certificate name is required." });
  }

  const receipt = `cert_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  try {
    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: basicAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: CERTIFICATE_AMOUNT_PAISE,
        currency: CERTIFICATE_CURRENCY,
        receipt,
        notes: { cert_name: certName, source: "iq-test-app" },
      }),
    });

    const data = await rzpRes.json();
    if (!rzpRes.ok) {
      return res.status(502).json({ error: data?.error?.description || "Unable to create Razorpay order." });
    }

    paymentState.set(data.id, {
      status: "created",
      certName,
      amount: data.amount,
      currency: data.currency,
      receipt: data.receipt,
      createdAt: Date.now(),
      paymentId: null,
    });

    return res.json({
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch {
    return res.status(500).json({ error: "Failed to reach Razorpay API." });
  }
});

app.post("/api/payment/verify", async (req, res) => {
  if (!requireConfig(res)) return;

  const orderId = String(req.body?.orderId || "");
  const paymentId = String(req.body?.paymentId || "");
  const signature = String(req.body?.signature || "");
  const resultsToken = String(req.body?.resultsToken || "");
  const knownOrder = paymentState.get(orderId);

  if (!orderId || !paymentId || !signature) {
    return res.status(400).json({ error: "Missing payment verification fields." });
  }
  if (!resultsToken) {
    return res.status(400).json({ success: false, error: "Missing results token for unlock." });
  }
  if (!knownOrder) {
    return res.status(400).json({ success: false, error: "Unknown order. Create order from this app first." });
  }

  const expected = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (!safeEqualHex(expected, signature)) {
    return res.status(400).json({ success: false, error: "Invalid Razorpay signature." });
  }

  try {
    const pRes = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      headers: { Authorization: basicAuthHeader() },
    });
    const payment = await pRes.json();
    if (!pRes.ok) {
      return res.status(502).json({ success: false, error: "Unable to fetch payment details from Razorpay." });
    }

    const validOrder = payment.order_id === orderId;
    const validAmount = Number(payment.amount) === CERTIFICATE_AMOUNT_PAISE;
    const validCurrency = String(payment.currency || "").toUpperCase() === String(CERTIFICATE_CURRENCY || "").toUpperCase();
    const validStatus = payment.status === "captured";

    if (!validOrder || !validAmount || !validCurrency || !validStatus) {
      return res.status(400).json({ success: false, error: "Payment details failed verification checks." });
    }

    const existing = paymentState.get(orderId) || {};
    paymentState.set(orderId, {
      ...existing,
      status: "paid",
      paymentId,
      paidAt: Date.now(),
    });

    const results = unlockResults(resultsToken);
    return res.json({ success: true, results });
  } catch {
    return res.status(500).json({ success: false, error: "Payment verification failed due to server error." });
  }
});

app.get("/api/payment/status/:orderId", (req, res) => {
  const orderId = String(req.params.orderId || "");
  const state = paymentState.get(orderId);
  return res.json({
    found: Boolean(state),
    paid: state?.status === "paid",
    status: state?.status || "unknown",
  });
});

app.listen(PORT, () => {
  console.log(`[payment-server] listening on http://localhost:${PORT}`);
});
