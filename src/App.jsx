import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import { pickRandomQuestions, ALL_CATEGORIES } from "./questions.js";

const AUTHORITY  = "NeuroMark Institute";
const CERT_PRICE = "₹39";
const TOTAL_TIME = 20 * 60;

// ── IQ scoring ────────────────────────────────────────────
function getIQScore(correct, total, timeLeft) {
  const base      = (correct / total) * 100;
  const timeBonus = timeLeft > 0 ? Math.round((timeLeft / TOTAL_TIME) * 8) : 0;
  return Math.min(Math.round(70 + (base / 100) * 60 + timeBonus), 145);
}

function getIQLabel(iq) {
  if (iq >= 130) return { label: "Gifted / Very Superior" };
  if (iq >= 120) return { label: "Superior" };
  if (iq >= 110) return { label: "High Average" };
  if (iq >= 90)  return { label: "Average" };
  if (iq >= 80)  return { label: "Low Average" };
  return           { label: "Below Average" };
}

function getIQLabelColor(iq) {
  if (iq >= 130) return "#a78bfa";
  if (iq >= 120) return "#60a5fa";
  if (iq >= 110) return "#34d399";
  if (iq >= 90)  return "#fbbf24";
  if (iq >= 80)  return "#f97316";
  return           "#f87171";
}

function generateCertID() {
  return "NM1-" +
    Math.random().toString(36).substring(2, 5).toUpperCase() +
    Math.random().toString(36).substring(2, 5).toUpperCase() +
    "FQD-USRK";
}

// ── PDF helpers ───────────────────────────────────────────
function loadImageAsDataURL(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      c.getContext("2d").drawImage(img, 0, 0);
      resolve(c.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null);
    img.src = url + "?t=" + Date.now();
  });
}

function getCatBarColor(pct) {
  if (pct >= 75) return [46, 139, 79];
  if (pct >= 50) return [212, 160, 23];
  return [200, 50, 50];
}

// ── Colors ────────────────────────────────────────────────
const NAVY  = [26, 16, 64];
const GOLD  = [184, 150, 62];
const BROWN = [107, 92, 62];
const MID   = [74, 63, 47];

// ─────────────────────────────────────────────────────────
//  POSITION CONSTANTS (A4 landscape = 297 × 210 mm)
//  Tweak here → Ctrl+S → re-download PDF to check
// ─────────────────────────────────────────────────────────
const P = {
  titleX:      148,  titleY:      35,
  taglineY:     41,
  certTitleY:   52,
  certifyY:     67,
  nameY:        80,
  completedY:   94,

  boxCX:        83,
  iqNumY:      122,
  iqLabelY:    130,
  divLine1Y:   132,
  iqScoreLblY: 139,
  assessLblY:  148,
  certLblY:    153,

  profLblX:    128,  profLblY:   108,
  catX:        128,
  pctX:        228,
  barStartX:   168,
  barEndX:     258,
  barH:          4,
  row1Y:       116,
  rowGap:        8,

  sigLineX1:   125,  sigLineX2:  186,  sigLineY:   183,
  sigNameX:    155,  sigNameY:   180,
  sigTitle1Y:  188,
  sigTitle2Y:  194,

  dateX:       282,  dateY:      182,
  certIDY:     187,
  verifyY:     191,
};

