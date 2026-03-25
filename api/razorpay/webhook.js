import {
  buildWebhookSignature,
  getConfig,
  readRawBody,
  safeEqualHex,
  sendMethodNotAllowed,
} from "../_lib/razorpay.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res, ["POST"]);
  }

  const { webhookSecret } = getConfig();
  if (!webhookSecret) {
    return res.status(500).json({ error: "Webhook secret missing on server." });
  }

  try {
    const rawBody = await readRawBody(req);
    const signature = req.headers["x-razorpay-signature"];
    if (!signature || typeof signature !== "string") {
      return res.status(400).json({ error: "Missing webhook signature." });
    }

    const expected = buildWebhookSignature(rawBody, webhookSecret);
    if (!safeEqualHex(expected, signature)) {
      return res.status(400).json({ error: "Invalid webhook signature." });
    }

    const payload = JSON.parse(rawBody.toString("utf8") || "{}");
    const event = String(payload?.event || "");

    return res.status(200).json({ ok: true, event });
  } catch (error) {
    return res.status(400).json({
      error: `Invalid webhook payload. ${error?.message || ""}`.trim(),
    });
  }
}
