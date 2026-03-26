import {
  CERTIFICATE_AMOUNT_PAISE,
  CERTIFICATE_CURRENCY,
  basicAuthHeader,
  buildPaymentSignature,
  getConfig,
  hasRequiredKeys,
  readJsonBody,
  safeEqualHex,
  sendMethodNotAllowed,
} from "../_lib/razorpay.js";
import { unlockResults } from "../../shared/assessment.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res, ["POST"]);
  }

  if (!hasRequiredKeys()) {
    return res.status(500).json({
      success: false,
      error: "Razorpay keys are missing on server. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
    });
  }

  try {
    const body = await readJsonBody(req);
    const orderId = String(body?.orderId || "");
    const paymentId = String(body?.paymentId || "");
    const signature = String(body?.signature || "");
    const resultsToken = String(body?.resultsToken || "");

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ success: false, error: "Missing payment verification fields." });
    }
    if (!resultsToken) {
      return res.status(400).json({ success: false, error: "Missing results token for unlock." });
    }

    const { keySecret } = getConfig();
    const expected = buildPaymentSignature(orderId, paymentId, keySecret);
    if (!safeEqualHex(expected, signature)) {
      return res.status(400).json({ success: false, error: "Invalid Razorpay signature." });
    }

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
    const validStatus = payment.status === "captured" || payment.status === "authorized";

    if (!validOrder || !validAmount || !validCurrency || !validStatus) {
      return res.status(400).json({ success: false, error: "Payment details failed verification checks." });
    }

    const results = unlockResults(resultsToken);
    return res.status(200).json({ success: true, results });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Payment verification failed due to server error. ${error?.message || ""}`.trim(),
    });
  }
}
