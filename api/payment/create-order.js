import {
  CERTIFICATE_AMOUNT_PAISE,
  CERTIFICATE_CURRENCY,
  basicAuthHeader,
  hasRequiredKeys,
  readJsonBody,
  sendMethodNotAllowed,
} from "../_lib/razorpay.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res, ["POST"]);
  }

  if (!hasRequiredKeys()) {
    return res.status(500).json({
      error: "Razorpay keys are missing on server. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
    });
  }

  try {
    const body = await readJsonBody(req);
    const certName = String(body?.certName || "").trim();
    if (!certName) {
      return res.status(400).json({ error: "Certificate name is required." });
    }

    const receipt = `cert_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
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
      return res.status(502).json({
        error: data?.error?.description || "Unable to create Razorpay order.",
      });
    }

    return res.status(200).json({
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(500).json({
      error: `Failed to create payment order. ${error?.message || ""}`.trim(),
    });
  }
}
