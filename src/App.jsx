import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";

const AUTHORITY = "NeuroMark Institute";
const AUTHORITY_TAGLINE = "Global Centre for Cognitive Assessment";
const CERT_PRICE = "₹39";

const QUESTIONS = [
  { id: 1, category: "Logical Reasoning", categoryIcon: "🔗", question: "All roses are flowers. Some flowers fade quickly. Therefore:", options: ["All roses fade quickly", "Some roses may fade quickly", "No roses fade quickly", "Roses never fade"], answer: 1 },
  { id: 2, category: "Logical Reasoning", categoryIcon: "🔗", question: "If A > B, and B > C, and C > D, which is true?", options: ["D > A", "A > D", "B > A", "C > A"], answer: 1 },
  { id: 3, category: "Logical Reasoning", categoryIcon: "🔗", question: "In a row of 5 people, Alex is left of Ben. Ben is right of Carol. Dan is between Carol and Alex. Who is at far left?", options: ["Alex", "Ben", "Carol", "Dan"], answer: 2 },
  { id: 4, category: "Logical Reasoning", categoryIcon: "🔗", question: "If some Zips are Zaps, and all Zaps are Zops, then:", options: ["All Zips are Zops", "Some Zips are Zops", "No Zips are Zops", "All Zops are Zips"], answer: 1 },
  { id: 5, category: "Pattern Recognition", categoryIcon: "🔷", question: "What comes next: 2, 4, 8, 16, ?", options: ["24", "30", "32", "36"], answer: 2 },
  { id: 6, category: "Pattern Recognition", categoryIcon: "🔷", question: "What comes next: 1, 1, 2, 3, 5, 8, ?", options: ["11", "12", "13", "14"], answer: 2 },
  { id: 7, category: "Pattern Recognition", categoryIcon: "🔷", question: "Which number completes: 3, 6, 11, 18, 27, ?", options: ["36", "38", "40", "42"], answer: 1 },
  { id: 8, category: "Pattern Recognition", categoryIcon: "🔷", question: "A ○ B ● C ○ D ● E ○ ? — What symbol follows?", options: ["○", "●", "△", "□"], answer: 1 },
  { id: 9, category: "Math / Numerical", categoryIcon: "📐", question: "Train at 60 km/h for 2.5 hours. Distance travelled?", options: ["120 km", "130 km", "150 km", "160 km"], answer: 2 },
  { id: 10, category: "Math / Numerical", categoryIcon: "📐", question: "What is 15% of 240?", options: ["32", "34", "36", "38"], answer: 2 },
  { id: 11, category: "Math / Numerical", categoryIcon: "📐", question: "Price reduced 20%, then increased 20%. Net change?", options: ["0%", "-4%", "+4%", "-2%"], answer: 1 },
  { id: 12, category: "Math / Numerical", categoryIcon: "📐", question: "If 5x + 3 = 28, what is 2x?", options: ["8", "10", "12", "14"], answer: 1 },
  { id: 13, category: "Verbal / Language", categoryIcon: "📝", question: "Opposite of BENEVOLENT:", options: ["Generous", "Malevolent", "Indifferent", "Passive"], answer: 1 },
  { id: 14, category: "Verbal / Language", categoryIcon: "📝", question: "DOCTOR : HOSPITAL :: JUDGE : ?", options: ["Law", "Verdict", "Courtroom", "Attorney"], answer: 2 },
  { id: 15, category: "Verbal / Language", categoryIcon: "📝", question: "Which does NOT belong: Oak, Maple, Fern, Birch?", options: ["Oak", "Maple", "Fern", "Birch"], answer: 2 },
  { id: 16, category: "Verbal / Language", categoryIcon: "📝", question: "Symphony : Composer :: Sculpture : ?", options: ["Museum", "Canvas", "Sculptor", "Chisel"], answer: 2 },
  { id: 17, category: "Spatial Reasoning", categoryIcon: "🧊", question: "A cube has 6 faces. Unfolded flat, how many squares?", options: ["4", "5", "6", "8"], answer: 2 },
  { id: 18, category: "Spatial Reasoning", categoryIcon: "🧊", question: "How many triangles are in a Star of David?", options: ["6", "8", "12", "2"], answer: 2 },
  { id: 19, category: "Working Memory", categoryIcon: "🧠", question: "Sequence: 7, 3, 9, 1, 5. Sum of 2nd and 4th numbers?", options: ["4", "6", "8", "10"], answer: 0 },
  { id: 20, category: "Working Memory", categoryIcon: "🧠", question: "Reverse BRAIN, take the 3rd letter. What is it?", options: ["I", "A", "N", "R"], answer: 1 },
];

