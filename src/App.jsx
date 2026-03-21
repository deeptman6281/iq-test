import { useState, useEffect, useRef } from "react";

const QUESTIONS = [
  // Logical Reasoning
  {
    id: 1, category: "Logical Reasoning", categoryIcon: "🔗",
    question: "All roses are flowers. Some flowers fade quickly. Therefore:",
    options: ["All roses fade quickly", "Some roses may fade quickly", "No roses fade quickly", "Roses never fade"],
    answer: 1, difficulty: 1
  },
  {
    id: 2, category: "Logical Reasoning", categoryIcon: "🔗",
    question: "If A > B, and B > C, and C > D, which is true?",
    options: ["D > A", "A > D", "B > A", "C > A"],
    answer: 1, difficulty: 2
  },
  {
    id: 3, category: "Logical Reasoning", categoryIcon: "🔗",
    question: "In a row of 5 people, Alex is to the left of Ben. Ben is to the right of Carol. Dan is between Carol and Alex. Who is at the far left?",
    options: ["Alex", "Ben", "Carol", "Dan"],
    answer: 2, difficulty: 3
  },
  {
    id: 4, category: "Logical Reasoning", categoryIcon: "🔗",
    question: "If some Zips are Zaps, and all Zaps are Zops, then:",
    options: ["All Zips are Zops", "Some Zips are Zops", "No Zips are Zops", "All Zops are Zips"],
    answer: 1, difficulty: 2
  },

  // Pattern Recognition
  {
    id: 5, category: "Pattern Recognition", categoryIcon: "🔷",
    question: "What comes next in the series: 2, 4, 8, 16, ?",
    options: ["24", "30", "32", "36"],
    answer: 2, difficulty: 1
  },
  {
    id: 6, category: "Pattern Recognition", categoryIcon: "🔷",
    question: "What comes next: 1, 1, 2, 3, 5, 8, ?",
    options: ["11", "12", "13", "14"],
    answer: 2, difficulty: 2
  },
  {
    id: 7, category: "Pattern Recognition", categoryIcon: "🔷",
    question: "Which number completes the pattern? 3, 6, 11, 18, 27, ?",
    options: ["36", "38", "40", "42"],
    answer: 1, difficulty: 3
  },
  {
    id: 8, category: "Pattern Recognition", categoryIcon: "🔷",
    question: "A ○ B ● C ○ D ● E ○ ? — What symbol follows?",
    options: ["○", "●", "△", "□"],
    answer: 1, difficulty: 2
  },

  // Math / Numerical
  {
    id: 9, category: "Math / Numerical", categoryIcon: "📐",
    question: "If a train travels at 60 km/h and the journey takes 2.5 hours, how far does it travel?",
    options: ["120 km", "130 km", "150 km", "160 km"],
    answer: 2, difficulty: 1
  },
  {
    id: 10, category: "Math / Numerical", categoryIcon: "📐",
    question: "What is 15% of 240?",
    options: ["32", "34", "36", "38"],
    answer: 2, difficulty: 1
  },
  {
    id: 11, category: "Math / Numerical", categoryIcon: "📐",
    question: "A store reduces a price by 20%, then increases it by 20%. What is the net change?",
    options: ["0%", "-4%", "+4%", "-2%"],
    answer: 1, difficulty: 3
  },
  {
    id: 12, category: "Math / Numerical", categoryIcon: "📐",
    question: "If 5x + 3 = 28, what is 2x?",
    options: ["8", "10", "12", "14"],
    answer: 1, difficulty: 2
  },

  // Verbal / Language
  {
    id: 13, category: "Verbal / Language", categoryIcon: "📝",
    question: "Choose the word most opposite in meaning to BENEVOLENT:",
    options: ["Generous", "Malevolent", "Indifferent", "Passive"],
    answer: 1, difficulty: 1
  },
  {
    id: 14, category: "Verbal / Language", categoryIcon: "📝",
    question: "DOCTOR : HOSPITAL :: JUDGE : ?",
    options: ["Law", "Verdict", "Courtroom", "Attorney"],
    answer: 2, difficulty: 1
  },
  {
    id: 15, category: "Verbal / Language", categoryIcon: "📝",
    question: "Which word does NOT belong: Oak, Maple, Fern, Birch?",
    options: ["Oak", "Maple", "Fern", "Birch"],
    answer: 2, difficulty: 2
  },
  {
    id: 16, category: "Verbal / Language", categoryIcon: "📝",
    question: "Complete the analogy: Symphony is to Composer as Sculpture is to ?",
    options: ["Museum", "Canvas", "Sculptor", "Chisel"],
    answer: 2, difficulty: 2
  },

  // Spatial / Visual Reasoning
  {
    id: 17, category: "Spatial Reasoning", categoryIcon: "🧊",
    question: "A cube has 6 faces. If you unfold it flat, how many squares do you see?",
    options: ["4", "5", "6", "8"],
    answer: 2, difficulty: 1
  },
  {
    id: 18, category: "Spatial Reasoning", categoryIcon: "🧊",
    question: "How many triangles are in a Star of David (⭐)?",
    options: ["6", "8", "12", "2"],
    answer: 2, difficulty: 2
  },

  // Working Memory
  {
    id: 19, category: "Working Memory", categoryIcon: "🧠",
    question: "Read once: 7, 3, 9, 1, 5. What is the sum of the 2nd and 4th numbers?",
    options: ["4", "6", "8", "10"],
    answer: 0, difficulty: 2
  },
  {
    id: 20, category: "Working Memory", categoryIcon: "🧠",
    question: "If you reverse the word BRAIN and take the 3rd letter, what do you get?",
    options: ["I", "A", "N", "R"],
    answer: 1, difficulty: 3
  },
];