// ── Certificate PDF generator ─────────────────────────────
async function generateVectorPDF(name, iq, label, certID, date, catScores) {
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297, H = 210;

  const [bgData, signData] = await Promise.all([
    loadImageAsDataURL("/cert.png"),
    loadImageAsDataURL("/sign.png"),
  ]);
  if (bgData) pdf.addImage(bgData, "PNG", 0, 0, W, H);

  // Header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(26);
  pdf.setTextColor(...NAVY);
  pdf.text("NEUROMARK INSTITUTE", P.titleX, P.titleY, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(...BROWN);
  pdf.text("Global Centre for Cognitive Assessment", P.titleX, P.taglineY, { align: "center" });

  pdf.setFont("times", "italic");
  pdf.setFontSize(20);
  pdf.setTextColor(...GOLD);
  pdf.text("Certificate of Cognitive Assessment", P.titleX, P.certTitleY, { align: "center" });

  // Body
  pdf.setFont("times", "normal");
  pdf.setFontSize(14);
  pdf.setTextColor(...MID);
  pdf.text("This is to certify that", P.titleX, P.certifyY, { align: "center" });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);
  pdf.setTextColor(...NAVY);
  pdf.text(name || "Candidate", P.titleX, P.nameY, { align: "center" });

  const nw = pdf.getTextWidth(name || "Candidate");
  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.5);
  pdf.line(P.titleX - nw / 2, P.nameY + 3, P.titleX + nw / 2, P.nameY + 3);

  pdf.setFont("times", "normal");
  pdf.setFontSize(13);
  pdf.setTextColor(...MID);
  pdf.text("has successfully completed the NeuroMark Cognitive Assessment", P.titleX, P.completedY, { align: "center" });

  // IQ Score box
  pdf.setFont("times", "bold");
  pdf.setFontSize(40);
  pdf.setTextColor(...GOLD);
  pdf.text(String(iq), P.boxCX, P.iqNumY, { align: "center" });

  pdf.setFontSize(13);
  pdf.setTextColor(...NAVY);
  pdf.text(label, P.boxCX, P.iqLabelY, { align: "center" });

  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.3);
  pdf.line(P.boxCX - 24, P.divLine1Y, P.boxCX + 24, P.divLine1Y);

  pdf.setFont("times", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...BROWN);
  pdf.text("IQ SCORE",                   P.boxCX, P.iqScoreLblY, { align: "center" });
  pdf.text("NeuroMark Assessment 2026",  P.boxCX, P.assessLblY,  { align: "center" });
  pdf.text("NeuroMark Certified - 2026", P.boxCX, P.certLblY,    { align: "center" });

  // Cognitive profile
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(...NAVY);
  pdf.text("COGNITIVE PROFILE", P.profLblX, P.profLblY);

  const barMaxW = P.barEndX - P.barStartX;
  Object.keys(catScores).forEach((cat, i) => {
    const s   = catScores[cat];
    const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
    const y   = P.row1Y + i * P.rowGap;

    const shortName = cat
      .replace(" / ", "/").replace("Reasoning", "Rsng")
      .replace("Recognition", "Recog").replace("Numerical", "Num")
      .replace("Language", "Lang").replace("Memory", "Mem");

    pdf.setFont("times", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(...MID);
    pdf.text(shortName, P.catX, y);

    pdf.setFont("times", "bold");
    pdf.setFontSize(8.5);
    pdf.setTextColor(...NAVY);
    pdf.text(pct + "%", P.pctX, y, { align: "right" });

    pdf.setFillColor(232, 220, 195);
    pdf.rect(P.barStartX, y - 3.5, barMaxW, P.barH, "F");

    const [r, g, b] = getCatBarColor(pct);
    pdf.setFillColor(r, g, b);
    const fillW = Math.max(1, (barMaxW * pct) / 100);
    pdf.rect(P.barStartX, y - 3.5, fillW, P.barH, "F");

    if (pct >= 15) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      pdf.setTextColor(255, 255, 255);
      pdf.text(pct + "%", P.barStartX + fillW - 1, y - 0.5, { align: "right" });
    }
  });

  // Signature
  pdf.setDrawColor(...MID);
  pdf.setLineWidth(0.3);
  pdf.line(P.sigLineX1, P.sigLineY, P.sigLineX2, P.sigLineY);

  if (signData) {
    const sigW = 60, sigH = 19;
    pdf.addImage(signData, "PNG", P.sigNameX - sigW / 2, P.sigLineY - sigH + 2, sigW, sigH);
  }

  pdf.setFont("times", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(...MID);
  pdf.text("Chief Assessment Officer", P.sigNameX, P.sigTitle1Y, { align: "center" });
  pdf.text("NeuroMark Institute",      P.sigNameX, P.sigTitle2Y, { align: "center" });

  // Date & ID
  pdf.setFont("times", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...NAVY);
  pdf.text("Date: " + date, P.dateX, P.dateY, { align: "right" });

  pdf.setFont("times", "normal");
  pdf.text("Certificate ID: " + certID, P.dateX, P.certIDY, { align: "right" });

  pdf.setFontSize(8);
  pdf.setTextColor(...BROWN);
  pdf.text("Verify at neuromark.institute", P.dateX, P.verifyY, { align: "right" });

  pdf.save(`IQ_Certificate_${name || "Candidate"}.pdf`);
}

