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

const COLORS = {
  NAVY: "#1a2b44",
  GOLD_DARK: "#8e7341",
  GOLD_LIGHT: "#c5a467",
  TEXT_MAIN: "#2c3e50",
  BG_CREAM: "#fdfaf4",
  ACCENT_GREEN: "#2d5a27"
};

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

function drawCertificate(canvas, name, iq, label, certID, date, sealImg, catScores) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  // Background
  ctx.fillStyle = COLORS.BG_CREAM;
  ctx.fillRect(0, 0, W, H);

  // Ornate Borders
  ctx.strokeStyle = COLORS.GOLD_DARK;
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, W - 60, H - 60);
  
  ctx.strokeStyle = COLORS.GOLD_LIGHT;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(42, 42, W - 84, H - 84);

  // Decorative Side Ornaments
  const drawOrnaments = (x) => {
    ctx.save();
    ctx.strokeStyle = COLORS.GOLD_DARK;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 1;
    for (let i = 80; i < H - 80; i += 30) {
      ctx.beginPath();
      ctx.arc(x, i, 10, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  };
  drawOrnaments(20);
  drawOrnaments(W - 20);

  // Header
  ctx.textAlign = "center";
  
  // Brain Icons
  ctx.fillStyle = COLORS.GOLD_LIGHT;
  ctx.font = "40px serif";
  ctx.fillText("🧠", W/2 - 260, 115);
  ctx.fillText("🧠", W/2 + 260, 115);

  ctx.fillStyle = COLORS.NAVY;
  ctx.font = "bold 34px 'Times New Roman', serif";
  ctx.fillText(AUTHORITY.toUpperCase(), W / 2, 110);
  
  ctx.fillStyle = COLORS.TEXT_MAIN;
  ctx.font = "14px 'Georgia', serif";
  ctx.fillText(AUTHORITY_TAGLINE, W / 2, 134);

  ctx.fillStyle = COLORS.GOLD_DARK;
  ctx.font = "italic 24px 'Georgia', serif";
  ctx.fillText("Certificate of Cognitive Assessment", W / 2, 175);

  ctx.strokeStyle = COLORS.GOLD_LIGHT;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W/2 - 150, 190); ctx.lineTo(W/2 + 150, 190); ctx.stroke();

  // Recipient info
  ctx.fillStyle = COLORS.TEXT_MAIN;
  ctx.font = "16px 'Georgia', serif";
  ctx.fillText("This is to certify that", W / 2, 230);

  ctx.fillStyle = COLORS.NAVY;
  ctx.font = "bold 52px 'Times New Roman', serif";
  ctx.fillText(name || "Candidate", W / 2, 290);

  ctx.strokeStyle = COLORS.GOLD_DARK;
  ctx.lineWidth = 2.5;
  const nw = ctx.measureText(name || "Candidate").width;
  ctx.beginPath(); ctx.moveTo(W/2 - nw/2 - 20, 305); ctx.lineTo(W/2 + nw/2 + 20, 305); ctx.stroke();

  ctx.fillStyle = COLORS.TEXT_MAIN;
  ctx.font = "15px 'Georgia', serif";
  ctx.fillText("has successfully completed the NeuroMark Cognitive Assessment", W / 2, 335);

  // Score Badge (Left Side)
  const bX = 140, bY = 370, bW = 260, bH = 220;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(bX, bY, bW, bH);
  ctx.strokeStyle = COLORS.GOLD_DARK;
  ctx.lineWidth = 3;
  ctx.strokeRect(bX, bY, bW, bH);

  ctx.fillStyle = COLORS.GOLD_DARK;
  ctx.font = "bold 82px 'Times New Roman', serif";
  ctx.fillText(iq, bX + bW/2, bY + 100);

  ctx.fillStyle = COLORS.NAVY;
  ctx.font = "bold 20px 'Georgia', serif";
  ctx.fillText(label.toUpperCase(), bX + bW/2, bY + 145);
  
  ctx.fillStyle = COLORS.GOLD_DARK;
  ctx.font = "11px 'Georgia', serif";
  ctx.fillText("IQ SCORE", bX + bW/2, bY + 175);
  ctx.fillText("NeuroMark Certified 2026", bX + bW/2, bY + 195);

  // Profile Bars (Right Side)
  const barX = 480, barY = 390;
  ctx.textAlign = "left";
  ctx.fillStyle = COLORS.NAVY;
  ctx.font = "bold 15px 'Georgia', serif";
  ctx.fillText("COGNITIVE PROFILE", barX, barY - 15);

  categories.forEach((cat, i) => {
    const s = catScores[cat];
    const pct = s && s.total > 0 ? (s.correct / s.total) * 100 : 0;
    const y = barY + i * 34;
    
    ctx.fillStyle = COLORS.TEXT_MAIN;
    ctx.font = "13px 'Georgia', serif";
    ctx.fillText(cat.replace("Recognition","Recog").replace("Numerical","Num").replace("Reasoning","Rsng"), barX, y + 14);

    // Bar BG
    ctx.fillStyle = "#e8e1d5";
    ctx.fillRect(barX + 160, y, 380, 16);
    
    // Bar Fill
    ctx.fillStyle = pct >= 75 ? COLORS.ACCENT_GREEN : COLORS.GOLD_DARK;
    ctx.fillRect(barX + 160, y, (380 * pct) / 100, 16);
    
    ctx.fillStyle = COLORS.NAVY;
    ctx.font = "bold 12px 'Georgia', serif";
    ctx.textAlign = "right";
    ctx.fillText(`${Math.round(pct)}%`, barX + 580, y + 14);
    ctx.textAlign = "left";
  });

  // Footer Section
  const footerY = H - 160;
  
  // Seal
  if (sealImg) {
    ctx.drawImage(sealImg, W/2 - 70, footerY - 50, 140, 140);
  }

  // Signature
  ctx.textAlign = "center";
  ctx.strokeStyle = COLORS.NAVY;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(120, footerY + 80); ctx.lineTo(400, footerY + 80); ctx.stroke();
  
  ctx.fillStyle = COLORS.NAVY;
  ctx.font = "italic bold 22px 'Georgia', serif";
  ctx.fillText("Dr. A. Ravensworth", 260, footerY + 70);
  ctx.font = "12px 'Georgia', serif";
  ctx.fillText("Chief Assessment Officer, NeuroMark Institute", 260, footerY + 100);

  // Metadata
  ctx.textAlign = "right";
  ctx.fillStyle = COLORS.TEXT_MAIN;
  ctx.font = "11px 'Courier New', monospace";
  ctx.fillText(`DATE: ${date}`, W - 120, footerY + 60);
  ctx.fillText(`CERTIFICATE ID: ${certID}`, W - 120, footerY + 80);
  ctx.fillText(`VERIFY: neuromark.institute/verify`, W - 120, footerY + 100);
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
    <script>window.onload=function(){setTimeout(function(){window.print();},500);};</script>
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

  const generateCert = (callback) => {
    const {iq,catScores} = computeResults();
    const {label} = getIQLabel(iq);
    const canvas = canvasRef.current;
    canvas.width=1400; canvas.height=990;
    const date = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
    setGenerating(true);
    
    const img = new Image();
    img.crossOrigin="anonymous";
    img.src = "/seal.png"; 
    
    img.onload = () => {
      drawCertificate(canvas,certName,iq,label,certID,date,img,catScores);
      setGenerating(false); setCertGenerated(true);
      callback(canvas);
    };
    img.onerror = () => {
      drawCertificate(canvas,certName,iq,label,certID,date,null,catScores);
      setGenerating(false); setCertGenerated(true);
      callback(canvas);
    };
  };

  const handleDownloadPDF = () => generateCert(canvas=>canvasToPDF(canvas,certName));
  const handlePayment = () => {setPaid(true);setShowPaywall(false);};

  const progress=(current/QUESTIONS.length)*100;
  const q=QUESTIONS[current];

  if(screen==="intro") return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.badge}>COGNITIVE ASSESSMENT</div>
        <h1 style={S.title}>IQ<span style={{color:"#a78bfa"}}>Test</span></h1>
        <p style={S.subtitle}>Professional-grade evaluation by {AUTHORITY}</p>
        <div style={S.categoryGrid}>
          {[{icon:"🔗",name:"Logic"},{icon:"🔷",name:"Patterns"},{icon:"📐",name:"Math"},{icon:"📝",name:"Verbal"},{icon:"🧊",name:"Spatial"},{icon:"🧠",name:"Memory"}].map(c=>(
            <div key={c.name} style={S.catChip}><span>{c.icon}</span> {c.name}</div>
          ))}
        </div>
        <div style={S.infoRow}>
          <div style={S.infoBox}><span style={S.infoNum}>20</span><span style={S.infoLabel}>Questions</span></div>
          <div style={S.infoBox}><span style={S.infoNum}>20</span><span style={S.infoLabel}>Minutes</span></div>
        </div>
        <button style={S.startBtn} onClick={()=>setScreen("test")}>Begin Assessment →</button>
      </div>
    </div>
  );

  if(screen==="test") return (
    <div style={S.page}>
      <div style={S.testCard}>
        <div style={S.testHeader}>
          <span style={S.qCounter}>QUESTION {current+1} OF {QUESTIONS.length}</span>
          <span style={S.catTag}>{q.categoryIcon} {q.category}</span>
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
        <button style={{...S.nextBtn,opacity:selected===null?0.4:1}} disabled={selected===null} onClick={handleNext}>
          {current+1===QUESTIONS.length?"Submit Assessment ✓":"Next Question →"}
        </button>
      </div>
    </div>
  );

  if(screen==="result") {
    const {correct,total,iq,catScores}=computeResults();
    const {label,color}=getIQLabel(iq);
    return (
      <div style={S.page}>
        <div style={S.resultCard}>
          <div style={S.badge}>FINAL SCORE</div>
          <div style={{...S.iqNumber,color}}>{iq}</div>
          <div style={{...S.levelBadge,background:color+"22",color}}>{label}</div>
          
          <div style={S.breakdownTitle}>PERFORMANCE BY CATEGORY</div>
          {categories.map(cat=>{
            const s=catScores[cat];
            const pct=s.total>0?Math.round((s.correct/s.total)*100):0;
            return (
              <div key={cat} style={S.catRow}>
                <span style={S.catRowName}>{cat}</span>
                <div style={S.catBarBg}><div style={{...S.catBarFill,width:`${pct}%`,background:pct>=75?COLORS.ACCENT_GREEN:COLORS.GOLD_DARK}}/></div>
                <span style={S.catPct}>{pct}%</span>
              </div>
            );
          })}

          <div style={S.certSection}>
            <div style={S.certTitle}>🏆 Professional PDF Certificate</div>
            <p style={S.certSubtitle}>Get your formal certificate with seal and breakdown for {CERT_PRICE}</p>
            {!paid?(
              <>
                <input style={S.nameInput} placeholder="Enter Full Name" value={certName} onChange={e=>setCertName(e.target.value)}/>
                <button style={S.certBtn} onClick={()=>{if(certName.trim())setShowPaywall(true);}}>
                   Unlock Certificate — {CERT_PRICE}
                </button>
              </>
            ):(
              <button style={S.certBtn} onClick={handleDownloadPDF} disabled={generating}>
                {generating?"⏳ Generating...":"📄 Download PDF Certificate"}
              </button>
            )}
          </div>
          
          {showPaywall&&(
            <div style={S.modal}>
              <div style={S.modalCard}>
                <div style={S.modalTitle}>Complete Order</div>
                <p style={{color:"#94a3b8",textAlign:"center"}}>PDF Certificate for {certName}</p>
                <div style={S.modalPrice}>{CERT_PRICE}</div>
                <button style={S.payBtn} onClick={handlePayment}>Pay & Download</button>
                <button style={S.cancelBtn} onClick={()=>setShowPaywall(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
        <canvas ref={canvasRef} style={{display:"none"}}/>
      </div>
    );
  }
}

const S={
  page:{minHeight:"100vh",background:"#0a0a0c",display:"flex",justifyContent:"center",alignItems:"flex-start",padding:"40px 20px",fontFamily:"'Georgia',serif"},
  card:{background:"#141418",border:"1px solid #2d2d35",borderRadius:24,padding:"48px 40px",maxWidth:500,width:"100%",textAlign:"center"},
  badge:{color:"#a78bfa",fontSize:11,letterSpacing:3,marginBottom:20},
  title:{fontSize:52,fontWeight:900,color:"#fff",margin:"0 0 8px"},
  subtitle:{color:"#94a3b8",fontSize:16,marginBottom:32},
  categoryGrid:{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:32},
  catChip:{background:"#222228",borderRadius:100,padding:"6px 14px",fontSize:12,color:"#cbd5e1"},
  infoRow:{display:"flex",gap:12,justifyContent:"center",marginBottom:24},
  infoBox:{background:"#1c1c22",borderRadius:16,padding:"16px 24px"},
  infoNum:{fontSize:28,fontWeight:900,color:"#fff",display:"block"},
  infoLabel:{fontSize:11,color:"#64748b"},
  startBtn:{width:"100%",padding:"16px",background:"#7c3aed",color:"#fff",border:"none",borderRadius:14,fontSize:16,fontWeight:700,cursor:"pointer"},
  testCard:{background:"#141418",borderRadius:24,padding:"36px 32px",maxWidth:580,width:"100%"},
  testHeader:{display:"flex",justifyContent:"space-between",marginBottom:16},
  qCounter:{color:"#64748b",fontSize:12},
  catTag:{color:"#a78bfa",fontSize:12},
  progressBg:{height:4,background:"#222",marginBottom:28},
  progressFill:{height:"100%",background:"#7c3aed"},
  questionBox:{padding:"24px",marginBottom:24},
  questionText:{color:"#fff",fontSize:18,lineHeight:1.6},
  optionsGrid:{display:"grid",gridTemplateColumns:"1fr",gap:12,marginBottom:24},
  optionBtn:{background:"#1c1c22",border:"1px solid #2d2d35",borderRadius:12,padding:"16px",color:"#cbd5e1",textAlign:"left",display:"flex",gap:12,cursor:"pointer"},
  optionSelected:{borderColor:"#7c3aed",background:"#252035"},
  optionLetter:{color:"#7c3aed",fontWeight:700},
  nextBtn:{width:"100%",padding:"16px",background:"#7c3aed",color:"#fff",borderRadius:12,border:"none",fontWeight:700},
  resultCard:{background:"#141418",borderRadius:24,padding:"40px",maxWidth:500,width:"100%",textAlign:"center"},
  iqNumber:{fontSize:72,fontWeight:900,margin:"10px 0"},
  levelBadge:{padding:"6px 20px",borderRadius:100,fontSize:14,fontWeight:700,marginBottom:32,display:"inline-block"},
  breakdownTitle:{textAlign:"left",fontSize:11,color:"#64748b",letterSpacing:1,marginBottom:16},
  catRow:{display:"flex",alignItems:"center",gap:12,marginBottom:12},
  catRowName:{color:"#cbd5e1",fontSize:13,width:120,textAlign:"left"},
  catBarBg:{flex:1,height:8,background:"#222",borderRadius:4},
  catBarFill:{height:"100%",borderRadius:4},
  catPct:{color:"#64748b",fontSize:12,width:35},
  certSection:{background:"#1c1c22",padding:"24px",borderRadius:20,marginTop:32,textAlign:"left"},
  certTitle:{color:"#fbbf24",fontSize:18,fontWeight:700,marginBottom:4},
  certSubtitle:{color:"#94a3b8",fontSize:13,marginBottom:16},
  nameInput:{width:"100%",padding:"12px",background:"#0a0a0c",border:"1px solid #2d2d35",color:"#fff",borderRadius:8,marginBottom:12},
  certBtn:{width:"100%",padding:"14px",background:COLORS.GOLD_DARK,color:"#fff",border:"none",borderRadius:10,fontWeight:700,cursor:"pointer"},
  modal:{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",padding:20},
  modalCard:{background:"#141418",padding:"32px",borderRadius:24,maxWidth:400,width:"100%"},
  modalTitle:{fontSize:24,color:"#fff",textAlign:"center",marginBottom:16},
  modalPrice:{fontSize:48,color:"#fbbf24",textAlign:"center",fontWeight:900,margin:"20px 0"},
  payBtn:{width:"100%",padding:"16px",background:"#fbbf24",color:"#000",borderRadius:12,fontWeight:900,border:"none",cursor:"pointer",marginBottom:12},
  cancelBtn:{width:"100%",background:"transparent",color:"#64748b",border:"none",cursor:"pointer"}
};
