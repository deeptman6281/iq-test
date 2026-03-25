import crypto from "crypto";

export const CERTIFICATE_AMOUNT_PAISE = Number(process.env.CERTIFICATE_AMOUNT_PAISE || 3900);
export const CERTIFICATE_CURRENCY = process.env.CERTIFICATE_CURRENCY || "INR";

export function getConfig() {
  return {
    keyId: process.env.RAZORPAY_KEY_ID || "",
    keySecret: process.env.RAZORPAY_KEY_SECRET || "",
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  };
}

export function hasRequiredKeys() {
  const cfg = getConfig();
  return Boolean(cfg.keyId && cfg.keySecret);
}

export function basicAuthHeader() {
  const { keyId, keySecret } = getConfig();
  const token = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  return `Basic ${token}`;
}

export function safeEqualHex(expectedHex, receivedHex) {
  try {
    const a = Buffer.from(String(expectedHex || ""), "hex");
    const b = Buffer.from(String(receivedHex || ""), "hex");
    if (a.length === 0 || b.length === 0 || a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function buildPaymentSignature(orderId, paymentId, keySecret) {
  return crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
}

export function buildWebhookSignature(rawBodyBuffer, webhookSecret) {
  return crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBodyBuffer)
    .digest("hex");
}

export function sendMethodNotAllowed(res, allowed) {
  res.setHeader("Allow", allowed);
  return res.status(405).json({ error: `Method not allowed. Use ${allowed.join(", ")}.` });
}

export async function readRawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === "string") return Buffer.from(req.body);
  if (req.body && typeof req.body === "object") return Buffer.from(JSON.stringify(req.body));

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export async function readJsonBody(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return req.body;
  }
  if (typeof req.body === "string") {
    return JSON.parse(req.body || "{}");
  }
  const raw = await readRawBody(req);
  if (!raw.length) return {};
  return JSON.parse(raw.toString("utf8"));
}