// ─────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────
export default function IQTest() {
  const [QUESTIONS] = useState(() => pickRandomQuestions());

  const [screen,       setScreen]       = useState("intro");
  const [current,      setCurrent]      = useState(0);
  const [answers,      setAnswers]      = useState({});
  const [selected,     setSelected]     = useState(null);
  const [timeLeft,     setTimeLeft]     = useState(TOTAL_TIME);
  const [certName,     setCertName]     = useState("");
  const [certID]                        = useState(generateCertID);
  const [showPaywall,  setShowPaywall]  = useState(false);
  const [paid,         setPaid]         = useState(false);
  const [certGenerated,setCertGenerated]= useState(false);
  const [generating,   setGenerating]   = useState(false);

  const timerRef  = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (screen === "test") {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); setScreen("result"); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen]);

  const handleNext = () => {
    if (selected === null) return;
    const na = { ...answers, [current]: selected };
    setAnswers(na);
    setSelected(null);
    if (current + 1 >= QUESTIONS.length) {
      clearInterval(timerRef.current);
      setScreen("result");
    } else {
      setCurrent(c => c + 1);
    }
  };

  const formatTime = s =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const computeResults = () => {
    let correct = 0;
    const catScores = {};
    ALL_CATEGORIES.forEach(c => catScores[c] = { correct: 0, total: 0 });
    QUESTIONS.forEach((q, i) => {
      catScores[q.category].total++;
      if (answers[i] === q.answer) { correct++; catScores[q.category].correct++; }
    });
    return {
      correct,
      total: QUESTIONS.length,
      iq: getIQScore(correct, QUESTIONS.length, timeLeft),
      catScores,
      timeUsed: TOTAL_TIME - timeLeft,
    };
  };

  const handleDownloadPDF = async () => {
    const { iq, catScores } = computeResults();
    const { label } = getIQLabel(iq);
    const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    setGenerating(true);
    try {
      await generateVectorPDF(certName, iq, label, certID, date, catScores);
      setCertGenerated(true);
    } finally {
      setGenerating(false);
    }
  };

  const handleRetake = () => {
    setScreen("intro"); setCurrent(0); setAnswers({}); setSelected(null);
    setTimeLeft(TOTAL_TIME); setPaid(false); setCertGenerated(false); setCertName("");
  };

  const progress     = (current / QUESTIONS.length) * 100;
  const timerUrgent  = timeLeft < 120;
  const q            = QUESTIONS[current];

  const CAT_ICONS = {
    "Logical Reasoning":   "🔗",
    "Pattern Recognition": "🔷",
    "Math / Numerical":    "📐",
    "Verbal / Language":   "📝",
    "Spatial Reasoning":   "🧊",
    "Working Memory":      "🧠",
  };

  // ── INTRO ───────────────────────────────────────────────
  if (screen === "intro") return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.badge}>COGNITIVE ASSESSMENT</div>
        <h1 style={S.title}>IQ<span style={{ color: "#a78bfa" }}>Test</span></h1>
        <p style={S.subtitle}>A scientifically-inspired assessment across 6 cognitive dimensions</p>
        <div style={S.categoryGrid}>
          {Object.entries(CAT_ICONS).map(([name, icon]) => (
            <div key={name} style={S.catChip}><span>{icon}</span> {name}</div>
          ))}
        </div>
        <div style={S.infoRow}>
          <div style={S.infoBox}><span style={S.infoNum}>20</span><span style={S.infoLabel}>Questions</span></div>
          <div style={S.infoBox}><span style={S.infoNum}>20</span><span style={S.infoLabel}>Minutes</span></div>
          <div style={S.infoBox}><span style={S.infoNum}>145</span><span style={S.infoLabel}>Max IQ</span></div>
        </div>
        <div style={S.certPreview}>
          🎓 <strong style={{ color: "#fbbf24" }}>Official PDF Certificate</strong> — Download your verified IQ certificate for {CERT_PRICE}
        </div>
        <button style={S.startBtn} onClick={() => setScreen("test")}>Begin Assessment →</button>
        <p style={S.disclaimer}>Issued by {AUTHORITY} · Questions randomised each session</p>
      </div>
    </div>
  );

  // ── TEST ────────────────────────────────────────────────
  if (screen === "test") return (
    <div style={S.page}>
      <div style={S.testCard}>
        <div style={S.testHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={S.qCounter}>{current + 1} / {QUESTIONS.length}</span>
            <span style={S.catTag}>{CAT_ICONS[q.category] || "🧩"} {q.category}</span>
          </div>
          <div style={{ ...S.timer, color: timerUrgent ? "#f87171" : "#a78bfa", borderColor: timerUrgent ? "#f87171" : "#a78bfa" }}>
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>
        <div style={S.progressBg}><div style={{ ...S.progressFill, width: `${progress}%` }} /></div>
        <div style={S.questionBox}><p style={S.questionText}>{q.question}</p></div>
        <div style={S.optionsGrid}>
          {q.options.map((opt, idx) => (
            <button key={idx}
              style={{ ...S.optionBtn, ...(selected === idx ? S.optionSelected : {}) }}
              onClick={() => setSelected(idx)}>
              <span style={S.optionLetter}>{["A", "B", "C", "D"][idx]}</span>{opt}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {current > 0 && (
            <button style={S.skipBtn}
              onClick={() => { setCurrent(c => c - 1); setSelected(answers[current - 1] ?? null); }}>
              ← Back
            </button>
          )}
          <button
            style={{ ...S.nextBtn, opacity: selected === null ? 0.4 : 1, flex: 1 }}
            disabled={selected === null}
            onClick={handleNext}>
            {current + 1 === QUESTIONS.length ? "Submit Test ✓" : "Next Question →"}
          </button>
        </div>
      </div>
    </div>
  );

  // ── RESULT ──────────────────────────────────────────────
  if (screen === "result") {
    const { correct, total, iq, catScores, timeUsed } = computeResults();
    const { label } = getIQLabel(iq);
    const color     = getIQLabelColor(iq);
    const mins      = Math.floor(timeUsed / 60);
    const secs      = timeUsed % 60;

    return (
      <div style={S.page}>
        <div style={S.resultCard}>
          <div style={S.badge}>YOUR RESULTS</div>

          <div style={S.iqRing}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" fill="none" stroke="#1e1b4b" strokeWidth="12" />
              <circle cx="80" cy="80" r="68" fill="none" stroke={color} strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(iq / 145) * 427} 427`}
                transform="rotate(-90 80 80)" />
            </svg>
            <div style={S.iqInner}>
              <div style={{ ...S.iqNumber, color }}>{iq}</div>
              <div style={S.iqLabel}>IQ Score</div>
            </div>
          </div>

          <div style={{ ...S.levelBadge, background: color + "22", color, border: `1px solid ${color}` }}>
            {label}
          </div>

          <div style={S.statsRow}>
            <div style={S.statBox}><span style={S.statNum}>{correct}/{total}</span><span style={S.statLabel}>Correct</span></div>
            <div style={S.statBox}><span style={S.statNum}>{Math.round((correct / total) * 100)}%</span><span style={S.statLabel}>Accuracy</span></div>
            <div style={S.statBox}><span style={S.statNum}>{mins}m {secs}s</span><span style={S.statLabel}>Time</span></div>
          </div>

          <div style={S.breakdownTitle}>Category Breakdown</div>
          {ALL_CATEGORIES.map(cat => {
            const s   = catScores[cat]; if (!s) return null;
            const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
            return (
              <div key={cat} style={S.catRow}>
                <div style={S.catRowLeft}>
                  <span>{CAT_ICONS[cat]}</span>
                  <span style={S.catRowName}>{cat}</span>
                </div>
                <div style={S.catBarBg}>
                  <div style={{ ...S.catBarFill, width: `${pct}%`, background: pct >= 75 ? "#34d399" : pct >= 50 ? "#fbbf24" : "#f87171" }} />
                </div>
                <span style={S.catPct}>{s.correct}/{s.total}</span>
              </div>
            );
          })}

          {/* Certificate section */}
          <div style={S.certSection}>
            <div style={S.certHeader}>
              <span style={{ fontSize: 28 }}>🎓</span>
              <div>
                <div style={S.certTitle}>Official PDF Certificate</div>
                <div style={S.certSubtitle}>Vector quality · Never blurs when zoomed</div>
              </div>
              <div style={S.certPrice}>{CERT_PRICE}</div>
            </div>
            <div style={S.certFeatures}>
              {["NeuroMark design", "Name & IQ score", "Cognitive profile bars", "Instant PDF"].map(f => (
                <div key={f} style={S.certFeature}><span style={{ color: "#fbbf24" }}>✓</span> {f}</div>
              ))}
            </div>
            {!paid ? (
              <>
                <input style={S.nameInput}
                  placeholder="Enter your full name for the certificate"
                  value={certName}
                  onChange={e => setCertName(e.target.value)}
                  maxLength={40} />
                <button style={S.certBtn} onClick={() => { if (certName.trim()) setShowPaywall(true); }}>
                  🏆 Get My Certificate — {CERT_PRICE}
                </button>
                {!certName.trim() && (
                  <p style={{ color: "#64748b", fontSize: 11, margin: "6px 0 0", textAlign: "center" }}>
                    Enter your name above to continue
                  </p>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <button
                  style={{ ...S.certBtn, background: "linear-gradient(135deg,#059669,#34d399)", opacity: generating ? 0.7 : 1 }}
                  onClick={handleDownloadPDF}
                  disabled={generating}>
                  {generating ? "⏳ Generating..." : "📄 Download PDF Certificate"}
                </button>
                {certGenerated && (
                  <p style={{ color: "#34d399", fontSize: 12, marginTop: 8 }}>✅ Certificate downloaded! 🎉</p>
                )}
              </div>
            )}
          </div>

          {/* Paywall modal */}
          
          {showPaywall && (
            <div style={S.modal}>
              <div style={S.modalCard}>
                <div style={{ fontSize: 40, textAlign: "center", marginBottom: 12 }}>🏆</div>

                <div style={S.modalTitle}>Complete Your Certificate</div>
                <div style={S.modalName}>{certName}</div>

                <div style={S.modalIQ}>
                  IQ Score: <strong style={{ color: "#a78bfa" }}>{iq}</strong> — {label}
                </div>

                <div style={S.modalPrice}>{CERT_PRICE} only</div>

                <p style={{ color: "#94a3b8", fontSize: 12, textAlign: "center", margin: "0 0 16px" }}>
                  One-time · Instant PDF · No subscription
                </p>

                {/* Pay Button */}
                <button
                  style={S.payBtn}
                  onClick={() => {
                    window.open("https://rzp.io/rzp/HHFEhW1", "_blank");
                  }}
                >
                  Pay {CERT_PRICE}
                </button>

                {/* Manual confirmation */}
                <button
                  style={{ ...S.payBtn, background: "#1e293b", marginTop: 10 }}
                  onClick={() => {
                    setPaid(true);
                    setShowPaywall(false);
                  }}
                >
                  ✅ I have completed payment
                </button>

                {/* Cancel */}
                <button
                  style={S.cancelBtn}
                  onClick={() => setShowPaywall(false)}
                >
                  Cancel
                </button>

                {/* Instruction */}
                <p style={{ color: "#94a3b8", fontSize: 12, textAlign: "center", marginTop: 8 }}>
                  After payment, return here and click "I have completed payment"
                </p>

                {/* Secure note */}
                <p style={{ color: "#475569", fontSize: 10, textAlign: "center", marginTop: 8 }}>
                  🔒 Secure payment
                </p>
              </div>
            </div>
          )}

          <button style={{ ...S.startBtn, marginTop: 16 }} onClick={handleRetake}>
            Retake Test ↺ · Refresh page for new questions
          </button>
        </div>
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    );
  }
}

// ── Styles ────────────────────────────────────────────────
const S = {
  page:          { minHeight: "100vh", background: "linear-gradient(135deg,#0f0c29 0%,#1a1040 50%,#0f0c29 100%)", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "32px 16px", fontFamily: "'Georgia',serif" },
  card:          { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 24, padding: "48px 40px", maxWidth: 540, width: "100%", textAlign: "center", backdropFilter: "blur(20px)", boxShadow: "0 0 80px rgba(167,139,250,0.1)" },
  badge:         { display: "inline-block", background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.4)", borderRadius: 100, padding: "4px 16px", fontSize: 11, letterSpacing: 3, fontFamily: "monospace", marginBottom: 20 },
  title:         { fontSize: 56, fontWeight: 900, color: "#f1f5f9", margin: "0 0 8px", letterSpacing: -2 },
  subtitle:      { color: "#94a3b8", fontSize: 15, marginBottom: 32, lineHeight: 1.6 },
  categoryGrid:  { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 32 },
  catChip:       { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "6px 14px", fontSize: 12, color: "#cbd5e1", display: "flex", alignItems: "center", gap: 6 },
  infoRow:       { display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 },
  infoBox:       { display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 16, padding: "16px 24px" },
  infoNum:       { fontSize: 28, fontWeight: 900, color: "#a78bfa" },
  infoLabel:     { fontSize: 11, color: "#64748b", letterSpacing: 1, marginTop: 2, fontFamily: "monospace" },
  certPreview:   { background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#cbd5e1", marginBottom: 24, lineHeight: 1.6 },
  startBtn:      { width: "100%", padding: "16px", background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5, boxShadow: "0 8px 32px rgba(124,58,237,0.4)" },
  disclaimer:    { color: "#475569", fontSize: 11, marginTop: 16, fontFamily: "monospace" },
  testCard:      { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 24, padding: "36px 32px", maxWidth: 580, width: "100%", backdropFilter: "blur(20px)" },
  testHeader:    { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  qCounter:      { color: "#94a3b8", fontSize: 13, fontFamily: "monospace" },
  catTag:        { background: "rgba(167,139,250,0.12)", color: "#a78bfa", borderRadius: 100, padding: "3px 12px", fontSize: 12, border: "1px solid rgba(167,139,250,0.3)" },
  timer:         { fontFamily: "monospace", fontSize: 15, fontWeight: 700, border: "1px solid", borderRadius: 8, padding: "4px 12px" },
  progressBg:    { height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 100, marginBottom: 28, overflow: "hidden" },
  progressFill:  { height: "100%", background: "linear-gradient(90deg,#7c3aed,#a78bfa)", borderRadius: 100, transition: "width 0.4s ease" },
  questionBox:   { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px", marginBottom: 24 },
  questionText:  { color: "#e2e8f0", fontSize: 17, lineHeight: 1.7, margin: 0, fontWeight: 500 },
  optionsGrid:   { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 },
  optionBtn:     { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 16px", color: "#cbd5e1", fontSize: 14, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10, fontFamily: "'Georgia',serif" },
  optionSelected:{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.6)", color: "#f1f5f9" },
  optionLetter:  { background: "rgba(167,139,250,0.2)", color: "#a78bfa", borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, fontFamily: "monospace" },
  nextBtn:       { padding: "14px", background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" },
  skipBtn:       { padding: "14px 20px", background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 14, cursor: "pointer", fontFamily: "'Georgia',serif" },
  resultCard:    { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 24, padding: "40px 36px", maxWidth: 580, width: "100%", backdropFilter: "blur(20px)", textAlign: "center" },
  iqRing:        { position: "relative", width: 160, height: 160, margin: "24px auto 16px" },
  iqInner:       { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" },
  iqNumber:      { fontSize: 40, fontWeight: 900, lineHeight: 1 },
  iqLabel:       { color: "#64748b", fontSize: 11, fontFamily: "monospace", letterSpacing: 1 },
  levelBadge:    { display: "inline-block", borderRadius: 100, padding: "6px 20px", fontSize: 13, fontWeight: 700, letterSpacing: 0.5, marginBottom: 24 },
  statsRow:      { display: "flex", gap: 12, justifyContent: "center", marginBottom: 28 },
  statBox:       { display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 20px", flex: 1 },
  statNum:       { fontSize: 22, fontWeight: 800, color: "#f1f5f9" },
  statLabel:     { fontSize: 10, color: "#64748b", fontFamily: "monospace", letterSpacing: 1, marginTop: 2 },
  breakdownTitle:{ color: "#94a3b8", fontSize: 11, letterSpacing: 2, fontFamily: "monospace", textAlign: "left", marginBottom: 12 },
  catRow:        { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  catRowLeft:    { display: "flex", alignItems: "center", gap: 6, width: 160, textAlign: "left" },
  catRowName:    { color: "#cbd5e1", fontSize: 12, whiteSpace: "nowrap" },
  catBarBg:      { flex: 1, height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 100, overflow: "hidden" },
  catBarFill:    { height: "100%", borderRadius: 100, transition: "width 1s ease" },
  catPct:        { color: "#64748b", fontSize: 12, fontFamily: "monospace", width: 32 },
  certSection:   { background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 20, padding: "24px", marginTop: 24, textAlign: "left" },
  certHeader:    { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  certTitle:     { color: "#fbbf24", fontWeight: 700, fontSize: 16 },
  certSubtitle:  { color: "#94a3b8", fontSize: 12 },
  certPrice:     { marginLeft: "auto", background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.4)", borderRadius: 100, padding: "4px 14px", fontSize: 16, fontWeight: 700 },
  certFeatures:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 16 },
  certFeature:   { color: "#cbd5e1", fontSize: 12, display: "flex", gap: 6, alignItems: "flex-start" },
  nameInput:     { width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#f1f5f9", fontSize: 14, marginBottom: 12, boxSizing: "border-box", fontFamily: "'Georgia',serif", outline: "none" },
  certBtn:       { width: "100%", padding: "14px", background: "linear-gradient(135deg,#b8963e,#fbbf24)", color: "#1a0f00", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 24px rgba(184,150,62,0.4)" },
  modal:         { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 },
  modalCard:     { background: "#1a1040", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 24, padding: "36px 32px", maxWidth: 380, width: "100%", boxShadow: "0 0 60px rgba(251,191,36,0.15)" },
  modalTitle:    { color: "#f1f5f9", fontSize: 20, fontWeight: 700, textAlign: "center", marginBottom: 8 },
  modalName:     { color: "#a78bfa", fontSize: 22, fontWeight: 700, textAlign: "center", marginBottom: 4 },
  modalIQ:       { color: "#94a3b8", fontSize: 14, textAlign: "center", marginBottom: 16 },
  modalPrice:    { color: "#fbbf24", fontSize: 36, fontWeight: 900, textAlign: "center", marginBottom: 4 },
  payBtn:        { width: "100%", padding: "14px", background: "linear-gradient(135deg,#b8963e,#fbbf24)", color: "#1a0f00", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 10, boxShadow: "0 6px 24px rgba(184,150,62,0.4)" },
  cancelBtn:     { width: "100%", padding: "12px", background: "transparent", color: "#64748b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 14, cursor: "pointer", fontFamily: "'Georgia',serif" },
};
