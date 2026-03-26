import crypto from "crypto";
import { pickRandomQuestions } from "../src/questions.js";

export const TOTAL_TIME_SECONDS = 20 * 60;

function getSealingSecret() {
  return (
    process.env.RESULTS_TOKEN_SECRET ||
    process.env.RAZORPAY_KEY_SECRET ||
    "local-assessment-secret-change-me"
  );
}

function getCipherKey() {
  return crypto.createHash("sha256").update(getSealingSecret()).digest();
}

function sealPayload(payload) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getCipherKey(), iv);
  const serialized = JSON.stringify(payload);
  const encrypted = Buffer.concat([cipher.update(serialized, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

function openPayload(token) {
  const packed = Buffer.from(String(token || ""), "base64url");
  const iv = packed.subarray(0, 12);
  const tag = packed.subarray(12, 28);
  const encrypted = packed.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", getCipherKey(), iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  return JSON.parse(decrypted);
}

export function sanitizeQuestionsForClient(questions) {
  return questions.map(({ answer, ...rest }) => rest);
}

export function startAssessmentSession() {
  const questions = pickRandomQuestions();
  const answerKey = questions.map((q) => ({
    id: q.id,
    answer: q.answer,
    category: q.category,
  }));

  return {
    questions: sanitizeQuestionsForClient(questions),
    attemptToken: sealPayload({
      answerKey,
      issuedAt: Date.now(),
    }),
  };
}

function getIQScore(correct, total, timeLeft) {
  const base = (correct / total) * 100;
  const timeBonus = timeLeft > 0 ? Math.round((timeLeft / TOTAL_TIME_SECONDS) * 8) : 0;
  return Math.min(Math.round(70 + (base / 100) * 60 + timeBonus), 145);
}

function getIQLabel(iq) {
  if (iq >= 130) return "Gifted / Very Superior";
  if (iq >= 120) return "Superior";
  if (iq >= 110) return "High Average";
  if (iq >= 90) return "Average";
  if (iq >= 80) return "Low Average";
  return "Below Average";
}

function getPercentileBand(correct, total, timeUsed) {
  const accuracy = total > 0 ? correct / total : 0;
  const paceScore = TOTAL_TIME_SECONDS > 0 ? Math.max(0, 1 - timeUsed / TOTAL_TIME_SECONDS) : 0;
  const composite = accuracy * 0.82 + paceScore * 0.18;
  if (composite >= 0.88) return "Top 10% band";
  if (composite >= 0.78) return "Top 15% band";
  if (composite >= 0.68) return "Top 25% band";
  if (composite >= 0.58) return "Top 35% band";
  return "Top 50% band";
}

function getStrongestCategory(catScores) {
  return Object.entries(catScores)
    .filter(([, score]) => score.total > 0)
    .map(([category, score]) => ({
      category,
      pct: Math.round((score.correct / score.total) * 100),
    }))
    .sort((a, b) => b.pct - a.pct)[0] || null;
}

export function buildResultsFromAttempt(attemptToken, answersInput, elapsedSecondsInput) {
  const attempt = openPayload(attemptToken);
  const answers = answersInput && typeof answersInput === "object" ? answersInput : {};
  const elapsedSeconds = Math.max(0, Math.min(TOTAL_TIME_SECONDS, Number(elapsedSecondsInput || 0)));

  const catScores = {};
  let correct = 0;
  attempt.answerKey.forEach((item) => {
    if (!catScores[item.category]) catScores[item.category] = { correct: 0, total: 0 };
    catScores[item.category].total += 1;
    if (Number(answers[item.id]) === item.answer) {
      correct += 1;
      catScores[item.category].correct += 1;
    }
  });

  const total = attempt.answerKey.length;
  const timeLeft = Math.max(0, TOTAL_TIME_SECONDS - elapsedSeconds);
  const finalScore = getIQScore(correct, total, timeLeft);
  const strongestCategory = getStrongestCategory(catScores);
  const percentileBand = getPercentileBand(correct, total, elapsedSeconds);

  const results = {
    correct,
    total,
    timeUsed: elapsedSeconds,
    finalScore,
    finalLabel: getIQLabel(finalScore),
    percentileBand,
    strongestCategory,
    catScores,
  };

  return {
    lockedResults: {
      correct,
      total,
      timeUsed: elapsedSeconds,
      percentileBand,
      strongestCategory,
      catScores,
      resultsToken: sealPayload(results),
    },
    unlockedResults: results,
  };
}

export function unlockResults(resultsToken) {
  return openPayload(resultsToken);
}
