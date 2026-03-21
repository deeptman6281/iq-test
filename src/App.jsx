import { useState, useEffect, useRef } from "react";

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

// ── Seal is in repo ROOT → Vite serves it at /Seal.png ──
const SEAL_URL = "/Seal.png";

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
  return "NMI-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substring(2,6).toUpperCase();
}

function getCatColor(pct) {
  if (pct >= 75) return "#2ecc71";
  if (pct >= 50) return "#f39c12";
  return "#e74c3c";
}

function drawCertificate(canvas, name, iq, label, certID, date, catScores, sealImg) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  ctx.fillStyle = "#fdfaf4";
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "#b8963e"; ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, W-36, H-36);
  ctx.strokeStyle = "#d4af5a"; ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, W-56, H-56);

  [[40,40],[W-40,40],[40,H-40],[W-40,H-40]].forEach(([x,y]) => {
    ctx.fillStyle = "#b8963e";
    ctx.beginPath(); ctx.arc(x,y,6,0,Math.PI*2); ctx.fill();
  });

  ctx.strokeStyle = "#d4af5a"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(60,70); ctx.lineTo(W-60,70); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(60,74); ctx.lineTo(W-60,74); ctx.stroke();

  ctx.fillStyle = "#1a1040"; ctx.font = "bold 20px Georgia,serif"; ctx.textAlign = "center";
  ctx.fillText(AUTHORITY, W/2, 108);
  ctx.fillStyle = "#6b5c3e"; ctx.font = "12px Georgia,serif";
  ctx.fillText(AUTHORITY_TAGLINE, W/2, 128);
  ctx.fillStyle = "#b8963e"; ctx.font = "italic 14px Georgia,serif";
  ctx.fillText("Certificate of Cognitive Assessment", W/2, 158);

  ctx.strokeStyle = "#d4af5a"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(100,170); ctx.lineTo(W-100,170); ctx.stroke();

  ctx.fillStyle = "#4a3f2f"; ctx.font = "13px Georgia,serif";
  ctx.fillText("This is to certify that", W/2, 200);

  ctx.fillStyle = "#1a1040"; ctx.font = "bold 30px Georgia,serif";
  ctx.fillText(name || "Candidate", W/2, 242);
  const nw = ctx.measureText(name || "Candidate").width;
  ctx.strokeStyle = "#b8963e"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W/2-nw/2,250); ctx.lineTo(W/2+nw/2,250); ctx.stroke();

  ctx.fillStyle = "#4a3f2f"; ctx.font = "13px Georgia,serif";
  ctx.fillText("has successfully completed the NeuroMark Cognitive Assessment", W/2, 276);

  // Score box left
  const scoreX = W/2 - 260;
  const scoreBoxW = 220, scoreBoxH = 180, scoreBoxY = 292;
  ctx.strokeStyle = "#d4af5a"; ctx.lineWidth = 1;
  ctx.strokeRect(scoreX, scoreBoxY, scoreBoxW, scoreBoxH);

  ctx.fillStyle = "#b8963e"; ctx.font = "bold 58px Georgia,serif"; ctx.textAlign = "center";
  ctx.fillText(iq, scoreX + scoreBoxW/2, scoreBoxY + 76);

  ctx.fillStyle = "#1a1040"; ctx.font = "bold 16px Georgia,serif";
  ctx.fillText(label, scoreX + scoreBoxW/2, scoreBoxY + 104);

  ctx.strokeStyle = "#d4af5a"; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(scoreX+20, scoreBoxY+118); ctx.lineTo(scoreX+scoreBoxW-20, scoreBoxY+118); ctx.stroke();

  ctx.fillStyle = "#6b5c3e"; ctx.font = "11px Georgia,serif";
  ctx.fillText("IQ SCORE", scoreX + scoreBoxW/2, scoreBoxY + 136);
  ctx.fillText("NeuroMark Assessment 2026", scoreX + scoreBoxW/2, scoreBoxY + 154);
  ctx.fillText("NeuroMark Certified · 2026", scoreX + scoreBoxW/2, scoreBoxY + 170);

  // Category bars right
  const barX = W/2 - 20;
  const barW = 290, barStartY = 300, barH = 14, barGap = 26;

  ctx.fillStyle = "#4a3f2f"; ctx.font = "bold 11px Georgia,serif"; ctx.textAlign = "left";
  ctx.fillText("COGNITIVE PROFILE", barX, barStartY - 8);

  categories.forEach((cat, i) => {
    const s = catScores[cat];
    const pct = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
    const y = barStartY + i * barGap;
    const shortName = cat.replace(" / ","/").replace("Reasoning","Rsng").replace("Recognition","Recog").replace("Numerical","Num").replace("Language","Lang").replace("Memory","Mem");

    ctx.fillStyle = "#4a3f2f"; ctx.font = "10px Georgia,serif"; ctx.textAlign = "left";
    ctx.fillText(shortName, barX, y + 10);

    const bx = barX + 118;
    ctx.fillStyle = "#e8dfc8";
    ctx.fillRect(bx, y, barW - 118, barH);

    const fillW = Math.max(4, ((barW - 118) * pct) / 100);
    ctx.fillStyle = getCatColor(pct);
    ctx.fillRect(bx, y, fillW, barH);

    ctx.fillStyle = "#6b5c3e"; ctx.font = "10px Georgia,serif"; ctx.textAlign = "right";
    ctx.fillText(pct + "%", bx - 6, y + 11);
  });

  const divY = scoreBoxY + scoreBoxH + 18;
  ctx.strokeStyle = "#d4af5a"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(100,divY); ctx.lineTo(W-100,divY); ctx.stroke();

  // Draw seal if loaded
  if (sealImg) {
    ctx.drawImage(sealImg, 44, divY + 8, 112, 112);
  }

  // Signature
  const sigY = divY + 28;
  ctx.strokeStyle = "#4a3f2f"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(240,sigY+50); ctx.lineTo(480,sigY+50); ctx.stroke();
  ctx.fillStyle = "#1a1040"; ctx.font = "italic bold 14px Georgia,serif"; ctx.textAlign = "center";
  ctx.fillText("Dr. A. Ravensworth", 360, sigY+46);
  ctx.fillStyle = "#4a3f2f"; ctx.font = "10px Georgia,serif";
  ctx.fillText("Chief Assessment Officer", 360, sigY+62);
  ctx.fillText(AUTHORITY, 360, sigY+76);

  ctx.textAlign = "right"; ctx.fillStyle = "#6b5c3e"; ctx.font = "10px Georgia,serif";
  ctx.fillText("Date: " + date, W-50, sigY+36);
  ctx.fillText("Certificate ID: " + certID, W-50, sigY+52);
  ctx.fillText("Verify at neuromark.institute", W-50, sigY+68);

  ctx.strokeStyle = "#d4af5a"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(60,H-38); ctx.lineTo(W-60,H-38); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(60,H-34); ctx.lineTo(W-60,H-34); ctx.stroke();
  ctx.textAlign = "center"; ctx.fillStyle = "#9a8060"; ctx.font = "9px Georgia,serif";
  ctx.fillText("This certificate is issued for educational and entertainment purposes. " + AUTHORITY + " © " + new Date().getFullYear(), W/2, H-18);
}
function generateVectorPDF(name, iq, label, certID, date, catScores) {
  const { jsPDF } = require("jspdf");

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const W = 297;
  const H = 210;

  pdf.setFillColor(253, 250, 244);
  pdf.rect(0, 0, W, H, "F");

  pdf.setDrawColor(184, 150, 62);
  pdf.setLineWidth(1.5);
  pdf.rect(10, 10, W - 20, H - 20);

  pdf.setDrawColor(212, 175, 90);
  pdf.setLineWidth(0.5);
  pdf.rect(14, 14, W - 28, H - 28);

  pdf.setFont("times", "bold");
  pdf.setFontSize(26);
  pdf.text("NEUROMARK INSTITUTE", W / 2, 30, { align: "center" });

  pdf.setFontSize(14);
  pdf.text("Global Centre for Cognitive Assessment", W / 2, 38, { align: "center" });

  pdf.setFont("times", "italic");
  pdf.setFontSize(16);
  pdf.text("Certificate of Cognitive Assessment", W / 2, 48, { align: "center" });

  pdf.line(30, 52, W - 30, 52);

  pdf.setFont("times", "normal");
  pdf.setFontSize(14);
  pdf.text("This is to certify that", W / 2, 65, { align: "center" });

  pdf.setFont("times", "bold");
  pdf.setFontSize(28);
  pdf.text(name || "Candidate", W / 2, 78, { align: "center" });

  pdf.line(W / 2 - 50, 82, W / 2 + 50, 82);

  pdf.setFontSize(12);
  pdf.text(
    "has successfully completed the NeuroMark Cognitive Assessment",
    W / 2,
    92,
    { align: "center" }
  );

  pdf.rect(30, 105, 60, 45);

  pdf.setFontSize(28);
  pdf.text(String(iq), 60, 125, { align: "center" });

  pdf.setFontSize(12);
  pdf.text(label, 60, 135, { align: "center" });

  pdf.setFontSize(10);
  pdf.text("IQ SCORE", 60, 145, { align: "center" });

  let y = 110;
  pdf.setFontSize(10);
  pdf.text("COGNITIVE PROFILE", 110, 100);

  Object.keys(catScores).forEach((cat) => {
    const s = catScores[cat];
    const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;

    pdf.text(cat, 110, y);

    pdf.setFillColor(230, 220, 200);
    pdf.rect(150, y - 4, 100, 4, "F");

    pdf.setFillColor(47, 111, 79);
    pdf.rect(150, y - 4, (pct / 100) * 100, 4, "F");

    pdf.text(pct + "%", 255, y, { align: "right" });

    y += 10;
  });

  pdf.text("Date: " + date, W - 20, 160, { align: "right" });
  pdf.text("Certificate ID: " + certID, W - 20, 166, { align: "right" });

  pdf.setFont("times", "italic");
  pdf.text("Dr. A. Ravensworth", W / 2, 160, { align: "center" });

  pdf.setFont("times", "normal");
  pdf.text("Chief Assessment Officer", W / 2, 166, { align: "center" });

  pdf.save(`IQ_Certificate_${name}.pdf`);
}
function canvasToPDF(canvas, name) {
  const imgData = canvas.toDataURL("image/jpeg", 0.98);
  const win = window.open("", "_blank");
  win.document.write(`<!DOCTYPE html><html><head><title>IQ Certificate - ${name}</title>
    <style>
      @page { size: A4 landscape; margin: 0; }
      * { margin:0; padding:0; box-sizing:border-box; }
      body { width:297mm; height:210mm; display:flex; align-items:center; justify-content:center; background:white; }
      img { width:297mm; height:210mm; object-fit:contain; }
    </style></head><body>
    <img src="${imgData}"/>
    <script>window.onload=function(){setTimeout(function(){window.print();},500);};<\/script>
    </body></html>`);
  win.document.close();
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

  // Pre-load seal image on mount so it's ready for canvas
  const sealRef = useRef(null);
  useEffect(() => {
    const img = new Image();
    img.src = SEAL_URL;
    img.onload = () => { sealRef.current = img; };
    img.onerror = () => { sealRef.current = null; };
  }, []);

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

  const handleDownloadPDF = () => {
    const {iq, catScores} = computeResults();
    const {label} = getIQLabel(iq);
    const canvas = canvasRef.current;
    canvas.width = 1200; canvas.height = 848;
    const date = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
    setGenerating(true);
    setTimeout(() => {
      drawCertificate(canvas, certName, iq, label, certID, date, catScores, sealRef.current);
      setGenerating(false);
      setCertGenerated(true);
      generateVectorPDF(certName, iq, label, certID, date, catScores);
    }, 150);
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
              {["NeuroMark seal","IQ score & classification","Cognitive profile bars","A4 PDF — print ready"].map(f=>(
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
                {certGenerated&&<p style={{color:"#34d399",fontSize:12,marginTop:8}}>✅ Print dialog opened — choose "Save as PDF" 🎉</p>}
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
