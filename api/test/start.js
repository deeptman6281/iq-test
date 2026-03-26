import { sendMethodNotAllowed } from "../_lib/razorpay.js";
import { startAssessmentSession } from "../../shared/assessment.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res, ["POST"]);
  }

  try {
    const session = startAssessmentSession();
    return res.status(200).json(session);
  } catch (error) {
    return res.status(500).json({
      error: `Unable to start assessment. ${error?.message || ""}`.trim(),
    });
  }
}
