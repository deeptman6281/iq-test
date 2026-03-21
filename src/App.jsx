import { useRef, useEffect } from "react";
import { jsPDF } from "jspdf";

export default function App() {
  const canvasRef = useRef(null);
  const sealRef = useRef(null);
  const brainRef = useRef(null);

  // Load images
  useEffect(() => {
    const seal = new Image();
    seal.src = "/Seal.png";
    seal.onload = () => (sealRef.current = seal);

    const brain = new Image();
    brain.src = "/brain.png";
    brain.onload = () => (brainRef.current = brain);
  }, []);

  const generateCertificate = () => {
    const canvas = canvasRef.current;

    // High resolution
    canvas.width = 2480;
    canvas.height = 1754;

    const ctx = canvas.getContext("2d");

    const name = "Deeptman Mishra";
    const iq = 125;
    const label = "Superior";
    const certID = "NM-123456";
    const date = "21 March 2026";

    const catScores = {
      "Logical Reasoning": { correct: 4, total: 4 },
      "Pattern Recognition": { correct: 3, total: 4 },
      "Math / Numerical": { correct: 4, total: 4 },
      "Verbal / Language": { correct: 3, total: 4 },
      "Spatial Reasoning": { correct: 0, total: 2 },
      "Working Memory": { correct: 2, total: 2 }
    };

    drawCertificate(
      canvas,
      name,
      iq,
      label,
      certID,
      date,
      catScores,
      sealRef.current,
      brainRef.current
    );

    generatePDF(canvas, name);
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={generateCertificate}>
        Download Premium Certificate
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

// 🎨 DRAW CERTIFICATE
function drawCertificate(canvas, name, iq, label, certID, date, catScores, sealImg, brainImg) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  // Background
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#f8f4e8");
  grad.addColorStop(1, "#efe6d2");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Borders
  ctx.strokeStyle = "#b8963e";
  ctx.lineWidth = 14;
  ctx.strokeRect(25, 25, W - 50, H - 50);

  ctx.strokeStyle = "#d4af5a";
  ctx.lineWidth = 4;
  ctx.strokeRect(50, 50, W - 100, H - 100);

  // Corner dots
  ctx.fillStyle = "#b8963e";
  [[70,70],[W-70,70],[70,H-70],[W-70,H-70]].forEach(([x,y])=>{
    ctx.beginPath(); ctx.arc(x,y,10,0,Math.PI*2); ctx.fill();
  });

  ctx.textAlign = "center";

  // Header
  ctx.fillStyle = "#1a2a4a";
  ctx.font = "bold 70px Georgia";
  ctx.fillText("NEUROMARK INSTITUTE", W/2, 170);

  ctx.font = "28px Georgia";
  ctx.fillStyle = "#5c5c5c";
  ctx.fillText("Global Centre for Cognitive Assessment", W/2, 220);

  // Brain icons
  if (brainImg) {
    ctx.drawImage(brainImg, W/2 - 550, 120, 120, 80);
    ctx.drawImage(brainImg, W/2 + 430, 120, 120, 80);
  }

  ctx.font = "italic 40px Georgia";
  ctx.fillStyle = "#b8963e";
  ctx.fillText("Certificate of Cognitive Assessment", W/2, 300);

  // Divider
  ctx.strokeStyle = "#b8963e";
  ctx.beginPath();
  ctx.moveTo(200, 330);
  ctx.lineTo(W - 200, 330);
  ctx.stroke();

  // Name
  ctx.fillStyle = "#333";
  ctx.font = "26px Georgia";
  ctx.fillText("This is to certify that", W/2, 380);

  ctx.font = "bold 80px Georgia";
  ctx.fillStyle = "#1a2a4a";
  ctx.fillText(name, W/2, 460);

  ctx.strokeStyle = "#b8963e";
  ctx.beginPath();
  ctx.moveTo(W/2 - 300, 490);
  ctx.lineTo(W/2 + 300, 490);
  ctx.stroke();

  ctx.font = "26px Georgia";
  ctx.fillText("has successfully completed the NeuroMark Cognitive Assessment", W/2, 540);

  // IQ BOX
  const boxX = W/2 - 650;
  const boxY = 620;

  ctx.strokeStyle = "#b8963e";
  ctx.lineWidth = 5;
  ctx.strokeRect(boxX, boxY, 420, 260);

  ctx.font = "bold 120px Georgia";
  ctx.fillStyle = "#b8963e";
  ctx.fillText(iq, boxX + 210, boxY + 120);

  ctx.font = "bold 42px Georgia";
  ctx.fillStyle = "#1a2a4a";
  ctx.fillText(label, boxX + 210, boxY + 180);

  ctx.font = "22px Georgia";
  ctx.fillText("IQ SCORE", boxX + 210, boxY + 220);

  // Bars
  const startX = W/2 - 50;
  let y = 650;

  ctx.textAlign = "left";
  ctx.font = "bold 26px Georgia";
  ctx.fillText("COGNITIVE PROFILE", startX, y - 40);

  Object.keys(catScores).forEach((cat) => {
    const s = catScores[cat];
    const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;

    ctx.font = "20px Georgia";
    ctx.fillText(cat, startX, y);

    const barX = startX + 260;

    ctx.fillStyle = "#dcd3bf";
    ctx.fillRect(barX, y - 15, 520, 20);

    ctx.fillStyle = "#3e6b4f";
    ctx.fillRect(barX, y - 15, (pct / 100) * 520, 20);

    ctx.fillStyle = "#333";
    ctx.fillText(pct + "%", barX + 540, y);

    y += 50;
  });

  // Seal
  if (sealImg) {
    ctx.drawImage(sealImg, W/2 - 100, H - 260, 200, 200);
  }

  // Signature
  ctx.textAlign = "center";
  ctx.font = "italic 34px Georgia";
  ctx.fillText("Dr. A. Ravensworth", W/2, H - 120);

  ctx.font = "22px Georgia";
  ctx.fillText("Chief Assessment Officer", W/2, H - 80);

  // Footer
  ctx.textAlign = "right";
  ctx.font = "18px Georgia";
  ctx.fillText("Date: " + date, W - 120, H - 120);
  ctx.fillText("Certificate ID: " + certID, W - 120, H - 80);
}

// 📄 PDF
function generatePDF(canvas, name) {
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
  pdf.save(`IQ_Certificate_${name}.pdf`);
}
