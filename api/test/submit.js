import { readJsonBody, sendMethodNotAllowed } from "../_lib/razorpay.js";
import { buildResultsFromAttempt } from "../../shared/assessment.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res, ["POST"]);
  }

  try {
    const body = await readJsonBody(req);
    const attemptToken = String(body?.attemptToken || "");
    if (!attemptToken) {
      return res.status(400).json({ error: "Missing attempt token." });
    }

    const { lockedResults } = buildResultsFromAttempt(
      attemptToken,
      body?.answers || {},
      body?.timeUsed || 0
    );

    return res.status(200).json(lockedResults);
  } catch (error) {
    return res.status(400).json({
      error: `Unable to submit assessment. ${error?.message || ""}`.trim(),
    });
  }
}