const TOTAL_TIME = 20 * 60;
const categories = [...new Set(QUESTIONS.map(q => q.category))];

const SEAL_URL  = "/Seal.png";
const BRAIN_URL = "/brain.png";

function getIQScore(correct, total, timeLeft) {
  const base = (correct / total) * 100;
  const timeBonus = timeLeft > 0 ? Math.round((timeLeft / TOTAL_TIME) * 8) : 0;
  return Math.min(Math.round(70 + (base / 100) * 60 + timeBonus), 145);
}

function getIQLabel(iq) {
  if (iq >= 130) return { label: "Gifted / Very Superior", color: "#a78bfa" };
  if (iq >= 120) return { label: "Superior", color: "#60a5fa" };
  if (iq >= 110) return { label: "High Average", color: "#34d399" };
  if (iq >= 90)  return { label: "Average", color: "#fbbf24" };
  if (iq >= 80)  return { label: "Low Average", color: "#f97316" };
  return { label: "Below Average", color: "#f87171" };
}

function generateCertID() {
  return "NM1-" + Math.random().toString(36).substring(2, 6).toUpperCase() +
         Math.random().toString(36).substring(2, 6).toUpperCase() + "-USRK";
}

function getCatColor(pct) {
  if (pct >= 75) return "#2ecc71";
  if (pct >= 50) return "#f39c12";
  return "#e74c3c";
}

// ─── Helper: load image as data URL ──────────────────────
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
    img.src = url;
  });
}

// ─── Draw decorative side border ornament ────────────────
function drawSideBorder(pdf, x, yStart, yEnd, side) {
  const gold = [184, 150, 62];
  const lightGold = [212, 175, 90];
  pdf.setDrawColor(...gold);
  pdf.setLineWidth(0.4);

  // Vertical line
  pdf.line(x, yStart, x, yEnd);

  // Repeating diamond ornaments
  const step = 8;
  for (let y = yStart + 4; y < yEnd - 4; y += step) {
    const size = 1.5;
    pdf.setFillColor(...lightGold);
    // Small diamond shape
    pdf.triangle(x, y - size, x - size, y, x, y + size, "F");
    pdf.triangle(x, y - size, x + size, y, x, y + size, "F");
  }
}

