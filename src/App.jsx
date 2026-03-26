import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";

const AUTHORITY  = "NeuroMark Institute";
const CERT_PRICE = "\u20B939";
const TOTAL_TIME = 20 * 60;
const ALL_CATEGORIES = [
  "Logical Reasoning",
  "Pattern Recognition",
  "Math / Numerical",
  "Verbal / Language",
  "Spatial Reasoning",
  "Working Memory",
];
const ENV_API_BASE = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/$/, "");
const STATIC_FALLBACK_API_BASES = import.meta.env.DEV
  ? ["http://localhost:8787"]
  : ["https://api.brainrank.org"];

const unique = (items) => [...new Set(items.filter(Boolean))];
const buildApiUrl = (base, path) => (base ? `${base}${path}` : path);

function getCandidateApiBases() {
  const runtimeBases = [];
  if (typeof window !== "undefined") {
    const origin = window.location.origin?.replace(/\/$/, "");
    runtimeBases.push("", origin);
  } else {
    runtimeBases.push("");
  }
  return unique([ENV_API_BASE, ...runtimeBases, ...STATIC_FALLBACK_API_BASES]);
}

async function readJsonSafe(response) {
  const raw = await response.text();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return { error: raw.slice(0, 200) };
  }
}

async function postApiJson(path, payload, fixedBase, validate) {
  const bases = fixedBase !== undefined ? [fixedBase] : getCandidateApiBases();
  const attempts = [];
  let lastError = new Error("Unable to reach payment server.");

  for (const base of bases) {
    const url = buildApiUrl(base, path);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await readJsonSafe(response);
      if (!response.ok) {
        const message = data?.error || `HTTP ${response.status} ${response.statusText}`;
        attempts.push(`${url} -> ${message}`);
        lastError = new Error(`${message} (${url})`);
        continue;
      }
      if (typeof validate === "function") {
        const validationMessage = validate(data);
        if (validationMessage) {
          attempts.push(`${url} -> ${validationMessage}`);
          lastError = new Error(`${validationMessage} (${url})`);
          continue;
        }
      }
      return { data, base, attempts };
    } catch (error) {
      attempts.push(`${url} -> ${error?.message || "Network error"}`);
      lastError = new Error(`${error?.message || "Network error"} (${url})`);
    }
  }

  const details = attempts.slice(-4).join("\n");
  throw new Error(`${lastError.message}\n${details}`);
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  SVG SHAPE RENDERER â€” used for visual matrix questions
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const OPTION_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const KIDS_GAMES = [
  { id: "shape_match", title: "Shape Match", subtitle: "Pick the same shape", level: "Easy", time: "2 min" },
  { id: "odd_one", title: "Odd One Out", subtitle: "Find the different shape", level: "Easy", time: "2 min" },
  { id: "count_shapes", title: "Count Shapes", subtitle: "Count target symbols", level: "Easy-Medium", time: "3 min" },
  { id: "next_pattern", title: "Next Pattern", subtitle: "Choose what comes next", level: "Medium", time: "3 min" },
];
const ACTIVITY_FEED = [
  { name: "Aarav", city: "Pune", score: 128, time: "just now" },
  { name: "Ananya", city: "Bengaluru", score: 121, time: "2 min ago" },
  { name: "Vihaan", city: "Delhi", score: 133, time: "4 min ago" },
  { name: "Ira", city: "Mumbai", score: 118, time: "5 min ago" },
  { name: "Advait", city: "Hyderabad", score: 126, time: "7 min ago" },
  { name: "Meera", city: "Chennai", score: 124, time: "8 min ago" },
  { name: "Reyansh", city: "Ahmedabad", score: 131, time: "10 min ago" },
  { name: "Diya", city: "Kolkata", score: 117, time: "12 min ago" },
  { name: "Kabir", city: "Jaipur", score: 122, time: "14 min ago" },
  { name: "Ishita", city: "Lucknow", score: 129, time: "16 min ago" },
  { name: "Arjun", city: "Indore", score: 119, time: "18 min ago" },
  { name: "Sara", city: "Dubai", score: 123, time: "21 min ago" },
];
const LANDING_LINKS = {
  product: [
    { id: "games", label: "Games", hint: "Open Kids Zone" },
    { id: "tests", label: "Tests", hint: "Go to IQ Test" },
    { id: "training", label: "Training", hint: "Coming soon" },
    { id: "courses", label: "Courses", hint: "Coming soon" },
  ],
  support: [
    { id: "faq", label: "FAQ", hint: "" },
    { id: "contact", label: "Contact", hint: "" },
    { id: "privacy", label: "Privacy Policy", hint: "" },
    { id: "terms", label: "Terms of Service", hint: "" },
  ],
};
const FAQ_ITEMS = [
  {
    question: "How long does the IQ test take?",
    answer: "The main IQ test takes about 20 minutes and includes a timed mix of logic, pattern, numerical, verbal, spatial, and memory questions.",
  },
  {
    question: "How many questions are in the test?",
    answer: "The current IQ assessment includes 20 questions selected from a larger randomized question set.",
  },
  {
    question: "Can I retake the test?",
    answer: "Yes. You can retake the test to attempt a fresh randomized set of questions.",
  },
  {
    question: "When can I download the certificate?",
    answer: "The certificate can be downloaded only after successful verified payment.",
  },
  {
    question: "What details are shown on the certificate?",
    answer: "The certificate includes your name, IQ score, certificate ID, and category-wise cognitive summary.",
  },
  {
    question: "What is Kids Zone?",
    answer: "Kids Zone is a separate section for children aged 4 to 8 years with simpler shape, pattern, and counting activities.",
  },
  {
    question: "What payment methods are supported?",
    answer: "Payment options depend on Razorpay Checkout and may include UPI, cards, net banking, and wallets.",
  },
  {
    question: "What should I do if payment fails?",
    answer: "Retry after a short wait. If the issue continues, contact support with a screenshot and basic payment details.",
  },
];
const PRIVACY_ITEMS = [
  {
    title: "Basic Information",
    body: "We may collect information you enter during the test experience, such as your name for certificate generation and limited payment-related details handled through Razorpay.",
  },
  {
    title: "Assessment Data",
    body: "Your answers, score, and category-level performance may be processed to generate results and certificates.",
  },
  {
    title: "Payments",
    body: "Payments are processed through Razorpay. We do not store your full card, UPI PIN, or sensitive banking credentials on this site.",
  },
  {
    title: "Support",
    body: "If you contact us, we may use your email or message only for support, certificate issues, and service-related communication.",
  },
];
const TERMS_ITEMS = [
  {
    title: "Use of Service",
    body: "This platform is provided for personal assessment, learning, and informational use. You agree not to misuse, disrupt, or attempt to manipulate the test or payment process.",
  },
  {
    title: "Results and Certificates",
    body: "Test results are shown after completion. Certificate download is available only after successful verified payment.",
  },
  {
    title: "Payments and Refunds",
    body: "All certificate payments are handled through Razorpay. Any refund decision, if applicable, is subject to review and support communication.",
  },
  {
    title: "Availability",
    body: "Features, question sets, pricing, and support content may be updated, improved, or changed without prior notice.",
  },
];

const kidCell = (outer, inner, fill, extra = {}) => ({ outer, inner, fill, ...extra });

const shuffleList = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

function makeKidsRound(gameId) {
  const shapePool = [
    kidCell("circle", "dot", "black"),
    kidCell("square", "dot", "gray"),
    kidCell("triangle", "dot", "black"),
    kidCell("circle", "square", "gray"),
    kidCell("square", "circle", "black"),
    kidCell("triangle", "square", "gray"),
  ];

  if (gameId === "shape_match") {
    const target = shapePool[Math.floor(Math.random() * shapePool.length)];
    const wrong = shuffleList(shapePool.filter(s => JSON.stringify(s) !== JSON.stringify(target))).slice(0, 3);
    const options = shuffleList([target, ...wrong]);
    return {
      gameId,
      title: "Tap the same shape",
      mode: "visual_options",
      promptCell: target,
      options,
      answer: options.findIndex(s => JSON.stringify(s) === JSON.stringify(target)),
      points: 3,
    };
  }

  if (gameId === "odd_one") {
    const base = shapePool[Math.floor(Math.random() * shapePool.length)];
    const oddChoices = shapePool.filter(s => JSON.stringify(s) !== JSON.stringify(base));
    const odd = oddChoices[Math.floor(Math.random() * oddChoices.length)];
    const cards = [base, base, base, odd];
    const shuffled = shuffleList(cards);
    return {
      gameId,
      title: "Find the different one",
      mode: "odd_one",
      cards: shuffled,
      answer: shuffled.findIndex(s => JSON.stringify(s) === JSON.stringify(odd)),
      points: 3,
    };
  }

  if (gameId === "count_shapes") {
    const targetOuter = ["circle", "square", "triangle"][Math.floor(Math.random() * 3)];
    const cells = Array.from({ length: 9 }, () =>
      kidCell(["circle", "square", "triangle"][Math.floor(Math.random() * 3)], "dot", ["black", "gray", "white"][Math.floor(Math.random() * 3)])
    );
    const targetCount = 3 + Math.floor(Math.random() * 4); // 3-6
    for (let i = 0; i < cells.length; i++) {
      cells[i].outer = i < targetCount ? targetOuter : cells[i].outer;
    }
    const shuffledCells = shuffleList(cells);
    const answerNumber = shuffledCells.filter(c => c.outer === targetOuter).length;
    const options = shuffleList([answerNumber, answerNumber - 1, answerNumber + 1, answerNumber + 2].filter(n => n > 0)).slice(0, 4);
    return {
      gameId,
      title: `How many ${targetOuter}s do you see?`,
      mode: "count_shapes",
      cells: shuffledCells,
      options,
      answer: options.indexOf(answerNumber),
      points: 4,
    };
  }

  const seq = [
    kidCell("circle", "dot", "black"),
    kidCell("square", "dot", "gray"),
    kidCell("triangle", "dot", "white"),
    kidCell("circle", "dot", "black"),
  ];
  const options = shuffleList([
    seq[3],
    kidCell("triangle", "dot", "black"),
    kidCell("square", "dot", "black"),
    kidCell("circle", "square", "gray"),
  ]);
  return {
    gameId: "next_pattern",
    title: "What comes next?",
    mode: "next_pattern",
    sequence: seq.slice(0, 3),
    options,
    answer: options.findIndex(s => JSON.stringify(s) === JSON.stringify(seq[3])),
    points: 4,
  };
}