const TOTAL_TIME = 20 * 60; // 20 minutes

function getIQScore(correct, total, timeBonus) {
  const baseScore = (correct / total) * 100;
  const iq = Math.round(70 + (baseScore / 100) * 60 + timeBonus);
  return Math.min(iq, 145);
}

function getIQLabel(iq) {
  if (iq >= 130) return { label: "Gifted / Very Superior", color: "#a78bfa" };
  if (iq >= 120) return { label: "Superior", color: "#60a5fa" };
  if (iq >= 110) return { label: "High Average", color: "#34d399" };
  if (iq >= 90) return { label: "Average", color: "#fbbf24" };
  if (iq >= 80) return { label: "Low Average", color: "#f97316" };
  return { label: "Below Average", color: "#f87171" };
}

const categories = [...new Set(QUESTIONS.map(q => q.category))];

export default function IQTest() {
  const [screen, setScreen] = useState("intro"); // intro | test | result
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [confirmed, setConfirmed] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (screen === "test") {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); finishTest(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen]);

  const finishTest = () => {
    clearInterval(timerRef.current);
    setScreen("result");
  };

  const handleSelect = (idx) => {
    if (confirmed) return;
    setSelected(idx);
  };

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = { ...answers, [current]: selected };
    setAnswers(newAnswers);
    setSelected(null);
    setConfirmed(false);
    if (current + 1 >= QUESTIONS.length) {
      finishTest();
    } else {
      setCurrent(c => c + 1);
    }
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const computeResults = () => {
    let correct = 0;
    const catScores = {};
    categories.forEach(c => catScores[c] = { correct: 0, total: 0 });

    QUESTIONS.forEach((q, i) => {
      catScores[q.category].total++;
      if (answers[i] === q.answer) {
        correct++;
        catScores[q.category].correct++;
      }
    });

    const timeUsed = TOTAL_TIME - timeLeft;
    const timeBonus = timeLeft > 0 ? Math.round((timeLeft / TOTAL_TIME) * 8) : 0;
    const iq = getIQScore(correct, QUESTIONS.length, timeBonus);
    return { correct, total: QUESTIONS.length, iq, catScores, timeUsed };
  };

  const progress = ((current) / QUESTIONS.length) * 100;
  const timerUrgent = timeLeft < 120;

  if (screen === "intro") return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.badge}>COGNITIVE ASSESSMENT</div>
        <h1 style={styles.title}>IQ<span style={{ color: "#a78bfa" }}>Test</span></h1>
        <p style={styles.subtitle}>A scientifically-inspired assessment across 6 cognitive dimensions</p>

        <div style={styles.categoryGrid}>
          {[
            { icon: "🔗", name: "Logical Reasoning" },
            { icon: "🔷", name: "Pattern Recognition" },
            { icon: "📐", name: "Math / Numerical" },
            { icon: "📝", name: "Verbal / Language" },
            { icon: "🧊", name: "Spatial Reasoning" },
            { icon: "🧠", name: "Working Memory" },
          ].map(c => (
            <div key={c.name} style={styles.catChip}>
              <span>{c.icon}</span> {c.name}
            </div>
          ))}
        </div>

        <div style={styles.infoRow}>
          <div style={styles.infoBox}><span style={styles.infoNum}>20</span><span style={styles.infoLabel}>Questions</span></div>
          <div style={styles.infoBox}><span style={styles.infoNum}>20</span><span style={styles.infoLabel}>Minutes</span></div>
          <div style={styles.infoBox}><span style={styles.infoNum}>145</span><span style={styles.infoLabel}>Max IQ</span></div>
        </div>

        <button style={styles.startBtn} onClick={() => setScreen("test")}>
          Begin Assessment →
        </button>
        <p style={styles.disclaimer}>For entertainment & self-reflection purposes.</p>
      </div>
    </div>
  );

  if (screen === "test") {
    const q = QUESTIONS[current];
    return (
      <div style={styles.page}>
        <div style={styles.testCard}>
          {/* Header */}
          <div style={styles.testHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={styles.qCounter}>{current + 1} / {QUESTIONS.length}</span>
              <span style={styles.catTag}>{q.categoryIcon} {q.category}</span>
            </div>
            <div style={{ ...styles.timer, color: timerUrgent ? "#f87171" : "#a78bfa", borderColor: timerUrgent ? "#f87171" : "#a78bfa" }}>
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress bar */}
          <div style={styles.progressBg}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>

          {/* Question */}
          <div style={styles.questionBox}>
            <p style={styles.questionText}>{q.question}</p>
          </div>

          {/* Options */}
          <div style={styles.optionsGrid}>
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                style={{
                  ...styles.optionBtn,
                  ...(selected === idx ? styles.optionSelected : {}),
                }}
                onClick={() => handleSelect(idx)}
              >
                <span style={styles.optionLetter}>{["A", "B", "C", "D"][idx]}</span>
                {opt}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            {current > 0 && (
              <button style={styles.skipBtn} onClick={() => { setCurrent(c => c - 1); setSelected(answers[current - 1] ?? null); }}>
                ← Back
              </button>
            )}
            <button
              style={{ ...styles.nextBtn, opacity: selected === null ? 0.4 : 1, flex: 1 }}
              disabled={selected === null}
              onClick={handleNext}
            >
              {current + 1 === QUESTIONS.length ? "Submit Test ✓" : "Next Question →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "result") {
    const { correct, total, iq, catScores, timeUsed } = computeResults();
    const { label, color } = getIQLabel(iq);
    const mins = Math.floor(timeUsed / 60);
    const secs = timeUsed % 60;

    return (
      <div style={styles.page}>
        <div style={styles.resultCard}>
          <div style={styles.badge}>YOUR RESULTS</div>

          {/* IQ Score */}
          <div style={styles.iqRing}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" fill="none" stroke="#1e1b4b" strokeWidth="12" />
              <circle cx="80" cy="80" r="68" fill="none" stroke={color}
                strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${(iq / 145) * 427} 427`}
                transform="rotate(-90 80 80)"
                style={{ transition: "stroke-dasharray 1s ease" }}
              />
            </svg>
            <div style={styles.iqInner}>
              <div style={{ ...styles.iqNumber, color }}>{iq}</div>
              <div style={styles.iqLabel}>IQ Score</div>
            </div>
          </div>

          <div style={{ ...styles.levelBadge, background: color + "22", color, border: `1px solid ${color}` }}>
            {label}
          </div>

          {/* Stats row */}
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{correct}/{total}</span>
              <span style={styles.statLabel}>Correct</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{Math.round((correct / total) * 100)}%</span>
              <span style={styles.statLabel}>Accuracy</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{mins}m {secs}s</span>
              <span style={styles.statLabel}>Time Used</span>
            </div>
          </div>

          {/* Category breakdown */}
          <div style={styles.breakdownTitle}>Category Breakdown</div>
          {categories.map(cat => {
            const s = catScores[cat];
            if (!s) return null;
            const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
            const q = QUESTIONS.find(q => q.category === cat);
            return (
              <div key={cat} style={styles.catRow}>
                <div style={styles.catRowLeft}>
                  <span>{q?.categoryIcon}</span>
                  <span style={styles.catRowName}>{cat}</span>
                </div>
                <div style={styles.catBarBg}>
                  <div style={{
                    ...styles.catBarFill,
                    width: `${pct}%`,
                    background: pct >= 75 ? "#34d399" : pct >= 50 ? "#fbbf24" : "#f87171"
                  }} />
                </div>
                <span style={styles.catPct}>{s.correct}/{s.total}</span>
              </div>
            );
          })}

          {/* IQ scale */}
          <div style={styles.scaleBox}>
            <div style={styles.scaleTitle}>IQ Distribution Scale</div>
            {[
              { range: "130–145", label: "Gifted / Very Superior", color: "#a78bfa" },
              { range: "120–129", label: "Superior", color: "#60a5fa" },
              { range: "110–119", label: "High Average", color: "#34d399" },
              { range: "90–109", label: "Average", color: "#fbbf24" },
              { range: "80–89", label: "Low Average", color: "#f97316" },
              { range: "< 80", label: "Below Average", color: "#f87171" },
            ].map(row => (
              <div key={row.range} style={{ ...styles.scaleRow, background: iq >= parseInt(row.range) || row.range === "< 80" ? row.color + "18" : "transparent" }}>
                <span style={{ color: row.color, fontWeight: 700, fontSize: 13 }}>{row.range}</span>
                <span style={{ color: "#94a3b8", fontSize: 13 }}>{row.label}</span>
              </div>
            ))}
          </div>

          <button style={styles.startBtn} onClick={() => {
            setScreen("intro"); setCurrent(0); setAnswers({}); setSelected(null); setTimeLeft(TOTAL_TIME); setConfirmed(false);
          }}>
            Retake Test ↺
          </button>
        </div>
      </div>
    );
  }
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0f0c29 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "32px 16px",
    fontFamily: "'Georgia', serif",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(167,139,250,0.2)",
    borderRadius: 24,
    padding: "48px 40px",
    maxWidth: 540,
    width: "100%",
    textAlign: "center",
    backdropFilter: "blur(20px)",
    boxShadow: "0 0 80px rgba(167,139,250,0.1)",
  },
  badge: {
    display: "inline-block",
    background: "rgba(167,139,250,0.15)",
    color: "#a78bfa",
    border: "1px solid rgba(167,139,250,0.4)",
    borderRadius: 100,
    padding: "4px 16px",
    fontSize: 11,
    letterSpacing: 3,
    fontFamily: "monospace",
    marginBottom: 20,
  },
  title: {
    fontSize: 56,
    fontWeight: 900,
    color: "#f1f5f9",
    margin: "0 0 8px",
    letterSpacing: -2,
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 15,
    marginBottom: 32,
    lineHeight: 1.6,
  },
  categoryGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginBottom: 32,
  },
  catChip: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 100,
    padding: "6px 14px",
    fontSize: 12,
    color: "#cbd5e1",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  infoRow: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    marginBottom: 32,
  },
  infoBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "rgba(167,139,250,0.08)",
    border: "1px solid rgba(167,139,250,0.2)",
    borderRadius: 16,
    padding: "16px 24px",
  },
  infoNum: { fontSize: 28, fontWeight: 900, color: "#a78bfa" },
  infoLabel: { fontSize: 11, color: "#64748b", letterSpacing: 1, marginTop: 2, fontFamily: "monospace" },
  startBtn: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: 0.5,
    boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
    transition: "transform 0.15s",
  },
  disclaimer: { color: "#475569", fontSize: 11, marginTop: 16, fontFamily: "monospace" },

  // Test screen
  testCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(167,139,250,0.2)",
    borderRadius: 24,
    padding: "36px 32px",
    maxWidth: 580,
    width: "100%",
    backdropFilter: "blur(20px)",
  },
  testHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  qCounter: { color: "#94a3b8", fontSize: 13, fontFamily: "monospace" },
  catTag: {
    background: "rgba(167,139,250,0.12)",
    color: "#a78bfa",
    borderRadius: 100,
    padding: "3px 12px",
    fontSize: 12,
    border: "1px solid rgba(167,139,250,0.3)",
  },
  timer: {
    fontFamily: "monospace",
    fontSize: 15,
    fontWeight: 700,
    border: "1px solid",
    borderRadius: 8,
    padding: "4px 12px",
    transition: "color 0.3s, border-color 0.3s",
  },
  progressBg: {
    height: 4,
    background: "rgba(255,255,255,0.08)",
    borderRadius: 100,
    marginBottom: 28,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
    borderRadius: 100,
    transition: "width 0.4s ease",
  },
  questionBox: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "24px",
    marginBottom: 24,
  },
  questionText: {
    color: "#e2e8f0",
    fontSize: 17,
    lineHeight: 1.7,
    margin: 0,
    fontWeight: 500,
  },
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 16,
  },
  optionBtn: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "14px 16px",
    color: "#cbd5e1",
    fontSize: 14,
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: 10,
    transition: "all 0.15s",
    fontFamily: "'Georgia', serif",
  },
  optionSelected: {
    background: "rgba(167,139,250,0.15)",
    border: "1px solid rgba(167,139,250,0.6)",
    color: "#f1f5f9",
  },
  optionLetter: {
    background: "rgba(167,139,250,0.2)",
    color: "#a78bfa",
    borderRadius: 6,
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
    fontFamily: "monospace",
  },
  nextBtn: {
    padding: "14px",
    background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  skipBtn: {
    padding: "14px 20px",
    background: "rgba(255,255,255,0.06)",
    color: "#94a3b8",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
  },

  // Result screen
  resultCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(167,139,250,0.2)",
    borderRadius: 24,
    padding: "40px 36px",
    maxWidth: 560,
    width: "100%",
    backdropFilter: "blur(20px)",
    textAlign: "center",
  },
  iqRing: {
    position: "relative",
    width: 160,
    height: 160,
    margin: "24px auto 16px",
  },
  iqInner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  iqNumber: { fontSize: 40, fontWeight: 900, lineHeight: 1 },
  iqLabel: { color: "#64748b", fontSize: 11, fontFamily: "monospace", letterSpacing: 1 },
  levelBadge: {
    display: "inline-block",
    borderRadius: 100,
    padding: "6px 20px",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0.5,
    marginBottom: 24,
  },
  statsRow: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    marginBottom: 28,
  },
  statBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "14px 20px",
    flex: 1,
  },
  statNum: { fontSize: 22, fontWeight: 800, color: "#f1f5f9" },
  statLabel: { fontSize: 10, color: "#64748b", fontFamily: "monospace", letterSpacing: 1, marginTop: 2 },
  breakdownTitle: {
    color: "#94a3b8",
    fontSize: 11,
    letterSpacing: 2,
    fontFamily: "monospace",
    textAlign: "left",
    marginBottom: 12,
  },
  catRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  catRowLeft: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    width: 160,
    textAlign: "left",
  },
  catRowName: { color: "#cbd5e1", fontSize: 12, whiteSpace: "nowrap" },
  catBarBg: {
    flex: 1,
    height: 8,
    background: "rgba(255,255,255,0.08)",
    borderRadius: 100,
    overflow: "hidden",
  },
  catBarFill: {
    height: "100%",
    borderRadius: 100,
    transition: "width 1s ease",
  },
  catPct: { color: "#64748b", fontSize: 12, fontFamily: "monospace", width: 32 },
  scaleBox: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16,
    padding: 16,
    margin: "20px 0",
    textAlign: "left",
  },
  scaleTitle: { color: "#475569", fontSize: 10, fontFamily: "monospace", letterSpacing: 2, marginBottom: 10 },
  scaleRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 10px",
    borderRadius: 8,
    marginBottom: 3,
  },
};