// ─── Main PDF generator ───────────────────────────────────
async function generateVectorPDF(name, iq, label, certID, date, catScores) {
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297, H = 210;

  // ── Background ──────────────────────────────────────────
  pdf.setFillColor(253, 250, 244);
  pdf.rect(0, 0, W, H, "F");

  // ── Outer gold border ───────────────────────────────────
  pdf.setDrawColor(184, 150, 62);
  pdf.setLineWidth(1.2);
  pdf.rect(6, 6, W - 12, H - 12);

  pdf.setDrawColor(212, 175, 90);
  pdf.setLineWidth(0.4);
  pdf.rect(9, 9, W - 18, H - 18);

  // ── Decorative side borders ─────────────────────────────
  drawSideBorder(pdf, 16, 12, H - 12, "left");
  drawSideBorder(pdf, W - 16, 12, H - 12, "right");

  // Corner circles
  [[12,12],[W-12,12],[12,H-12],[W-12,H-12]].forEach(([cx,cy]) => {
    pdf.setFillColor(184, 150, 62);
    pdf.circle(cx, cy, 2, "F");
  });

  // ── Load images ─────────────────────────────────────────
  const [sealData, brainData] = await Promise.all([
    loadImageAsDataURL(SEAL_URL),
    loadImageAsDataURL(BRAIN_URL),
  ]);

  // ── Brain logos left & right of title ───────────────────
  const brainSize = 18;
  const titleY = 22;
  if (brainData) {
    pdf.addImage(brainData, "PNG", W/2 - 52 - brainSize, titleY - 12, brainSize, brainSize);
    pdf.addImage(brainData, "PNG", W/2 + 52, titleY - 12, brainSize, brainSize);
  }

  // ── Header text ─────────────────────────────────────────
  pdf.setTextColor(26, 16, 64);
  pdf.setFont("times", "bold");
  pdf.setFontSize(20);
  pdf.text("NEUROMARK INSTITUTE", W/2, titleY, { align: "center" });

  pdf.setFont("times", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(107, 92, 62);
  pdf.text("Global Centre for Cognitive Assessment", W/2, titleY + 8, { align: "center" });

  // ── Certificate title (italic gold) ─────────────────────
  pdf.setFont("times", "italic");
  pdf.setFontSize(15);
  pdf.setTextColor(184, 150, 62);
  pdf.text("Certificate of Cognitive Assessment", W/2, titleY + 18, { align: "center" });

  // ── Divider line ─────────────────────────────────────────
  pdf.setDrawColor(184, 150, 62);
  pdf.setLineWidth(0.5);
  pdf.line(25, titleY + 22, W - 25, titleY + 22);

  // ── "This is to certify that" ────────────────────────────
  pdf.setFont("times", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(74, 63, 47);
  pdf.text("This is to certify that", W/2, titleY + 32, { align: "center" });

  // ── Candidate name ───────────────────────────────────────
  pdf.setFont("times", "bold");
  pdf.setFontSize(26);
  pdf.setTextColor(26, 16, 64);
  pdf.text(name || "Candidate", W/2, titleY + 44, { align: "center" });

  // Name underline
  const nameWidth = pdf.getTextWidth(name || "Candidate");
  pdf.setDrawColor(184, 150, 62);
  pdf.setLineWidth(0.4);
  pdf.line(W/2 - nameWidth/2, titleY + 46, W/2 + nameWidth/2, titleY + 46);

  // ── Completed text ───────────────────────────────────────
  pdf.setFont("times", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(74, 63, 47);
  pdf.text("has successfully completed the NeuroMark Cognitive Assessment", W/2, titleY + 55, { align: "center" });

  // ── IQ Score box (left) ──────────────────────────────────
  const boxX = 25, boxY = 100, boxW = 68, boxH = 52;

  // Box with gold border
  pdf.setDrawColor(184, 150, 62);
  pdf.setFillColor(253, 250, 244);
  pdf.setLineWidth(0.8);
  pdf.roundedRect(boxX, boxY, boxW, boxH, 3, 3, "FD");

  // IQ number
  pdf.setFont("times", "bold");
  pdf.setFontSize(36);
  pdf.setTextColor(184, 150, 62);
  pdf.text(String(iq), boxX + boxW/2, boxY + 22, { align: "center" });

  // Label
  pdf.setFontSize(13);
  pdf.setTextColor(26, 16, 64);
  pdf.text(label, boxX + boxW/2, boxY + 32, { align: "center" });

  // Inner divider
  pdf.setDrawColor(212, 175, 90);
  pdf.setLineWidth(0.3);
  pdf.line(boxX + 6, boxY + 36, boxX + boxW - 6, boxY + 36);

  // Sub text
  pdf.setFont("times", "normal");
  pdf.setFontSize(7.5);
  pdf.setTextColor(107, 92, 62);
  pdf.text("IQ SCORE", boxX + boxW/2, boxY + 41, { align: "center" });
  pdf.text("NeuroMark Assessment 2026", boxX + boxW/2, boxY + 46, { align: "center" });
  pdf.text("NeuroMark Certified - 2026", boxX + boxW/2, boxY + 51, { align: "center" });

  // ── Cognitive Profile bars (right of box) ────────────────
  const profileX = 105, profileStartY = 100;
  pdf.setFont("times", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(26, 16, 64);
  pdf.text("COGNITIVE PROFILE", profileX, profileStartY - 2);

  const barMaxW = 100, barH = 5, barGap = 11;

  Object.keys(catScores).forEach((cat, i) => {
    const s = catScores[cat];
    const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
    const y = profileStartY + i * barGap;

    const shortName = cat.replace(" / ","/").replace("Reasoning","Rsng").replace("Recognition","Recog").replace("Numerical","Num").replace("Language","Lang").replace("Memory","Mem");

    // Category name
    pdf.setFont("times", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(74, 63, 47);
    pdf.text(shortName, profileX, y + barH - 1);

    // Percentage label
    pdf.text(pct + "%", profileX + 38, y + barH - 1, { align: "right" });

    // Bar background
    pdf.setFillColor(232, 223, 200);
    pdf.rect(profileX + 40, y, barMaxW, barH, "F");

    // Bar fill with color based on score
    const col = getCatColor(pct);
    const r = parseInt(col.slice(1,3),16);
    const g = parseInt(col.slice(3,5),16);
    const b = parseInt(col.slice(5,7),16);
    pdf.setFillColor(r, g, b);
    const fillW = Math.max(1, (barMaxW * pct) / 100);
    pdf.rect(profileX + 40, y, fillW, barH, "F");

    // Percentage text on bar
    if (pct > 10) {
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(6.5);
      pdf.text(pct + "%", profileX + 40 + fillW - 2, y + barH - 1, { align: "right" });
    }
  });

  // ── Bottom divider ────────────────────────────────────────
  pdf.setDrawColor(184, 150, 62);
  pdf.setLineWidth(0.5);
  pdf.line(25, 162, W - 25, 162);

  // ── Seal (center bottom) ──────────────────────────────────
  const sealSize = 28;
  if (sealData) {
    pdf.addImage(sealData, "PNG", W/2 - sealSize/2, 164, sealSize, sealSize);
  }

  // ── Signature (left of seal) ──────────────────────────────
  pdf.setFont("times", "italic");
  pdf.setFontSize(13);
  pdf.setTextColor(26, 16, 64);
  pdf.text("Dr. A. Ravensworth", W/2 - 40, 173, { align: "center" });

  pdf.setDrawColor(74, 63, 47);
  pdf.setLineWidth(0.3);
  pdf.line(W/2 - 75, 175, W/2 - 5, 175);

  pdf.setFont("times", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(74, 63, 47);
  pdf.text("Chief Assessment Officer", W/2 - 40, 180, { align: "center" });
  pdf.text("NeuroMark Institute", W/2 - 40, 185, { align: "center" });

  // ── Date & Cert ID (right) ────────────────────────────────
  pdf.setFont("times", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(107, 92, 62);
  pdf.text("Date: " + date, W - 22, 173, { align: "right" });
  pdf.text("Certificate ID: " + certID, W - 22, 180, { align: "right" });
  pdf.text("Verify at neuromark.institute", W - 22, 187, { align: "right" });

  // ── Footer ────────────────────────────────────────────────
  pdf.setFontSize(6.5);
  pdf.setTextColor(154, 128, 96);
  pdf.text(
    "This certificate is issued for educational and entertainment purposes. NeuroMark Institute © " + new Date().getFullYear(),
    W/2, H - 8, { align: "center" }
  );

  // ── Save ──────────────────────────────────────────────────
  pdf.save(`IQ_Certificate_${name || "Candidate"}.pdf`);
}

export default function IQTest() {
  const [screen, setScreen] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);
  const [certName, setCertName] = useState("");
  const [certID] = useState(generateCertID);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paid, setPaid] = useState(false);
  const [certGenerated, setCertGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (screen === "test") {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => { if (t<=1){clearInterval(timerRef.current);setScreen("result");return 0;} return t-1; });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen]);

  const handleNext = () => {
    if (selected===null) return;
    const na = {...answers,[current]:selected};
    setAnswers(na); setSelected(null);
    if (current+1>=QUESTIONS.length){clearInterval(timerRef.current);setScreen("result");}
    else setCurrent(c=>c+1);
  };

  const formatTime = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const computeResults = () => {
    let correct=0;
    const catScores={};
    categories.forEach(c=>catScores[c]={correct:0,total:0});
    QUESTIONS.forEach((q,i)=>{
      catScores[q.category].total++;
      if(answers[i]===q.answer){correct++;catScores[q.category].correct++;}
    });
    return {correct,total:QUESTIONS.length,iq:getIQScore(correct,QUESTIONS.length,timeLeft),catScores,timeUsed:TOTAL_TIME-timeLeft};
  };

  const handleDownloadPDF = async () => {
    const {iq, catScores} = computeResults();
    const {label} = getIQLabel(iq);
    const date = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
    setGenerating(true);
    try {
      await generateVectorPDF(certName, iq, label, certID, date, catScores);
      setCertGenerated(true);
    } finally {
      setGenerating(false);
    }
  };

  const handlePayment = () => { setPaid(true); setShowPaywall(false); };

  const progress = (current / QUESTIONS.length) * 100;
  const timerUrgent = timeLeft < 120;
  const q = QUESTIONS[current];

  if (screen==="intro") return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.badge}>COGNITIVE ASSESSMENT</div>
        <h1 style={S.title}>IQ<span style={{color:"#a78bfa"}}>Test</span></h1>
        <p style={S.subtitle}>A scientifically-inspired assessment across 6 cognitive dimensions</p>
        <div style={S.categoryGrid}>
          {[{icon:"🔗",name:"Logical Reasoning"},{icon:"🔷",name:"Pattern Recognition"},{icon:"📐",name:"Math / Numerical"},{icon:"📝",name:"Verbal / Language"},{icon:"🧊",name:"Spatial Reasoning"},{icon:"🧠",name:"Working Memory"}].map(c=>(
            <div key={c.name} style={S.catChip}><span>{c.icon}</span> {c.name}</div>
          ))}
        </div>
        <div style={S.infoRow}>
          <div style={S.infoBox}><span style={S.infoNum}>20</span><span style={S.infoLabel}>Questions</span></div>
          <div style={S.infoBox}><span style={S.infoNum}>20</span><span style={S.infoLabel}>Minutes</span></div>
          <div style={S.infoBox}><span style={S.infoNum}>145</span><span style={S.infoLabel}>Max IQ</span></div>
        </div>
        <div style={S.certPreview}>🎓 <strong style={{color:"#fbbf24"}}>Official PDF Certificate</strong> — Download with NeuroMark seal + cognitive profile for {CERT_PRICE}</div>
        <button style={S.startBtn} onClick={()=>setScreen("test")}>Begin Assessment →</button>
        <p style={S.disclaimer}>Issued by {AUTHORITY} · For educational purposes</p>
      </div>
    </div>
  );

  if (screen==="test") return (
    <div style={S.page}>
      <div style={S.testCard}>
        <div style={S.testHeader}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={S.qCounter}>{current+1} / {QUESTIONS.length}</span>
            <span style={S.catTag}>{q.categoryIcon} {q.category}</span>
          </div>
          <div style={{...S.timer,color:timerUrgent?"#f87171":"#a78bfa",borderColor:timerUrgent?"#f87171":"#a78bfa"}}>⏱ {formatTime(timeLeft)}</div>
        </div>
        <div style={S.progressBg}><div style={{...S.progressFill,width:`${progress}%`}}/></div>
        <div style={S.questionBox}><p style={S.questionText}>{q.question}</p></div>
        <div style={S.optionsGrid}>
          {q.options.map((opt,idx)=>(
            <button key={idx} style={{...S.optionBtn,...(selected===idx?S.optionSelected:{})}} onClick={()=>setSelected(idx)}>
              <span style={S.optionLetter}>{["A","B","C","D"][idx]}</span>{opt}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:12,marginTop:8}}>
          {current>0&&<button style={S.skipBtn} onClick={()=>{setCurrent(c=>c-1);setSelected(answers[current-1]??null);}}>← Back</button>}
          <button style={{...S.nextBtn,opacity:selected===null?0.4:1,flex:1}} disabled={selected===null} onClick={handleNext}>
            {current+1===QUESTIONS.length?"Submit Test ✓":"Next Question →"}
          </button>
        </div>
      </div>
    </div>
  );

  if (screen==="result") {
    const {correct,total,iq,catScores,timeUsed}=computeResults();
    const {label,color}=getIQLabel(iq);
    const mins=Math.floor(timeUsed/60),secs=timeUsed%60;
    return (
      <div style={S.page}>
        <div style={S.resultCard}>
          <div style={S.badge}>YOUR RESULTS</div>
          <div style={S.iqRing}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" fill="none" stroke="#1e1b4b" strokeWidth="12"/>
              <circle cx="80" cy="80" r="68" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${(iq/145)*427} 427`} transform="rotate(-90 80 80)"/>
            </svg>
            <div style={S.iqInner}>
              <div style={{...S.iqNumber,color}}>{iq}</div>
              <div style={S.iqLabel}>IQ Score</div>
            </div>
          </div>
          <div style={{...S.levelBadge,background:color+"22",color,border:`1px solid ${color}`}}>{label}</div>
          <div style={S.statsRow}>
            <div style={S.statBox}><span style={S.statNum}>{correct}/{total}</span><span style={S.statLabel}>Correct</span></div>
            <div style={S.statBox}><span style={S.statNum}>{Math.round((correct/total)*100)}%</span><span style={S.statLabel}>Accuracy</span></div>
            <div style={S.statBox}><span style={S.statNum}>{mins}m {secs}s</span><span style={S.statLabel}>Time</span></div>
          </div>
          <div style={S.breakdownTitle}>Category Breakdown</div>
          {categories.map(cat=>{
            const s=catScores[cat]; if(!s) return null;
            const pct=s.total>0?Math.round((s.correct/s.total)*100):0;
            const qc=QUESTIONS.find(q=>q.category===cat);
            return (
              <div key={cat} style={S.catRow}>
                <div style={S.catRowLeft}><span>{qc?.categoryIcon}</span><span style={S.catRowName}>{cat}</span></div>
                <div style={S.catBarBg}><div style={{...S.catBarFill,width:`${pct}%`,background:pct>=75?"#34d399":pct>=50?"#fbbf24":"#f87171"}}/></div>
                <span style={S.catPct}>{s.correct}/{s.total}</span>
              </div>
            );
          })}

          <div style={S.certSection}>
            <div style={S.certHeader}>
              <span style={{fontSize:28}}>🎓</span>
              <div><div style={S.certTitle}>Official PDF Certificate</div><div style={S.certSubtitle}>With NeuroMark seal + cognitive profile</div></div>
              <div style={S.certPrice}>{CERT_PRICE}</div>
            </div>
            <div style={S.certFeatures}>
              {["NeuroMark seal","IQ score & classification","Cognitive profile bars","Direct PDF download"].map(f=>(
                <div key={f} style={S.certFeature}><span style={{color:"#fbbf24"}}>✓</span> {f}</div>
              ))}
            </div>
            {!paid?(
              <>
                <input style={S.nameInput} placeholder="Enter your full name for the certificate" value={certName} onChange={e=>setCertName(e.target.value)} maxLength={40}/>
                <button style={S.certBtn} onClick={()=>{if(certName.trim())setShowPaywall(true);}}>
                  🏆 Get My Certificate — {CERT_PRICE}
                </button>
                {!certName.trim()&&<p style={{color:"#64748b",fontSize:11,margin:"6px 0 0",textAlign:"center"}}>Enter your name above to continue</p>}
              </>
            ):(
              <div style={{textAlign:"center"}}>
                <button style={{...S.certBtn,background:"linear-gradient(135deg,#059669,#34d399)",opacity:generating?0.7:1}} onClick={handleDownloadPDF} disabled={generating}>
                  {generating?"⏳ Generating...":"📄 Download PDF Certificate"}
                </button>
                {certGenerated&&<p style={{color:"#34d399",fontSize:12,marginTop:8}}>✅ Certificate downloaded successfully! 🎉</p>}
              </div>
            )}
          </div>

          {showPaywall&&(
            <div style={S.modal}>
              <div style={S.modalCard}>
                <div style={{fontSize:40,textAlign:"center",marginBottom:12}}>🏆</div>
                <div style={S.modalTitle}>Complete Your Certificate</div>
                <div style={S.modalName}>{certName}</div>
                <div style={S.modalIQ}>IQ Score: <strong style={{color:"#a78bfa"}}>{iq}</strong> — {label}</div>
                <div style={S.modalPrice}>{CERT_PRICE} only</div>
                <p style={{color:"#94a3b8",fontSize:12,textAlign:"center",margin:"0 0 16px"}}>One-time · Instant PDF · Seal included</p>
                <button style={S.payBtn} onClick={handlePayment}>Pay {CERT_PRICE} & Download PDF</button>
                <button style={S.cancelBtn} onClick={()=>setShowPaywall(false)}>Cancel</button>
                <p style={{color:"#475569",fontSize:10,textAlign:"center",marginTop:8}}>🔒 Secure payment · No subscription</p>
              </div>
            </div>
          )}

          <button style={{...S.startBtn,marginTop:16}} onClick={()=>{
            setScreen("intro");setCurrent(0);setAnswers({});setSelected(null);
            setTimeLeft(TOTAL_TIME);setPaid(false);setCertGenerated(false);setCertName("");
          }}>Retake Test ↺</button>
        </div>
        <canvas ref={canvasRef} style={{display:"none"}}/>
      </div>
    );
  }
}

const S={
  page:{minHeight:"100vh",background:"linear-gradient(135deg,#0f0c29 0%,#1a1040 50%,#0f0c29 100%)",display:"flex",justifyContent:"center",alignItems:"flex-start",padding:"32px 16px",fontFamily:"'Georgia',serif"},
  card:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:24,padding:"48px 40px",maxWidth:540,width:"100%",textAlign:"center",backdropFilter:"blur(20px)",boxShadow:"0 0 80px rgba(167,139,250,0.1)"},
  badge:{display:"inline-block",background:"rgba(167,139,250,0.15)",color:"#a78bfa",border:"1px solid rgba(167,139,250,0.4)",borderRadius:100,padding:"4px 16px",fontSize:11,letterSpacing:3,fontFamily:"monospace",marginBottom:20},
  title:{fontSize:56,fontWeight:900,color:"#f1f5f9",margin:"0 0 8px",letterSpacing:-2},
  subtitle:{color:"#94a3b8",fontSize:15,marginBottom:32,lineHeight:1.6},
  categoryGrid:{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:32},
  catChip:{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:100,padding:"6px 14px",fontSize:12,color:"#cbd5e1",display:"flex",alignItems:"center",gap:6},
  infoRow:{display:"flex",gap:12,justifyContent:"center",marginBottom:24},
  infoBox:{display:"flex",flexDirection:"column",alignItems:"center",background:"rgba(167,139,250,0.08)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:16,padding:"16px 24px"},
  infoNum:{fontSize:28,fontWeight:900,color:"#a78bfa"},
  infoLabel:{fontSize:11,color:"#64748b",letterSpacing:1,marginTop:2,fontFamily:"monospace"},
  certPreview:{background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.3)",borderRadius:12,padding:"12px 16px",fontSize:13,color:"#cbd5e1",marginBottom:24,lineHeight:1.6},
  startBtn:{width:"100%",padding:"16px",background:"linear-gradient(135deg,#7c3aed,#a78bfa)",color:"#fff",border:"none",borderRadius:14,fontSize:16,fontWeight:700,cursor:"pointer",letterSpacing:0.5,boxShadow:"0 8px 32px rgba(124,58,237,0.4)"},
  disclaimer:{color:"#475569",fontSize:11,marginTop:16,fontFamily:"monospace"},
  testCard:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:24,padding:"36px 32px",maxWidth:580,width:"100%",backdropFilter:"blur(20px)"},
  testHeader:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16},
  qCounter:{color:"#94a3b8",fontSize:13,fontFamily:"monospace"},
  catTag:{background:"rgba(167,139,250,0.12)",color:"#a78bfa",borderRadius:100,padding:"3px 12px",fontSize:12,border:"1px solid rgba(167,139,250,0.3)"},
  timer:{fontFamily:"monospace",fontSize:15,fontWeight:700,border:"1px solid",borderRadius:8,padding:"4px 12px"},
  progressBg:{height:4,background:"rgba(255,255,255,0.08)",borderRadius:100,marginBottom:28,overflow:"hidden"},
  progressFill:{height:"100%",background:"linear-gradient(90deg,#7c3aed,#a78bfa)",borderRadius:100,transition:"width 0.4s ease"},
  questionBox:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"24px",marginBottom:24},
  questionText:{color:"#e2e8f0",fontSize:17,lineHeight:1.7,margin:0,fontWeight:500},
  optionsGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16},
  optionBtn:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"14px 16px",color:"#cbd5e1",fontSize:14,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,fontFamily:"'Georgia',serif"},
  optionSelected:{background:"rgba(167,139,250,0.15)",border:"1px solid rgba(167,139,250,0.6)",color:"#f1f5f9"},
  optionLetter:{background:"rgba(167,139,250,0.2)",color:"#a78bfa",borderRadius:6,width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0,fontFamily:"monospace"},
  nextBtn:{padding:"14px",background:"linear-gradient(135deg,#7c3aed,#a78bfa)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer"},
  skipBtn:{padding:"14px 20px",background:"rgba(255,255,255,0.06)",color:"#94a3b8",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,fontSize:14,cursor:"pointer",fontFamily:"'Georgia',serif"},
  resultCard:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:24,padding:"40px 36px",maxWidth:580,width:"100%",backdropFilter:"blur(20px)",textAlign:"center"},
  iqRing:{position:"relative",width:160,height:160,margin:"24px auto 16px"},
  iqInner:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"},
  iqNumber:{fontSize:40,fontWeight:900,lineHeight:1},
  iqLabel:{color:"#64748b",fontSize:11,fontFamily:"monospace",letterSpacing:1},
  levelBadge:{display:"inline-block",borderRadius:100,padding:"6px 20px",fontSize:13,fontWeight:700,letterSpacing:0.5,marginBottom:24},
  statsRow:{display:"flex",gap:12,justifyContent:"center",marginBottom:28},
  statBox:{display:"flex",flexDirection:"column",alignItems:"center",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"14px 20px",flex:1},
  statNum:{fontSize:22,fontWeight:800,color:"#f1f5f9"},
  statLabel:{fontSize:10,color:"#64748b",fontFamily:"monospace",letterSpacing:1,marginTop:2},
  breakdownTitle:{color:"#94a3b8",fontSize:11,letterSpacing:2,fontFamily:"monospace",textAlign:"left",marginBottom:12},
  catRow:{display:"flex",alignItems:"center",gap:10,marginBottom:10},
  catRowLeft:{display:"flex",alignItems:"center",gap:6,width:160,textAlign:"left"},
  catRowName:{color:"#cbd5e1",fontSize:12,whiteSpace:"nowrap"},
  catBarBg:{flex:1,height:8,background:"rgba(255,255,255,0.08)",borderRadius:100,overflow:"hidden"},
  catBarFill:{height:"100%",borderRadius:100,transition:"width 1s ease"},
  catPct:{color:"#64748b",fontSize:12,fontFamily:"monospace",width:32},
  certSection:{background:"rgba(251,191,36,0.06)",border:"1px solid rgba(251,191,36,0.25)",borderRadius:20,padding:"24px",marginTop:24,textAlign:"left"},
  certHeader:{display:"flex",alignItems:"center",gap:12,marginBottom:16},
  certTitle:{color:"#fbbf24",fontWeight:700,fontSize:16},
  certSubtitle:{color:"#94a3b8",fontSize:12},
  certPrice:{marginLeft:"auto",background:"rgba(251,191,36,0.15)",color:"#fbbf24",border:"1px solid rgba(251,191,36,0.4)",borderRadius:100,padding:"4px 14px",fontSize:16,fontWeight:700},
  certFeatures:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:16},
  certFeature:{color:"#cbd5e1",fontSize:12,display:"flex",gap:6,alignItems:"flex-start"},
  nameInput:{width:"100%",padding:"12px 16px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,color:"#f1f5f9",fontSize:14,marginBottom:12,boxSizing:"border-box",fontFamily:"'Georgia',serif",outline:"none"},
  certBtn:{width:"100%",padding:"14px",background:"linear-gradient(135deg,#b8963e,#fbbf24)",color:"#1a0f00",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 6px 24px rgba(184,150,62,0.4)"},
  modal:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16},
  modalCard:{background:"#1a1040",border:"1px solid rgba(251,191,36,0.3)",borderRadius:24,padding:"36px 32px",maxWidth:380,width:"100%",boxShadow:"0 0 60px rgba(251,191,36,0.15)"},
  modalTitle:{color:"#f1f5f9",fontSize:20,fontWeight:700,textAlign:"center",marginBottom:8},
  modalName:{color:"#a78bfa",fontSize:22,fontWeight:700,textAlign:"center",marginBottom:4},
  modalIQ:{color:"#94a3b8",fontSize:14,textAlign:"center",marginBottom:16},
  modalPrice:{color:"#fbbf24",fontSize:36,fontWeight:900,textAlign:"center",marginBottom:4},
  payBtn:{width:"100%",padding:"14px",background:"linear-gradient(135deg,#b8963e,#fbbf24)",color:"#1a0f00",border:"none",borderRadius:12,fontSize:16,fontWeight:700,cursor:"pointer",marginBottom:10,boxShadow:"0 6px 24px rgba(184,150,62,0.4)"},
  cancelBtn:{width:"100%",padding:"12px",background:"transparent",color:"#64748b",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,fontSize:14,cursor:"pointer",fontFamily:"'Georgia',serif"},
};