function SVGCell({ cell, size = 64 }) {
  if (!cell) return null;

  const c = size / 2;
  const dotLayouts = {
    center: [
      [0.5, 0.5], [0.35, 0.35], [0.65, 0.65], [0.35, 0.65], [0.65, 0.35], [0.5, 0.25],
    ],
    diagDown: [
      [0.32, 0.28], [0.46, 0.42], [0.60, 0.56], [0.74, 0.70], [0.28, 0.74], [0.72, 0.26],
    ],
    diagUp: [
      [0.30, 0.70], [0.44, 0.56], [0.58, 0.42], [0.72, 0.28], [0.28, 0.30], [0.72, 0.72],
    ],
    diamond: [
      [0.50, 0.24], [0.34, 0.42], [0.66, 0.42], [0.50, 0.60], [0.34, 0.78], [0.66, 0.78],
    ],
    vertical: [
      [0.50, 0.22], [0.50, 0.38], [0.50, 0.54], [0.50, 0.70], [0.34, 0.46], [0.66, 0.46],
    ],
    corners: [
      [0.30, 0.30], [0.70, 0.30], [0.30, 0.70], [0.70, 0.70], [0.50, 0.50], [0.50, 0.22],
    ],
  };

  if (cell.kind === "ladder") {
    const bg = "#f5f0e6";
    const stroke = "#27303f";
    const railStroke = Math.max(2, size * 0.055);
    const rungStroke = Math.max(1.6, size * 0.04);
    const rungs = Math.max(2, Math.min(7, cell.rungs || 3));
    const topY = size * 0.16;
    const bottomY = size * 0.84;
    const bottomHalf = size * 0.22;
    const taper = Math.max(0, Math.min(0.32, cell.taper || 0));
    const topHalf = bottomHalf * (1 - taper);
    const lean = (cell.lean || 0) * size;
    const topLeft = c - topHalf + lean;
    const topRight = c + topHalf + lean;
    const bottomLeft = c - bottomHalf - lean * 0.2;
    const bottomRight = c + bottomHalf - lean * 0.2;

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
        <rect width={size} height={size} rx="10" fill={bg} />
        <line x1={topLeft} y1={topY} x2={bottomLeft} y2={bottomY} stroke={stroke} strokeWidth={railStroke} strokeLinecap="round" />
        <line x1={topRight} y1={topY} x2={bottomRight} y2={bottomY} stroke={stroke} strokeWidth={railStroke} strokeLinecap="round" />
        {Array.from({ length: rungs }).map((_, idx) => {
          const t = (idx + 1) / (rungs + 1);
          const x1 = topLeft + (bottomLeft - topLeft) * t;
          const x2 = topRight + (bottomRight - topRight) * t;
          const y = topY + (bottomY - topY) * t;
          return (
            <line
              key={idx}
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke={stroke}
              strokeWidth={rungStroke}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    );
  }

  if (cell.kind === "dots") {
    const bg = "#3182d7";
    const points = (dotLayouts[cell.layout] || dotLayouts.diagDown).slice(0, Math.max(1, Math.min(6, cell.count || 1)));
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
        <rect width={size} height={size} rx="12" fill={bg} />
        {points.map(([px, py], idx) => (
          <circle
            key={idx}
            cx={px * size}
            cy={py * size}
            r={Math.max(2.4, size * 0.055)}
            fill="#ffffff"
          />
        ))}
      </svg>
    );
  }

  if (cell.kind === "window") {
    const bg = "#3182d7";
    const inner = size * 0.56;
    const pane = inner / 2 - size * 0.02;
    const start = (size - inner) / 2;
    const fills = [1, 2, 4, 8].map((bit) => Boolean((cell.mask || 0) & bit));
    const coords = [
      [start, start],
      [start + inner / 2 + size * 0.01, start],
      [start, start + inner / 2 + size * 0.01],
      [start + inner / 2 + size * 0.01, start + inner / 2 + size * 0.01],
    ];

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
        <rect width={size} height={size} rx="12" fill={bg} />
        {coords.map(([x, y], idx) => (
          <rect
            key={idx}
            x={x}
            y={y}
            width={pane}
            height={pane}
            rx={size * 0.02}
            fill={fills[idx] ? "#ffffff" : "transparent"}
            stroke="#ffffff"
            strokeWidth={Math.max(1.4, size * 0.03)}
          />
        ))}
      </svg>
    );
  }

  if (cell.kind === "splitCircle") {
    const bg = "#3182d7";
    const r = size * 0.22;
    const clipId = `clip-${size}-${cell.angle || 0}-${cell.invert ? 1 : 0}`;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
        <rect width={size} height={size} rx="12" fill={bg} />
        <defs>
          <clipPath id={clipId}>
            <circle cx={c} cy={c} r={r} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`} transform={`rotate(${cell.angle || 0} ${c} ${c})`}>
          <rect
            x={c - r - 2}
            y={cell.invert ? c : c - r - 2}
            width={r * 2 + 4}
            height={r + 4}
            fill="#ffffff"
          />
        </g>
        <circle cx={c} cy={c} r={r} fill="none" stroke="#ffffff" strokeWidth={Math.max(1.8, size * 0.035)} />
        <line
          x1={c - r}
          y1={c}
          x2={c + r}
          y2={c}
          transform={`rotate(${cell.angle || 0} ${c} ${c})`}
          stroke="#ffffff"
          strokeWidth={Math.max(1.6, size * 0.03)}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (cell.kind === "bars") {
    const bg = "#3182d7";
    const frameSize = size * 0.46;
    const start = (size - frameSize) / 2;
    const strokeWidth = Math.max(1.6, size * 0.03);
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
        <rect width={size} height={size} rx="12" fill={bg} />
        {cell.frame === "filled" ? (
          <rect x={start} y={start} width={frameSize} height={frameSize} fill="#ffffff" />
        ) : (
          <>
            <rect
              x={start}
              y={start}
              width={frameSize}
              height={frameSize}
              fill="transparent"
              stroke="#ffffff"
              strokeWidth={strokeWidth}
              strokeDasharray={cell.frame === "dashed" ? `${strokeWidth * 1.8} ${strokeWidth * 1.2}` : undefined}
            />
            {Array.from({ length: Math.max(1, cell.bars || 1) }).map((_, idx) => {
              const y = start + ((idx + 1) * frameSize) / (Math.max(1, cell.bars || 1) + 1);
              return (
                <line
                  key={idx}
                  x1={start + frameSize * 0.08}
                  y1={y}
                  x2={start + frameSize * 0.92}
                  y2={y}
                  stroke="#ffffff"
                  strokeWidth={strokeWidth * 0.8}
                  strokeLinecap="round"
                />
              );
            })}
          </>
        )}
      </svg>
    );
  }

  const {
    outer = "none",
    inner = "none",
    fill = "white",
    outerFill = "white",
    outerRotation = 0,
    innerRotation = 0,
    outerScale = 1,
    innerScale = 1,
  } = cell;

  const pad = size * 0.12;
  const outerSpan = (size - pad * 2) * outerScale;
  const innerSpan = size * 0.34 * innerScale;
  const stroke = "#262626";
  const bg = "#f5f0e6";

  const resolveFill = (tone, fallback = "#fff") => {
    if (tone === "black") return "#1a1a1a";
    if (tone === "gray") return "#b3b3b3";
    if (tone === "white") return "#ffffff";
    if (tone === "none") return "transparent";
    return fallback;
  };

  const drawShape = (shape, span, fillColor, rotation, strokeWidth) => {
    if (!shape || shape === "none") return null;

    const half = span / 2;
    let node = null;

    if (shape === "circle" || shape === "dot") {
      const radius = shape === "dot" ? half * 0.72 : half;
      node = (
        <circle
          cx={c}
          cy={c}
          r={radius}
          fill={fillColor}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    if (shape === "square") {
      node = (
        <rect
          x={c - half}
          y={c - half}
          width={span}
          height={span}
          fill={fillColor}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    if (shape === "triangle") {
      const points = [
        `${c},${c - half}`,
        `${c + half * 0.92},${c + half * 0.8}`,
        `${c - half * 0.92},${c + half * 0.8}`,
      ].join(" ");
      node = <polygon points={points} fill={fillColor} stroke={stroke} strokeWidth={strokeWidth} />;
    }

    if (!node) return null;
    return <g transform={`rotate(${rotation} ${c} ${c})`}>{node}</g>;
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <rect width={size} height={size} rx="8" fill={bg} />
      {drawShape(outer, outerSpan, resolveFill(outerFill), outerRotation, 1.7)}
      {drawShape(inner, innerSpan, resolveFill(fill, "#ffffff"), innerRotation, 1.15)}
    </svg>
  );
}

// 3Ã—3 grid â€” last cell is the "?" placeholder
function VisualGrid({ grid, cellSize = 70 }) {
  const gap = 4;
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(3, ${cellSize}px)`,
      gap: `${gap}px`,
      background: "#444",
      padding: 3,
      borderRadius: 8,
      margin: "0 auto",
      width: "fit-content",
    }}>
      {[...grid, null].map((cell, i) => (
        <div key={i} style={{ borderRadius: 3, overflow: "hidden" }}>
          {i === 8 ? (
            <div style={{
              width: cellSize, height: cellSize,
              background: "#f5f0e6",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: "#444" }}>?</span>
            </div>
          ) : (
            <SVGCell cell={cell} size={cellSize}/>
          )}
        </div>
      ))}
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  IQ SCORING
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  PDF HELPERS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

const NAVY  = [26, 16, 64];
const GOLD  = [184, 150, 62];
const BROWN = [107, 92, 62];
const MID   = [74, 63, 47];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  POSITION CONSTANTS (A4 landscape = 297 Ã— 210 mm)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  PDF GENERATOR
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function generateVectorPDF(name, iq, label, certID, date, catScores) {
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297, H = 210;

  const [bgData, signData] = await Promise.all([
    loadImageAsDataURL("/cert.png"),
    loadImageAsDataURL("/sign.png"),
  ]);
  if (bgData) pdf.addImage(bgData, "PNG", 0, 0, W, H);

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
  pdf.line(P.titleX - nw/2, P.nameY+3, P.titleX + nw/2, P.nameY+3);

  pdf.setFont("times", "normal");
  pdf.setFontSize(13);
  pdf.setTextColor(...MID);
  pdf.text("has successfully completed the NeuroMark Cognitive Assessment", P.titleX, P.completedY, { align: "center" });

  pdf.setFont("times", "bold");
  pdf.setFontSize(40);
  pdf.setTextColor(...GOLD);
  pdf.text(String(iq), P.boxCX, P.iqNumY, { align: "center" });

  pdf.setFontSize(13);
  pdf.setTextColor(...NAVY);
  pdf.text(label, P.boxCX, P.iqLabelY, { align: "center" });

  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.3);
  pdf.line(P.boxCX-24, P.divLine1Y, P.boxCX+24, P.divLine1Y);

  pdf.setFont("times", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...BROWN);
  pdf.text("IQ SCORE",                   P.boxCX, P.iqScoreLblY, { align: "center" });
  pdf.text("NeuroMark Assessment 2026",  P.boxCX, P.assessLblY,  { align: "center" });
  pdf.text("NeuroMark Certified - 2026", P.boxCX, P.certLblY,    { align: "center" });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(...NAVY);
  pdf.text("COGNITIVE PROFILE", P.profLblX, P.profLblY);

  const barMaxW = P.barEndX - P.barStartX;
  Object.keys(catScores).forEach((cat, i) => {
    const s   = catScores[cat];
    const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
    const y   = P.row1Y + i * P.rowGap;
    const shortName = cat.replace(" / ","/").replace("Reasoning","Rsng").replace("Recognition","Recog").replace("Numerical","Num").replace("Language","Lang").replace("Memory","Mem");

    pdf.setFont("times", "normal"); pdf.setFontSize(9); pdf.setTextColor(...MID);
    pdf.text(shortName, P.catX, y);
    pdf.setFont("times", "bold"); pdf.setFontSize(8.5); pdf.setTextColor(...NAVY);
    pdf.text(pct+"%", P.pctX, y, { align: "right" });
    pdf.setFillColor(232, 220, 195);
    pdf.rect(P.barStartX, y-3.5, barMaxW, P.barH, "F");
    const [r,g,b] = getCatBarColor(pct);
    pdf.setFillColor(r,g,b);
    const fillW = Math.max(1, (barMaxW*pct)/100);
    pdf.rect(P.barStartX, y-3.5, fillW, P.barH, "F");
    if (pct >= 15) {
      pdf.setFont("helvetica","bold"); pdf.setFontSize(7); pdf.setTextColor(255,255,255);
      pdf.text(pct+"%", P.barStartX+fillW-1, y-0.5, { align:"right" });
    }
  });

  pdf.setDrawColor(...MID); pdf.setLineWidth(0.3);
  pdf.line(P.sigLineX1, P.sigLineY, P.sigLineX2, P.sigLineY);

  if (signData) {
    const sigW=60, sigH=19;
    pdf.addImage(signData,"PNG", P.sigNameX-sigW/2, P.sigLineY-sigH+2, sigW, sigH);
  }

  pdf.setFont("times","normal"); pdf.setFontSize(10); pdf.setTextColor(...MID);
  pdf.text("Chief Assessment Officer", P.sigNameX, P.sigTitle1Y, { align:"center" });
  pdf.text("NeuroMark Institute",      P.sigNameX, P.sigTitle2Y, { align:"center" });

  pdf.setFont("times","bold"); pdf.setFontSize(9); pdf.setTextColor(...NAVY);
  pdf.text("Date: "+date, P.dateX, P.dateY, { align:"right" });
  pdf.setFont("times","normal");
  pdf.text("Certificate ID: "+certID, P.dateX, P.certIDY, { align:"right" });
  pdf.setFontSize(8); pdf.setTextColor(...BROWN);
  pdf.text("Verify at neuromark.institute", P.dateX, P.verifyY, { align:"right" });

  pdf.save(`IQ_Certificate_${name||"Candidate"}.pdf`);
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  MAIN COMPONENT
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function IQTest() {
  const [QUESTIONS,     setQUESTIONS]     = useState([]);

  const [screen,        setScreen]        = useState("intro");
  const [current,       setCurrent]       = useState(0);
  const [answers,       setAnswers]       = useState({});
  const [selected,      setSelected]      = useState(null);
  const [timeLeft,      setTimeLeft]      = useState(TOTAL_TIME);
  const [certName,      setCertName]      = useState("");
  const [certID]                          = useState(generateCertID);
  const [showPaywall,   setShowPaywall]   = useState(false);
  const [paid,          setPaid]          = useState(false);
  const [certGenerated, setCertGenerated] = useState(false);
  const [generating,    setGenerating]    = useState(false);
  const [payLoading,    setPayLoading]    = useState(false);
  const [paymentDebug,  setPaymentDebug]  = useState("");
  const [attemptToken,  setAttemptToken]  = useState("");
  const [resultsToken,  setResultsToken]  = useState("");
  const [resultData,    setResultData]    = useState(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [infoPage,      setInfoPage]      = useState({ title: "", description: "" });
  const [docPage,       setDocPage]       = useState({ title: "", items: [] });
  const [kidsGameId,    setKidsGameId]    = useState(null);
  const [kidsRound,     setKidsRound]     = useState(null);
  const [kidsSelected,  setKidsSelected]  = useState(null);
  const [kidsLastWin,   setKidsLastWin]   = useState(false);
  const [kidsProfile,   setKidsProfile]   = useState({ stars: 0, played: 0, correct: 0 });

  const timerRef  = useRef(null);
  const canvasRef = useRef(null);
  const answersRef = useRef({});

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const startAssessment = async () => {
    if (assessmentLoading) return;
    setAssessmentLoading(true);
    setPaymentDebug("");
    try {
      const { data } = await postApiJson(
        "/api/test/start",
        {},
        undefined,
        (payload) => {
          if (!Array.isArray(payload?.questions) || payload.questions.length === 0) {
            return "Invalid start response: questions missing.";
          }
          if (!payload?.attemptToken) {
            return "Invalid start response: attempt token missing.";
          }
          return "";
        }
      );

      setQUESTIONS(data.questions);
      setAttemptToken(data.attemptToken);
      setResultsToken("");
      setResultData(null);
      setCurrent(0);
      setAnswers({});
      setSelected(null);
      setTimeLeft(TOTAL_TIME);
      setPaid(false);
      setCertGenerated(false);
      setCertName("");
      setShowPaywall(false);
      setScreen("test");
    } catch (error) {
      const message = error?.message || "unknown error";
      const localHint = message.includes("localhost:8787")
        ? "\n\nFor local testing, start the backend with `npm run server` or use `npm run dev:local`."
        : "";
      alert(`Unable to start assessment. (${message})${localHint}`);
    } finally {
      setAssessmentLoading(false);
    }
  };

  const submitAssessment = async (finalAnswers, finalTimeUsed) => {
    if (!attemptToken) {
      alert("Assessment session is missing. Please restart the test.");
      handleRetake();
      return;
    }

    setAssessmentLoading(true);
    setPaymentDebug("");
    try {
      const { data } = await postApiJson(
        "/api/test/submit",
        {
          attemptToken,
          answers: finalAnswers,
          timeUsed: finalTimeUsed,
        },
        undefined,
        (payload) => {
          if (!payload?.resultsToken) return "Invalid submit response: results token missing.";
          if (!payload?.catScores) return "Invalid submit response: category scores missing.";
          return "";
        }
      );
      setResultData(data);
      setResultsToken(data.resultsToken);
      setScreen("result");
    } catch (error) {
      const message = error?.message || "unknown error";
      const localHint = message.includes("localhost:8787")
        ? "\n\nFor local testing, start the backend with `npm run server` or use `npm run dev:local`."
        : "";
      alert(`Unable to submit assessment. (${message})${localHint}`);
      handleRetake();
    } finally {
      setAssessmentLoading(false);
    }
  };

  useEffect(() => {
    if (screen === "test" && QUESTIONS.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            void submitAssessment(answersRef.current, TOTAL_TIME);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, QUESTIONS.length, attemptToken]);

  const handleNext = async () => {
    if (selected === null) return;
    const questionId = QUESTIONS[current]?.id;
    const na = { ...answers, [questionId]: selected };
    setAnswers(na); setSelected(null);
    if (current + 1 >= QUESTIONS.length) {
      clearInterval(timerRef.current);
      await submitAssessment(na, TOTAL_TIME - timeLeft);
    } else {
      setCurrent(c => c + 1);
    }
  };

  const formatTime = s =>
    `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const handleDownloadPDF = async () => {
    if (!resultData?.finalScore || !resultData?.finalLabel || !resultData?.catScores) {
      alert("Final results are locked until verified payment is completed.");
      return;
    }
    const date = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
    setGenerating(true);
    try {
      await generateVectorPDF(
        certName,
        resultData.finalScore,
        resultData.finalLabel,
        certID,
        date,
        resultData.catScores
      );
      setCertGenerated(true);
      if (window.gtag) window.gtag("event","certificate_downloaded",{event_category:"conversion"});
    } finally { setGenerating(false); }
  };

  const loadRazorpaySdk = () => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handleRazorpayPayment = async () => {
    if (!certName.trim() || payLoading) return;
    setPayLoading(true);
    setPaymentDebug("");
    try {
      const sdkLoaded = await loadRazorpaySdk();
      if (!sdkLoaded) {
        alert("Unable to load payment SDK. Please try again.");
        setPaymentDebug("Razorpay checkout SDK failed to load.");
        return;
      }

      const { data: orderData, base: activeApiBase } = await postApiJson(
        "/api/payment/create-order",
        { certName: certName.trim() },
        undefined,
        (data) => {
          if (!data?.orderId) return "Invalid create-order response: orderId missing.";
          if (!data?.keyId) return "Invalid create-order response: keyId missing.";
          if (!data?.amount) return "Invalid create-order response: amount missing.";
          return "";
        }
      );
      setPaymentDebug(`Payment API selected: ${activeApiBase || window.location.origin}`);

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "NeuroMark Institute",
        description: "IQ Certificate Payment",
        order_id: orderData.orderId,
        prefill: { name: certName.trim() },
        notes: { certificate_name: certName.trim() },
        theme: { color: "#2563eb" },
        handler: async (response) => {
          try {
            const { data: verifyData } = await postApiJson(
              "/api/payment/verify",
              {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                resultsToken,
              },
              activeApiBase,
              (data) => (data?.success ? "" : (data?.error || "Verification failed."))
            );
            if (!verifyData.success) {
              alert(verifyData.error || "Payment verification failed.");
              return;
            }
            if (!verifyData.results?.finalScore) {
              alert("Payment succeeded, but full results could not be unlocked.");
              return;
            }
            setResultData(verifyData.results);
            setPaid(true);
            setShowPaywall(false);
            alert("Payment verified. Certificate download is unlocked.");
          } catch (verifyError) {
            setPaymentDebug(`Verification error:\n${verifyError?.message || "unknown error"}`);
            alert(`Payment verification failed. (${verifyError?.message || "unknown error"})`);
          }
        },
        modal: {
          ondismiss: () => setPayLoading(false),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (e) {
      setPaymentDebug(`Init error:\n${e?.message || "unknown error"}`);
      alert(`Payment failed to start. Please try again. (${e?.message || "unknown error"})`);
    } finally {
      setPayLoading(false);
    }
  };

  const handleRetake = () => {
    setScreen("intro"); setCurrent(0); setAnswers({}); setSelected(null);
    setTimeLeft(TOTAL_TIME); setPaid(false); setCertGenerated(false); setCertName(""); setPaymentDebug("");
    setQUESTIONS([]); setAttemptToken(""); setResultsToken(""); setResultData(null); setShowPaywall(false);
    setAssessmentLoading(false); setPayLoading(false);
  };

  const openKidsZone = () => {
    setScreen("kids_home");
    setKidsGameId(null);
    setKidsRound(null);
    setKidsSelected(null);
  };

  const openInfoPage = (title, description) => {
    setInfoPage({ title, description });
    setScreen("info");
  };

  const openDocPage = (title, items) => {
    setDocPage({ title, items });
    setScreen("doc");
  };

  const handleLandingLink = (id) => {
    if (id === "tests") {
      void startAssessment();
      return;
    }
    if (id === "games") {
      openKidsZone();
      return;
    }

    const labelMap = {
      training: "Training",
      courses: "Courses",
      faq: "FAQ",
      contact: "Contact",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    };
    const title = labelMap[id] || "Coming Soon";
    if (id === "contact") {
      openInfoPage("Contact", "You can reach out to us for feedback, support, and general questions at brainrank182@gmail.com.");
      return;
    }
    if (id === "faq") {
      setScreen("faq");
      return;
    }
    if (id === "privacy") {
      openDocPage("Privacy Policy", PRIVACY_ITEMS);
      return;
    }
    if (id === "terms") {
      openDocPage("Terms of Service", TERMS_ITEMS);
      return;
    }
    openInfoPage(title, `${title} is coming soon. This section is added locally for preview routing.`);
  };

  const startKidsGame = (gameId) => {
    setKidsGameId(gameId);
    setKidsRound(makeKidsRound(gameId));
    setKidsSelected(null);
    setScreen("kids_game");
  };

  const submitKidsAnswer = () => {
    if (!kidsRound || kidsSelected === null) return;
    const won = kidsSelected === kidsRound.answer;
    setKidsLastWin(won);
    setKidsProfile(prev => ({
      stars: prev.stars + (won ? kidsRound.points : 1),
      played: prev.played + 1,
      correct: prev.correct + (won ? 1 : 0),
    }));
    setScreen("kids_result");
  };

  const playKidsAgain = () => {
    if (!kidsGameId) return;
    setKidsRound(makeKidsRound(kidsGameId));
    setKidsSelected(null);
    setScreen("kids_game");
  };

  const progress    = QUESTIONS.length ? (current / QUESTIONS.length) * 100 : 0;
  const timerUrgent = timeLeft < 120;
  const q           = QUESTIONS[current] || { options: [], question: "", type: "text", category: "" };

  const CAT_ICONS = {
    "Logical Reasoning":   "\u{1F517}",
    "Pattern Recognition": "\u{1F537}",
    "Math / Numerical":    "\u{1F4D0}",
    "Verbal / Language":   "\u{1F4DD}",
    "Spatial Reasoning":   "\u{1F9CA}",
    "Working Memory":      "\u{1F9E0}",
  };

  // â”€â”€ INTRO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (screen === "kids_home") return (
    <div style={S.kidsPage}>
      <div style={S.kidsCard}>
        <div style={S.kidsTopRow}>
          <button style={S.kidsBackBtn} onClick={() => setScreen("intro")}>Back to Main Test</button>
          <div style={S.kidsAgeTag}>Ages 4-8 years</div>
        </div>
        <h1 style={S.kidsTitle}>Kids Zone</h1>
        <p style={S.kidsSubtitle}>Play short learning games with shapes, patterns, and counting.</p>

        <div style={S.kidsStatRow}>
          <div style={S.kidsStatBox}><strong>{kidsProfile.stars}</strong><span>Stars</span></div>
          <div style={S.kidsStatBox}><strong>{kidsProfile.played}</strong><span>Games</span></div>
          <div style={S.kidsStatBox}><strong>{kidsProfile.played ? Math.round((kidsProfile.correct / kidsProfile.played) * 100) : 0}%</strong><span>Success</span></div>
        </div>

        <div style={S.kidsGameGrid}>
          {KIDS_GAMES.map(game => (
            <div key={game.id} style={S.kidsGameCard}>
              <h3 style={S.kidsGameTitle}>{game.title}</h3>
              <p style={S.kidsGameSub}>{game.subtitle}</p>
              <div style={S.kidsMeta}>{game.level} - {game.time}</div>
              <button style={S.kidsStartBtn} onClick={() => startKidsGame(game.id)}>Start Game</button>
            </div>
          ))}
        </div>

        <div style={S.kidsParentCard}>
          <div style={S.kidsParentTitle}>Parent Preview</div>
          <p style={S.kidsParentText}>Tracks stars earned, games played, and success rate. This starter dashboard can be expanded later.</p>
        </div>
      </div>
    </div>
  );

  if (screen === "kids_game" && kidsRound) return (
    <div style={S.kidsPage}>
      <div style={S.kidsCard}>
        <div style={S.kidsTopRow}>
          <button style={S.kidsBackBtn} onClick={() => setScreen("kids_home")}>Back to Kids Home</button>
          <div style={S.kidsAgeTag}>Mini Game</div>
        </div>

        <h2 style={S.kidsPromptTitle}>{kidsRound.title}</h2>

        {kidsRound.mode === "visual_options" && (
          <>
            <div style={S.kidsPromptVisual}><SVGCell cell={kidsRound.promptCell} size={88} /></div>
            <div style={S.kidsOptionGrid}>
              {kidsRound.options.map((opt, idx) => (
                <button key={idx} style={{ ...S.kidsOptionBtn, ...(kidsSelected === idx ? S.kidsOptionSelected : {}) }} onClick={() => setKidsSelected(idx)}>
                  <SVGCell cell={opt} size={72} />
                </button>
              ))}
            </div>
          </>
        )}

        {kidsRound.mode === "odd_one" && (
          <div style={S.kidsOptionGrid}>
            {kidsRound.cards.map((opt, idx) => (
              <button key={idx} style={{ ...S.kidsOptionBtn, ...(kidsSelected === idx ? S.kidsOptionSelected : {}) }} onClick={() => setKidsSelected(idx)}>
                <SVGCell cell={opt} size={72} />
              </button>
            ))}
          </div>
        )}

        {kidsRound.mode === "count_shapes" && (
          <>
            <div style={S.kidsCountGrid}>
              {kidsRound.cells.map((c, idx) => <SVGCell key={idx} cell={c} size={56} />)}
            </div>
            <div style={S.kidsNumberGrid}>
              {kidsRound.options.map((num, idx) => (
                <button key={idx} style={{ ...S.kidsNumBtn, ...(kidsSelected === idx ? S.kidsNumSelected : {}) }} onClick={() => setKidsSelected(idx)}>{num}</button>
              ))}
            </div>
          </>
        )}

        {kidsRound.mode === "next_pattern" && (
          <>
            <div style={S.kidsSequenceRow}>
              {kidsRound.sequence.map((c, idx) => <SVGCell key={idx} cell={c} size={66} />)}
              <div style={S.kidsQuestionMark}>?</div>
            </div>
            <div style={S.kidsOptionGrid}>
              {kidsRound.options.map((opt, idx) => (
                <button key={idx} style={{ ...S.kidsOptionBtn, ...(kidsSelected === idx ? S.kidsOptionSelected : {}) }} onClick={() => setKidsSelected(idx)}>
                  <SVGCell cell={opt} size={72} />
                </button>
              ))}
            </div>
          </>
        )}

        <button style={{ ...S.kidsStartBtn, opacity: kidsSelected === null ? 0.5 : 1 }} disabled={kidsSelected === null} onClick={submitKidsAnswer}>
          Check Answer
        </button>
      </div>
    </div>
  );

  if (screen === "kids_result") return (
    <div style={S.kidsPage}>
      <div style={S.kidsCard}>
        <h2 style={S.kidsPromptTitle}>{kidsLastWin ? "Great Job!" : "Nice Try!"}</h2>
        <p style={S.kidsSubtitle}>
          {kidsLastWin ? "You got it right and earned bonus stars." : "Keep practicing. You still earned a star for effort."}
        </p>
        <div style={S.kidsStatRow}>
          <div style={S.kidsStatBox}><strong>{kidsProfile.stars}</strong><span>Total Stars</span></div>
          <div style={S.kidsStatBox}><strong>{kidsProfile.played}</strong><span>Games Played</span></div>
          <div style={S.kidsStatBox}><strong>{kidsProfile.correct}</strong><span>Correct</span></div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={S.kidsStartBtn} onClick={playKidsAgain}>Play Again</button>
          <button style={S.kidsBackBtn} onClick={() => setScreen("kids_home")}>Choose Another Game</button>
        </div>
      </div>
    </div>
  );

  if (screen === "info") return (
    <div style={S.page}>
      <div style={S.infoPageCard}>
        <h2 style={S.infoPageTitle}>{infoPage.title}</h2>
        <p style={S.infoPageText}>{infoPage.description}</p>
        <div style={S.infoPageActions}>
          <button style={S.startBtn} onClick={() => setScreen("intro")}>Back to Home</button>
          <button style={S.kidsEntryBtn} onClick={() => setScreen("test")}>Go to IQ Test</button>
        </div>
      </div>
    </div>
  );

  if (screen === "faq") return (
    <div style={S.page}>
      <div style={S.infoPageCard}>
        <div style={S.badge}>HELP</div>
        <h2 style={S.infoPageTitle}>Frequently Asked Questions</h2>
        <div style={S.faqList}>
          {FAQ_ITEMS.map((item, index) => (
            <div key={item.question} style={S.faqItem}>
              <div style={S.faqQuestion}>{index + 1}. {item.question}</div>
              <div style={S.faqAnswer}>{item.answer}</div>
            </div>
          ))}
        </div>
        <div style={S.infoPageActions}>
          <button style={S.startBtn} onClick={() => setScreen("intro")}>Back to Home</button>
          <button style={S.kidsEntryBtn} onClick={() => setScreen("test")}>Go to IQ Test</button>
        </div>
      </div>
    </div>
  );

  if (screen === "doc") return (
    <div style={S.page}>
      <div style={S.infoPageCard}>
        <div style={S.badge}>INFO</div>
        <h2 style={S.infoPageTitle}>{docPage.title}</h2>
        <div style={S.docList}>
          {docPage.items.map((item) => (
            <div key={item.title} style={S.docItem}>
              <div style={S.docTitle}>{item.title}</div>
              <div style={S.docBody}>{item.body}</div>
            </div>
          ))}
        </div>
        <div style={S.infoPageActions}>
          <button style={S.startBtn} onClick={() => setScreen("intro")}>Back to Home</button>
          <button style={S.kidsEntryBtn} onClick={() => setScreen("test")}>Go to IQ Test</button>
        </div>
      </div>
    </div>
  );

  if (screen === "intro") return (
    <div style={S.page}>
      <div style={S.card}>
        <style>{`
          @keyframes landingTickerMove {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <div style={S.badge}>COGNITIVE ASSESSMENT</div>
        <h1 style={S.title}>IQ<span style={{color:"#a78bfa"}}>Test</span></h1>
        <p style={S.subtitle}>A scientifically-inspired assessment across 6 cognitive dimensions</p>
        <div style={S.categoryGrid}>
          {Object.entries(CAT_ICONS).map(([name,icon]) => (
            <div key={name} style={S.catChip}><span>{icon}</span> {name}</div>
          ))}
        </div>
        <div style={S.infoRow}>
          <div style={S.infoBox}><span style={S.infoNum}>20</span><span style={S.infoLabel}>Questions</span></div>
          <div style={S.infoBox}><span style={S.infoNum}>20</span><span style={S.infoLabel}>Minutes</span></div>
          <div style={S.infoBox}><span style={S.infoNum}>145</span><span style={S.infoLabel}>Max IQ</span></div>
        </div>
        <div style={S.certPreview}>
          {"\u{1F393}"} <strong style={{color:"#fbbf24"}}>Official PDF Certificate</strong> {"\u2014"} Download your verified IQ certificate for {CERT_PRICE}
        </div>
        <div style={S.entryActions}>
          <button style={{...S.startBtn, opacity: assessmentLoading ? 0.75 : 1}} onClick={startAssessment} disabled={assessmentLoading}>
            {assessmentLoading ? "Preparing Assessment..." : "Begin Assessment"}
          </button>
          <button style={S.kidsEntryBtn} onClick={openKidsZone}>Open Kids Zone (4-8 years)</button>
        </div>
        <div style={S.activitySection}>
          <div style={S.activityHeader}>
            <span style={S.activityBadge}>Assessment Feed</span>
          </div>
          <div style={S.activityViewport}>
            <div style={S.activityTrack}>
              {[...ACTIVITY_FEED, ...ACTIVITY_FEED].map((item, idx) => (
                <div key={`${item.name}-${idx}`} style={S.activityPill}>
                  <strong style={S.activityName}>{item.name}</strong>
                  <span>{`from ${item.city} scored IQ ${item.score}`}</span>
                  <span style={S.activityTime}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={S.linkSections}>
          <div style={S.linkPanel}>
            <div style={S.linkPanelTitle}>Product</div>
            {LANDING_LINKS.product.map((item) => (
              <button key={item.id} style={S.linkButton} onClick={() => handleLandingLink(item.id)}>
                <span>{item.label}</span>
                <span style={S.linkHint}>{item.hint}</span>
              </button>
            ))}
          </div>
          <div style={S.linkPanel}>
            <div style={S.linkPanelTitle}>Support</div>
            {LANDING_LINKS.support.map((item) => (
              <button key={item.id} style={S.linkButton} onClick={() => handleLandingLink(item.id)}>
                <span>{item.label}</span>
                <span style={S.linkHint}>{item.hint}</span>
              </button>
            ))}
          </div>
        </div>
        <p style={S.disclaimer}>Issued by {AUTHORITY}</p>
      </div>
    </div>
  );

  // â”€â”€ TEST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (screen === "test") return (
    <div style={S.page}>
      <div style={S.testCard}>
        <div style={S.testHeader}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={S.qCounter}>{current+1} / {QUESTIONS.length}</span>
            <span style={S.catTag}>{CAT_ICONS[q.category]||"\u{1F9E9}"} {q.category}</span>
          </div>
          <div style={{...S.timer,color:timerUrgent?"#f87171":"#a78bfa",borderColor:timerUrgent?"#f87171":"#a78bfa"}}>
            {"\u23F1"} {formatTime(timeLeft)}
          </div>
        </div>

        <div style={S.progressBg}><div style={{...S.progressFill,width:`${progress}%`}}/></div>

        {/* â”€â”€ Question display â”€â”€ */}
        <div style={S.questionBox}>
          <p style={{...S.questionText, marginBottom: q.type==="visual"?16:0}}>
            {q.question}
          </p>
          {q.type === "visual" && (
            <div style={{display:"flex",justifyContent:"center"}}>
              <VisualGrid grid={q.grid} cellSize={68}/>
            </div>
          )}
        </div>

        {/* â”€â”€ Options â”€â”€ */}
        {q.type === "visual" ? (
          <div
            style={{
              ...S.visualGrid,
              gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
            }}>
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                style={{...S.visualOptionBtn,...(selected===idx?S.visualSelected:{})}}
                onClick={()=>setSelected(idx)}>
                <span style={S.optionLetter}>{OPTION_LABELS[idx]}</span>
                <SVGCell cell={opt} size={62}/>
              </button>
            ))}
          </div>
        ) : (
          <div style={S.optionsGrid}>
            {q.options.map((opt,idx) => (
              <button key={idx}
                style={{...S.optionBtn,...(selected===idx?S.optionSelected:{})}}
                onClick={()=>setSelected(idx)}>
                <span style={S.optionLetter}>{OPTION_LABELS[idx]}</span>{opt}
              </button>
            ))}
          </div>
        )}

        <div style={{display:"flex",gap:12,marginTop:8}}>
          {current > 0 && (
            <button style={S.skipBtn}
              onClick={()=>{
                const previousIndex = current - 1;
                const previousQuestionId = QUESTIONS[previousIndex]?.id;
                setCurrent(previousIndex);
                setSelected(previousQuestionId ? (answers[previousQuestionId] ?? null) : null);
              }}>
              {"\u2190"} Back
            </button>
          )}
          <button
            style={{...S.nextBtn,opacity:selected===null || assessmentLoading ? 0.4 : 1,flex:1}}
            disabled={selected===null || assessmentLoading}
            onClick={handleNext}>
            {assessmentLoading ? "Submitting..." : (current+1===QUESTIONS.length?"Submit Test \u2713":"Next Question \u2192")}
          </button>
        </div>
      </div>
    </div>
  );

  // â”€â”€ RESULT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (screen === "result") {
    if (!resultData) {
      return (
        <div style={S.page}>
          <div style={S.resultCard}>
            <div style={S.badge}>ASSESSMENT OVERVIEW</div>
            <div style={S.teaserTitle}>Finalizing your assessment...</div>
            <p style={S.teaserSubtitle}>We are processing your performance profile securely.</p>
          </div>
        </div>
      );
    }

    const {correct,total,catScores,timeUsed} = resultData;
    const paymentStatus = paid ? "paid" : "unpaid";
    const iq = paymentStatus === "paid" ? resultData.finalScore : null;
    const label = paymentStatus === "paid" ? resultData.finalLabel : "";
    const color   = iq !== null ? getIQLabelColor(iq) : "#a78bfa";
    const mins    = Math.floor(timeUsed/60), secs = timeUsed%60;
    const percentileBand = resultData.percentileBand;
    const strongestCategory = resultData.strongestCategory;
    const completionPercent = paymentStatus === "paid" ? 100 : 99;

    return (
      <div style={S.page}>
        <div style={S.resultCard}>
          <div style={S.badge}>{paymentStatus === "paid" ? "FULL RESULTS" : "ASSESSMENT OVERVIEW"}</div>

          {paymentStatus === "paid" ? (
            <>
              <div style={S.iqRing}>
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="68" fill="none" stroke="#1e1b4b" strokeWidth="12"/>
                  <circle cx="80" cy="80" r="68" fill="none" stroke={color} strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(iq/145)*427} 427`}
                    transform="rotate(-90 80 80)"/>
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
            </>
          ) : (
            <>
              <div style={S.teaserHeader}>
                <div style={S.teaserTitleBlock}>
                <div style={S.teaserTitle}>Performance Profile</div>
                <div style={S.teaserSubtitle}>Your assessment is complete. Unlock your exact score, full interpretation, and certificate.</div>
                </div>
                <div style={S.teaserBand}>{percentileBand}</div>
              </div>

              <div style={S.unlockProgressCard}>
                <div style={S.unlockProgressTop}>
                  <span>Complete your profile to unlock</span>
                  <strong>{completionPercent}%</strong>
                </div>
                <div style={S.unlockProgressBg}>
                  <div style={{...S.unlockProgressFill,width:`${completionPercent}%`}} />
                </div>
              </div>

              <div style={S.teaserStatsRow}>
                <div style={S.teaserStatBox}>
                  <span style={S.teaserStatLabel}>Strongest Area</span>
                  <strong style={S.teaserStatValue}>{strongestCategory ? strongestCategory.category : "In Progress"}</strong>
                </div>
                <div style={S.teaserStatBox}>
                  <span style={S.teaserStatLabel}>Profile Accuracy</span>
                  <strong style={S.teaserStatValue}>{total ? Math.round((correct/total)*100) : 0}%</strong>
                </div>
                <div style={S.teaserStatBox}>
                  <span style={S.teaserStatLabel}>Time Used</span>
                  <strong style={S.teaserStatValue}>{mins}m {secs}s</strong>
                </div>
              </div>
            </>
          )}

          <div style={S.breakdownTitle}>{paymentStatus === "paid" ? "Category Breakdown" : "Performance Profile"}</div>
          {ALL_CATEGORIES.map(cat => {
            const s=catScores[cat]; if(!s) return null;
            const pct=s.total>0?Math.round((s.correct/s.total)*100):0;
            return (
              <div key={cat} style={S.catRow}>
                <div style={S.catRowLeft}><span>{CAT_ICONS[cat]}</span><span style={S.catRowName}>{cat}</span></div>
                <div style={S.catBarBg}><div style={{...S.catBarFill,width:`${pct}%`,background:pct>=75?"#34d399":pct>=50?"#fbbf24":"#f87171"}}/></div>
                <span style={S.catPct}>{pct}%</span>
              </div>
            );
          })}

          {paymentStatus !== "paid" ? (
            <div style={S.teaserGrid}>
              <div style={S.lockedScoreCard}>
                <div style={S.lockedHeader}>
                  <span>Final Score</span>
                  <span style={S.lockedPill}>Locked</span>
                </div>
                <div style={S.lockedScoreBlur}>###</div>
                <div style={S.lockedMeta}>Unlock your official percentile, score band, and detailed interpretation.</div>
              </div>

              <div style={S.certificateTeaserCard}>
                <div style={S.lockedHeader}>
                  <span>Certificate Preview</span>
                  <span style={S.lockedPill}>Locked</span>
                </div>
                <div style={S.certificateTeaserFrame}>
                  <div style={S.certificateTeaserName}>{certName.trim() || "Your Name Here"}</div>
                  <div style={S.certificateTeaserBlur}>Score and seal unlock after payment</div>
                  <div style={S.certificateTeaserFooter}>Verifiable PDF certificate</div>
                </div>
              </div>

              <div style={S.ctaCard}>
                <div style={S.ctaEyebrow}>Official unlock</div>
                <div style={S.ctaTitle}>Claim Your Official Certification</div>
                <div style={S.ctaText}>You&apos;ve completed the assessment. Pay just {CERT_PRICE} to unlock your final score, detailed feedback, and download your verifiable PDF certificate.</div>
                <input
                  style={S.nameInput}
                  placeholder="Enter your full name for the certificate"
                  value={certName}
                  onChange={e=>setCertName(e.target.value)}
                  maxLength={40}
                />
                <button style={S.certBtn} onClick={()=>{if(certName.trim()){setPaymentDebug("");setShowPaywall(true);}}}>
                  Unlock Full Results ({CERT_PRICE})
                </button>
                {!certName.trim()&&<p style={{color:"#64748b",fontSize:11,margin:"6px 0 0",textAlign:"center"}}>Enter your name above to continue</p>}
              </div>
            </div>
          ) : (
            <div style={S.certSection}>
              <div style={S.certHeader}>
                <span style={{fontSize:28}}>{"\u{1F393}"}</span>
                <div>
                  <div style={S.certTitle}>Official PDF Certificate</div>
                  <div style={S.certSubtitle}>Vector quality {"\u00B7"} Never blurs when zoomed</div>
                </div>
                <div style={S.certPrice}>{CERT_PRICE}</div>
              </div>
              <div style={S.certFeatures}>
                {["NeuroMark design","Name & IQ score","Cognitive profile bars","Instant PDF"].map(f=>(
                  <div key={f} style={S.certFeature}><span style={{color:"#fbbf24"}}>{"\u2713"}</span> {f}</div>
                ))}
              </div>
              <div style={{textAlign:"center"}}>
                <button style={{...S.certBtn,background:"linear-gradient(135deg,#059669,#34d399)",opacity:generating?0.7:1}}
                  onClick={handleDownloadPDF} disabled={generating}>
                  {generating?"\u23F3 Generating...":"\u{1F4C4} Download PDF Certificate"}
                </button>
                {certGenerated&&<p style={{color:"#34d399",fontSize:12,marginTop:8}}>{"\u2705"} Certificate downloaded! {"\u{1F389}"}</p>}
              </div>
            </div>
          )}

          {showPaywall&&(
            <div style={S.modal}>
              <div style={S.modalCard}>
                <div style={{fontSize:40,textAlign:"center",marginBottom:12}}>{"\u{1F3C6}"}</div>
                <div style={S.modalTitle}>Claim Your Official Certification</div>
                <div style={S.modalName}>{certName}</div>
                <div style={S.modalPrice}>{CERT_PRICE} only</div>
                <p style={{color:"#94a3b8",fontSize:12,textAlign:"center",margin:"0 0 8px"}}>Pay just {CERT_PRICE} to unlock your final score, detailed feedback, and downloadable PDF certificate.</p>
                <p style={{textAlign:"center",color:"#34d399",fontSize:12,marginBottom:16}}>{percentileBand} {"\u00B7"} Full profile ready to unlock</p>
                <button style={{...S.payBtn,opacity:payLoading?0.7:1}} onClick={handleRazorpayPayment} disabled={payLoading}>
                  {payLoading ? "Starting secure payment..." : `Unlock Full Results (${CERT_PRICE})`}
                </button>
                <button style={S.cancelBtn} onClick={()=>{setPaymentDebug("");setShowPaywall(false);}}>Cancel</button>
                <p style={{color:"#94a3b8",fontSize:11,textAlign:"center",marginTop:8}}>Certificate unlock requires successful verified payment.</p>
                <p style={{color:"#475569",fontSize:10,textAlign:"center",marginTop:4}}>{"\u{1F512}"} Secure payment</p>
                {!!paymentDebug && (
                  <pre style={S.paymentDebugBox}>{paymentDebug}</pre>
                )}
              </div>
            </div>
          )}

          <button style={{...S.startBtn,marginTop:16}} onClick={handleRetake}>
            Retake Test {"\u21BA"}
          </button>
        </div>
        <canvas ref={canvasRef} style={{display:"none"}}/>
      </div>
    );
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  STYLES
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const S = {
  page:           { minHeight:"100vh", background:"linear-gradient(135deg,#0f0c29 0%,#1a1040 50%,#0f0c29 100%)", display:"flex", justifyContent:"center", alignItems:"flex-start", padding:"32px 16px", fontFamily:"'Georgia',serif" },
  card:           { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:24, padding:"40px 32px", maxWidth:540, width:"100%", textAlign:"center", backdropFilter:"blur(20px)", boxShadow:"0 0 80px rgba(167,139,250,0.1)" },
  infoPageCard:   { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:24, padding:"40px 32px", maxWidth:640, width:"100%", textAlign:"center", backdropFilter:"blur(20px)", boxShadow:"0 0 80px rgba(167,139,250,0.1)" },
  badge:          { display:"inline-block", background:"rgba(167,139,250,0.15)", color:"#a78bfa", border:"1px solid rgba(167,139,250,0.4)", borderRadius:100, padding:"4px 14px", fontSize:10, letterSpacing:2.4, fontFamily:"monospace", marginBottom:18 },
  title:          { fontSize:"clamp(40px,8vw,52px)", fontWeight:900, color:"#f1f5f9", margin:"0 0 10px", letterSpacing:-1.4, lineHeight:0.98 },
  infoPageTitle:  { fontSize:"clamp(30px,6vw,38px)", fontWeight:900, color:"#f1f5f9", margin:"0 0 12px", lineHeight:1.05 },
  infoPageText:   { color:"#cbd5e1", fontSize:15, lineHeight:1.65, margin:"0 0 14px" },
  infoPageActions:{ display:"grid", gap:10 },
  faqList:        { display:"grid", gap:10, marginBottom:18, textAlign:"left" },
  faqItem:        { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"14px 16px" },
  faqQuestion:    { color:"#f8fafc", fontSize:14, fontWeight:700, marginBottom:6 },
  faqAnswer:      { color:"#cbd5e1", fontSize:13, lineHeight:1.6 },
  docList:        { display:"grid", gap:10, marginBottom:18, textAlign:"left" },
  docItem:        { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"14px 16px" },
  docTitle:       { color:"#f8fafc", fontSize:14, fontWeight:700, marginBottom:6 },
  docBody:        { color:"#cbd5e1", fontSize:13, lineHeight:1.6 },
  subtitle:       { color:"#94a3b8", fontSize:14, marginBottom:28, lineHeight:1.65, maxWidth:420, marginInline:"auto" },
  categoryGrid:   { display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:32 },
  catChip:        { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:100, padding:"6px 14px", fontSize:12, color:"#cbd5e1", display:"flex", alignItems:"center", gap:6 },
  infoRow:        { display:"flex", gap:12, justifyContent:"center", marginBottom:22 },
  infoBox:        { display:"flex", flexDirection:"column", alignItems:"center", background:"rgba(167,139,250,0.08)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:16, padding:"14px 22px" },
  infoNum:        { fontSize:24, fontWeight:900, color:"#a78bfa", lineHeight:1 },
  infoLabel:      { fontSize:10, color:"#64748b", letterSpacing:1, marginTop:4, fontFamily:"monospace" },
  certPreview:    { background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.3)", borderRadius:12, padding:"11px 14px", fontSize:12.5, color:"#cbd5e1", marginBottom:22, lineHeight:1.55 },
  startBtn:       { width:"100%", padding:"15px", background:"linear-gradient(135deg,#7c3aed,#a78bfa)", color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", letterSpacing:0.3, boxShadow:"0 8px 32px rgba(124,58,237,0.4)" },
  entryActions:   { display:"grid", gap:10 },
  activitySection:{ marginTop:18, marginBottom:18, textAlign:"left" },
  activityHeader: { display:"flex", justifyContent:"flex-start", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap" },
  activityBadge:  { display:"inline-flex", alignItems:"center", background:"rgba(16,185,129,0.12)", color:"#86efac", border:"1px solid rgba(110,231,183,0.26)", borderRadius:999, padding:"4px 10px", fontSize:9.5, letterSpacing:1, fontFamily:"monospace", textTransform:"uppercase" },
  activityViewport:{ overflow:"hidden", borderRadius:14, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(15,23,42,0.5)", padding:"12px 0" },
  activityTrack:  { display:"flex", width:"max-content", animation:"landingTickerMove 34s linear infinite" },
  activityPill:   { display:"inline-flex", alignItems:"center", gap:10, whiteSpace:"nowrap", padding:"0 18px", color:"#dbeafe", fontSize:12.5 },
  activityName:   { color:"#f8fafc", fontWeight:700 },
  activityTime:   { color:"#6ee7b7", fontSize:11, fontFamily:"monospace" },
  linkSections:   { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14, marginTop:8, marginBottom:4 },
  linkPanel:      { textAlign:"left", background:"rgba(255,255,255,0.035)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:"14px 14px" },
  linkPanelTitle: { color:"#cbd5e1", fontSize:13, fontWeight:700, marginBottom:7 },
  linkButton:     { width:"100%", background:"transparent", border:"none", borderBottom:"1px solid rgba(255,255,255,0.05)", color:"#cbd5e1", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", cursor:"pointer", fontSize:11.5, textAlign:"left" },
  linkHint:       { color:"#64748b", fontSize:9.5, fontFamily:"monospace", marginLeft:10 },
  kidsEntryBtn:   { width:"100%", padding:"14px", background:"linear-gradient(135deg,#ff9f1c,#ffbf69)", color:"#3a1f00", border:"none", borderRadius:14, fontSize:14, fontWeight:800, cursor:"pointer", letterSpacing:0.2, boxShadow:"0 8px 24px rgba(255,159,28,0.35)" },
  disclaimer:     { color:"#475569", fontSize:11, marginTop:16, fontFamily:"monospace" },
  kidsPage:       { minHeight:"100vh", background:"linear-gradient(160deg,#fff7ed 0%,#fffbeb 50%,#ecfeff 100%)", display:"flex", justifyContent:"center", alignItems:"flex-start", padding:"28px 14px", fontFamily:"'Trebuchet MS','Verdana',sans-serif" },
  kidsCard:       { width:"100%", maxWidth:760, background:"#ffffff", border:"2px solid #fed7aa", borderRadius:24, padding:"26px 22px", boxShadow:"0 16px 40px rgba(251,146,60,0.18)" },
  kidsTopRow:     { display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:12 },
  kidsBackBtn:    { padding:"10px 14px", background:"#ffffff", color:"#7c2d12", border:"1px solid #fdba74", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer" },
  kidsAgeTag:     { padding:"6px 12px", background:"#fff7ed", color:"#b45309", border:"1px solid #fdba74", borderRadius:999, fontSize:12, fontWeight:800, letterSpacing:0.4 },
  kidsTitle:      { margin:"0 0 6px", color:"#1f2937", fontSize:40, lineHeight:1.05, fontWeight:900 },
  kidsSubtitle:   { margin:"0 0 16px", color:"#4b5563", fontSize:15, lineHeight:1.5 },
  kidsStatRow:    { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:10, marginBottom:16 },
  kidsStatBox:    { background:"#fef3c7", border:"1px solid #fcd34d", borderRadius:14, padding:"12px 10px", textAlign:"center", display:"flex", flexDirection:"column", gap:4, color:"#78350f", fontSize:12 },
  kidsGameGrid:   { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:10, marginBottom:14 },
  kidsGameCard:   { background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:14, padding:"12px 10px", display:"flex", flexDirection:"column", gap:6 },
  kidsGameTitle:  { margin:0, color:"#1e3a8a", fontSize:17, fontWeight:900 },
  kidsGameSub:    { margin:0, color:"#334155", fontSize:12 },
  kidsMeta:       { color:"#475569", fontSize:11, fontWeight:700 },
  kidsStartBtn:   { padding:"12px 14px", background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", border:"none", borderRadius:12, fontSize:14, fontWeight:800, cursor:"pointer", boxShadow:"0 8px 20px rgba(22,163,74,0.25)" },
  kidsParentCard: { background:"#f0fdf4", border:"1px solid #86efac", borderRadius:14, padding:"12px 14px" },
  kidsParentTitle:{ color:"#166534", fontSize:14, fontWeight:900, marginBottom:4 },
  kidsParentText: { color:"#14532d", fontSize:12, margin:0, lineHeight:1.5 },
  kidsPromptTitle:{ margin:"2px 0 12px", color:"#111827", fontSize:28, fontWeight:900 },
  kidsPromptVisual:{ display:"flex", justifyContent:"center", marginBottom:12 },
  kidsOptionGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(95px,1fr))", gap:10, marginBottom:14 },
  kidsOptionBtn:  { background:"#fffbeb", border:"2px solid #fde68a", borderRadius:14, padding:"8px", display:"flex", justifyContent:"center", alignItems:"center", cursor:"pointer", minHeight:88 },
  kidsOptionSelected:{ border:"2px solid #22c55e", background:"#ecfdf5" },
  kidsCountGrid:  { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, justifyItems:"center", marginBottom:12 },
  kidsNumberGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:14 },
  kidsNumBtn:     { background:"#ffffff", border:"2px solid #cbd5e1", borderRadius:10, padding:"10px 0", fontSize:20, fontWeight:900, color:"#0f172a", cursor:"pointer" },
  kidsNumSelected:{ border:"2px solid #22c55e", background:"#ecfdf5" },
  kidsSequenceRow:{ display:"flex", justifyContent:"center", alignItems:"center", gap:8, marginBottom:12, flexWrap:"wrap" },
  kidsQuestionMark:{ width:66, height:66, borderRadius:12, border:"2px dashed #f59e0b", display:"flex", alignItems:"center", justifyContent:"center", color:"#b45309", fontSize:28, fontWeight:900, background:"#fff7ed" },
  testCard:       { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:24, padding:"36px 32px", maxWidth:600, width:"100%", backdropFilter:"blur(20px)" },
  testHeader:     { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 },
  qCounter:       { color:"#94a3b8", fontSize:13, fontFamily:"monospace" },
  catTag:         { background:"rgba(167,139,250,0.12)", color:"#a78bfa", borderRadius:100, padding:"3px 12px", fontSize:12, border:"1px solid rgba(167,139,250,0.3)" },
  timer:          { fontFamily:"monospace", fontSize:15, fontWeight:700, border:"1px solid", borderRadius:8, padding:"4px 12px" },
  progressBg:     { height:4, background:"rgba(255,255,255,0.08)", borderRadius:100, marginBottom:28, overflow:"hidden" },
  progressFill:   { height:"100%", background:"linear-gradient(90deg,#7c3aed,#a78bfa)", borderRadius:100, transition:"width 0.4s ease" },
  questionBox:    { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"24px", marginBottom:20 },
  questionText:   { color:"#e2e8f0", fontSize:16, lineHeight:1.7, margin:0, fontWeight:500, textAlign:"center" },
  optionsGrid:    { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 },
  optionBtn:      { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"14px 16px", color:"#cbd5e1", fontSize:14, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:10, fontFamily:"'Georgia',serif" },
  optionSelected: { background:"rgba(167,139,250,0.15)", border:"1px solid rgba(167,139,250,0.6)", color:"#f1f5f9" },
  optionLetter:   { background:"rgba(167,139,250,0.2)", color:"#a78bfa", borderRadius:6, width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0, fontFamily:"monospace" },
  // Visual question option styles
  visualGrid:     { display:"grid", gap:10, marginBottom:16 },
  visualOptionBtn:{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"10px 12px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"flex-start", gap:10, minHeight:86 },
  visualSelected: { background:"rgba(167,139,250,0.15)", border:"1px solid rgba(167,139,250,0.6)" },
  nextBtn:        { padding:"14px", background:"linear-gradient(135deg,#7c3aed,#a78bfa)", color:"#fff", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer" },
  skipBtn:        { padding:"14px 20px", background:"rgba(255,255,255,0.06)", color:"#94a3b8", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, fontSize:14, cursor:"pointer", fontFamily:"'Georgia',serif" },
  resultCard:     { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:24, padding:"40px 36px", maxWidth:580, width:"100%", backdropFilter:"blur(20px)", textAlign:"center" },
  teaserHeader:   { display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, marginBottom:18, textAlign:"left", flexWrap:"wrap" },
  teaserTitleBlock:{ flex:1, minWidth:220 },
  teaserTitle:    { color:"#f8fafc", fontSize:28, fontWeight:800, lineHeight:1.05, marginBottom:6 },
  teaserSubtitle: { color:"#94a3b8", fontSize:14, lineHeight:1.6 },
  teaserBand:     { background:"rgba(16,185,129,0.12)", color:"#6ee7b7", border:"1px solid rgba(110,231,183,0.3)", borderRadius:999, padding:"8px 14px", fontSize:12, fontWeight:700, whiteSpace:"nowrap" },
  unlockProgressCard:{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:"14px 16px", marginBottom:18, textAlign:"left" },
  unlockProgressTop:{ display:"flex", justifyContent:"space-between", alignItems:"center", color:"#e2e8f0", fontSize:13, marginBottom:8 },
  unlockProgressBg:{ height:10, background:"rgba(255,255,255,0.08)", borderRadius:999, overflow:"hidden" },
  unlockProgressFill:{ height:"100%", background:"linear-gradient(90deg,#7c3aed,#fbbf24)", borderRadius:999 },
  teaserStatsRow: { display:"grid", gridTemplateColumns:"repeat(3, minmax(0,1fr))", gap:10, marginBottom:22 },
  teaserStatBox:  { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"14px 12px", textAlign:"left" },
  teaserStatLabel:{ color:"#64748b", fontSize:10, letterSpacing:1, fontFamily:"monospace", display:"block", marginBottom:6, textTransform:"uppercase" },
  teaserStatValue:{ color:"#f8fafc", fontSize:15, lineHeight:1.4 },
  iqRing:         { position:"relative", width:160, height:160, margin:"24px auto 16px" },
  iqInner:        { position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)" },
  iqNumber:       { fontSize:40, fontWeight:900, lineHeight:1 },
  iqLabel:        { color:"#64748b", fontSize:11, fontFamily:"monospace", letterSpacing:1 },
  levelBadge:     { display:"inline-block", borderRadius:100, padding:"6px 20px", fontSize:13, fontWeight:700, letterSpacing:0.5, marginBottom:24 },
  statsRow:       { display:"flex", gap:12, justifyContent:"center", marginBottom:28 },
  statBox:        { display:"flex", flexDirection:"column", alignItems:"center", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"14px 20px", flex:1 },
  statNum:        { fontSize:22, fontWeight:800, color:"#f1f5f9" },
  statLabel:      { fontSize:10, color:"#64748b", fontFamily:"monospace", letterSpacing:1, marginTop:2 },
  breakdownTitle: { color:"#94a3b8", fontSize:11, letterSpacing:2, fontFamily:"monospace", textAlign:"left", marginBottom:12 },
  catRow:         { display:"flex", alignItems:"center", gap:10, marginBottom:10 },
  catRowLeft:     { display:"flex", alignItems:"center", gap:6, width:160, textAlign:"left" },
  catRowName:     { color:"#cbd5e1", fontSize:12, whiteSpace:"nowrap" },
  catBarBg:       { flex:1, height:8, background:"rgba(255,255,255,0.08)", borderRadius:100, overflow:"hidden" },
  catBarFill:     { height:"100%", borderRadius:100, transition:"width 1s ease" },
  catPct:         { color:"#64748b", fontSize:12, fontFamily:"monospace", width:32 },
  certSection:    { background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.25)", borderRadius:20, padding:"24px", marginTop:24, textAlign:"left" },
  teaserGrid:     { display:"grid", gap:14, marginTop:22 },
  lockedScoreCard:{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"18px 18px 20px", textAlign:"left" },
  lockedHeader:   { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, color:"#f8fafc", fontSize:15, fontWeight:700 },
  lockedPill:     { background:"rgba(251,191,36,0.14)", color:"#fbbf24", border:"1px solid rgba(251,191,36,0.28)", borderRadius:999, padding:"4px 10px", fontSize:10, fontFamily:"monospace", letterSpacing:1, textTransform:"uppercase" },
  lockedScoreBlur:{ fontSize:44, fontWeight:900, color:"#e2e8f0", letterSpacing:4, filter:"blur(7px)", userSelect:"none", marginBottom:8 },
  lockedMeta:     { color:"#94a3b8", fontSize:13, lineHeight:1.6 },
  certificateTeaserCard:{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"18px", textAlign:"left" },
  certificateTeaserFrame:{ borderRadius:16, background:"linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))", border:"1px solid rgba(255,255,255,0.08)", padding:"18px", minHeight:140, display:"flex", flexDirection:"column", justifyContent:"space-between" },
  certificateTeaserName:{ color:"#f8fafc", fontSize:22, fontWeight:700 },
  certificateTeaserBlur:{ color:"#f1f5f9", fontSize:18, fontWeight:800, filter:"blur(6px)", userSelect:"none", alignSelf:"flex-start" },
  certificateTeaserFooter:{ color:"#94a3b8", fontSize:12 },
  ctaCard:        { background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.22)", borderRadius:20, padding:"22px", textAlign:"left" },
  ctaEyebrow:     { color:"#fbbf24", fontSize:11, letterSpacing:1.5, fontFamily:"monospace", textTransform:"uppercase", marginBottom:8 },
  ctaTitle:       { color:"#f8fafc", fontSize:24, fontWeight:800, lineHeight:1.1, marginBottom:8 },
  ctaText:        { color:"#cbd5e1", fontSize:14, lineHeight:1.65, marginBottom:14 },
  certHeader:     { display:"flex", alignItems:"center", gap:12, marginBottom:16 },
  certTitle:      { color:"#fbbf24", fontWeight:700, fontSize:16 },
  certSubtitle:   { color:"#94a3b8", fontSize:12 },
  certPrice:      { marginLeft:"auto", background:"rgba(251,191,36,0.15)", color:"#fbbf24", border:"1px solid rgba(251,191,36,0.4)", borderRadius:100, padding:"4px 14px", fontSize:16, fontWeight:700 },
  certFeatures:   { display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:16 },
  certFeature:    { color:"#cbd5e1", fontSize:12, display:"flex", gap:6, alignItems:"flex-start" },
  nameInput:      { width:"100%", padding:"12px 16px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, color:"#f1f5f9", fontSize:14, marginBottom:12, boxSizing:"border-box", fontFamily:"'Georgia',serif", outline:"none" },
  certBtn:        { width:"100%", padding:"14px", background:"linear-gradient(135deg,#b8963e,#fbbf24)", color:"#1a0f00", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 6px 24px rgba(184,150,62,0.4)" },
  modal:          { position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 },
  modalCard:      { background:"#1a1040", border:"1px solid rgba(251,191,36,0.3)", borderRadius:24, padding:"36px 32px", maxWidth:380, width:"100%", boxShadow:"0 0 60px rgba(251,191,36,0.15)" },
  modalTitle:     { color:"#f1f5f9", fontSize:20, fontWeight:700, textAlign:"center", marginBottom:8 },
  modalName:      { color:"#a78bfa", fontSize:22, fontWeight:700, textAlign:"center", marginBottom:4 },
  modalIQ:        { color:"#94a3b8", fontSize:14, textAlign:"center", marginBottom:16 },
  modalPrice:     { color:"#fbbf24", fontSize:36, fontWeight:900, textAlign:"center", marginBottom:4 },
  payBtn:         { width:"100%", padding:"14px", background:"linear-gradient(135deg,#b8963e,#fbbf24)", color:"#1a0f00", border:"none", borderRadius:12, fontSize:16, fontWeight:700, cursor:"pointer", marginBottom:10, boxShadow:"0 6px 24px rgba(184,150,62,0.4)" },
  cancelBtn:      { width:"100%", padding:"12px", background:"transparent", color:"#64748b", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, fontSize:14, cursor:"pointer", fontFamily:"'Georgia',serif" },
  paymentDebugBox:{ marginTop:10, padding:"10px 12px", borderRadius:10, border:"1px solid rgba(248,113,113,0.35)", background:"rgba(15,23,42,0.7)", color:"#fda4af", fontSize:10, lineHeight:1.5, whiteSpace:"pre-wrap", wordBreak:"break-word", fontFamily:"monospace", maxHeight:120, overflow:"auto" },
};

