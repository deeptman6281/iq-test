// ---------------------------------------------------------
//  QUESTION BANK - 210 questions across 6 categories
//  35 questions per category
//  Imported by App.jsx - edit questions here only
// ---------------------------------------------------------

const vc = (outer, inner, fill, extra = {}) => ({
  outer,
  inner,
  fill,
  ...extra,
});

function shuffleWithAnswer(options, answer) {
  const keyed = options.map((opt, idx) => ({ opt, isAnswer: idx === answer }));
  for (let i = keyed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keyed[i], keyed[j]] = [keyed[j], keyed[i]];
  }
  return {
    options: keyed.map(item => item.opt),
    answer: keyed.findIndex(item => item.isAnswer),
  };
}

const BASE_QUESTION_BANK = [

  // ── LOGICAL REASONING (35) ────────────────────────────────
  { category: "Logical Reasoning", question: "All roses are flowers. Some flowers fade quickly. Therefore:", options: ["All roses fade quickly", "Some roses may fade quickly", "No roses fade quickly", "Roses never fade"], answer: 1 },
  { category: "Logical Reasoning", question: "If A > B, and B > C, and C > D, which is true?", options: ["D > A", "A > D", "B > A", "C > A"], answer: 1 },
  { category: "Logical Reasoning", question: "All cats are animals. Some animals are wild. Therefore:", options: ["All cats are wild", "Some cats may be wild", "No cats are wild", "All wild things are cats"], answer: 1 },
  { category: "Logical Reasoning", question: "If no birds are fish, and all fish can swim, then:", options: ["No birds can swim", "Some birds can swim", "Birds may or may not swim", "All birds are fish"], answer: 2 },
  { category: "Logical Reasoning", question: "All doctors are educated. Ravi is educated. Therefore:", options: ["Ravi is a doctor", "Ravi may be a doctor", "Ravi is not a doctor", "All educated people are doctors"], answer: 1 },
  { category: "Logical Reasoning", question: "If some Zips are Zaps, and all Zaps are Zops, then:", options: ["All Zips are Zops", "Some Zips are Zops", "No Zips are Zops", "All Zops are Zips"], answer: 1 },
  { category: "Logical Reasoning", question: "No plastic is metal. All rings are metal. Therefore:", options: ["Some rings are plastic", "No rings are plastic", "Some plastic is rings", "All metal is rings"], answer: 1 },
  { category: "Logical Reasoning", question: "If today is not Monday, and yesterday was not Sunday, what day could today be?", options: ["Tuesday", "Monday", "Sunday", "Cannot determine"], answer: 3 },
  { category: "Logical Reasoning", question: "All squares are rectangles. Some rectangles are not squares. Therefore:", options: ["Some squares are not rectangles", "All rectangles are squares", "Some rectangles are squares", "No rectangles are squares"], answer: 2 },
  { category: "Logical Reasoning", question: "Only members can enter. John entered. Therefore:", options: ["John is a member", "John is not a member", "John might be a member", "Members never enter"], answer: 0 },
  { category: "Logical Reasoning", question: "If P implies Q, and Q implies R, then:", options: ["R implies P", "P implies R", "Q implies P", "R implies Q"], answer: 1 },
  { category: "Logical Reasoning", question: "All athletes are fit. No lazy person is fit. Therefore:", options: ["All lazy people are athletes", "No athlete is lazy", "Some athletes are lazy", "All fit people are athletes"], answer: 1 },
  { category: "Logical Reasoning", question: "If it rains, the ground gets wet. The ground is wet. Therefore:", options: ["It rained", "It did not rain", "It may or may not have rained", "Rain never wets the ground"], answer: 2 },
  { category: "Logical Reasoning", question: "Some managers are leaders. All leaders are visionary. Therefore:", options: ["All managers are visionary", "Some managers are visionary", "No managers are visionary", "All visionary people are managers"], answer: 1 },
  { category: "Logical Reasoning", question: "In a row, A is to the left of B, C is to the right of B, and D is between A and B. Who is second from left?", options: ["A", "B", "C", "D"], answer: 3 },
  { category: "Logical Reasoning", question: "If all pens are books, and some books are red, then:", options: ["All pens are red", "Some pens may be red", "No pens are red", "All red things are pens"], answer: 1 },
  { category: "Logical Reasoning", question: "Every even number is divisible by 2. 14 is even. Therefore:", options: ["14 is divisible by 2", "14 is not divisible by 2", "14 may be divisible by 2", "2 is divisible by 14"], answer: 0 },
  { category: "Logical Reasoning", question: "All teachers know grammar. Priya knows grammar. Therefore:", options: ["Priya is a teacher", "Priya may be a teacher", "Priya is not a teacher", "All grammar experts teach"], answer: 1 },
  { category: "Logical Reasoning", question: "No fruit is a vegetable. Carrot is a vegetable. Therefore:", options: ["Carrot is a fruit", "Carrot is not a fruit", "Some fruits are carrots", "Vegetables are fruits"], answer: 1 },
  { category: "Logical Reasoning", question: "If X is greater than Y and Y is greater than Z, which arrangement is correct?", options: ["Z > X > Y", "X > Y > Z", "Y > X > Z", "Z > Y > X"], answer: 1 },
  { category: "Logical Reasoning", question: "All planets orbit a star. Earth orbits the Sun. Therefore:", options: ["The Sun is a star", "Earth is the only planet", "All stars have planets", "Planets don't orbit"], answer: 0 },
  { category: "Logical Reasoning", question: "Some birds can't fly. All penguins are birds. Therefore:", options: ["All penguins can fly", "Penguins may or may not fly", "No penguins can fly", "All birds are penguins"], answer: 1 },
  { category: "Logical Reasoning", question: "If no A is B, and all C is B, then:", options: ["Some A is C", "No A is C", "All A is C", "Some C is A"], answer: 1 },
  { category: "Logical Reasoning", question: "Three boxes: Red has apples, Blue has oranges, Green has either. Which box definitely has apples?", options: ["Red", "Blue", "Green", "Cannot determine"], answer: 0 },
  { category: "Logical Reasoning", question: "All honest people tell truth. Ram lies. Therefore:", options: ["Ram is honest", "Ram is not honest", "Ram may be honest", "Honest people lie"], answer: 1 },
  { category: "Logical Reasoning", question: "If some A are B and some B are C, then:", options: ["All A are C", "Some A are C", "No A are C", "A and C may overlap"], answer: 3 },
  { category: "Logical Reasoning", question: "All keys open locks. This item opens a lock. Therefore:", options: ["It is a key", "It may be a key", "It is not a key", "All locks need keys"], answer: 1 },
  { category: "Logical Reasoning", question: "Five people sit in a row. If E is last and A is first, and B is between C and D, who can be second?", options: ["A", "B", "C or D", "E"], answer: 2 },
  { category: "Logical Reasoning", question: "No wolf is harmless. Some dogs are harmless. Therefore:", options: ["Some dogs are wolves", "No dog is a wolf", "Some dogs are not wolves", "All wolves are dogs"], answer: 2 },
  { category: "Logical Reasoning", question: "If all fast things are efficient and some machines are fast, then:", options: ["All machines are efficient", "Some machines are efficient", "No machines are efficient", "All efficient things are fast"], answer: 1 },
  { category: "Logical Reasoning", question: "All computers need electricity. My device needs electricity. Therefore:", options: ["My device is a computer", "My device may be a computer", "My device is not a computer", "All electric devices are computers"], answer: 1 },
  { category: "Logical Reasoning", question: "If nobody who works hard fails, and Raj failed, then:", options: ["Raj worked hard", "Raj did not work hard", "Raj may have worked hard", "Hard work causes failure"], answer: 1 },
  { category: "Logical Reasoning", question: "All green apples are sour. This apple is sour. Therefore:", options: ["This apple is green", "This apple may be green", "This apple is not green", "All sour things are green"], answer: 1 },
  { category: "Logical Reasoning", question: "Some pilots are engineers. All engineers are graduates. Therefore:", options: ["All pilots are graduates", "Some pilots are graduates", "No pilots are graduates", "All graduates are pilots"], answer: 1 },
  { category: "Logical Reasoning", question: "If only the best students pass, and Meena passed, then:", options: ["Meena is a best student", "Meena may be a best student", "Meena is not a best student", "Best students always fail"], answer: 0 },

  // ── PATTERN RECOGNITION (35) ──────────────────────────────
  { category: "Pattern Recognition", question: "What comes next: 2, 4, 8, 16, ?", options: ["24", "30", "32", "36"], answer: 2 },
  { category: "Pattern Recognition", question: "What comes next: 1, 1, 2, 3, 5, 8, ?", options: ["11", "12", "13", "14"], answer: 2 },
  { category: "Pattern Recognition", question: "Which number completes: 3, 6, 11, 18, 27, ?", options: ["36", "38", "40", "42"], answer: 1 },
  { category: "Pattern Recognition", question: "A o B * C o D * E o ? What symbol follows?", options: ["o", "*", "triangle", "square"], answer: 1 },
  { category: "Pattern Recognition", question: "What comes next: 1, 4, 9, 16, 25, ?", options: ["30", "36", "49", "32"], answer: 1 },
  { category: "Pattern Recognition", question: "What comes next: 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "46"], answer: 1 },
  { category: "Pattern Recognition", question: "What comes next: 5, 10, 20, 40, ?", options: ["60", "70", "80", "100"], answer: 2 },
  { category: "Pattern Recognition", question: "What comes next: 100, 91, 83, 76, 70, ?", options: ["64", "65", "66", "67"], answer: 1 },
  { category: "Pattern Recognition", question: "What comes next: 1, 3, 7, 15, 31, ?", options: ["45", "55", "63", "65"], answer: 2 },
  { category: "Pattern Recognition", question: "What comes next: Z, X, V, T, R, ?", options: ["P", "Q", "S", "O"], answer: 0 },
  { category: "Pattern Recognition", question: "What comes next: A, C, F, J, O, ?", options: ["T", "U", "V", "W"], answer: 1 },
  { category: "Pattern Recognition", question: "What comes next: 3, 9, 27, 81, ?", options: ["162", "243", "252", "270"], answer: 1 },
  { category: "Pattern Recognition", question: "What comes next: 0, 1, 3, 6, 10, 15, ?", options: ["18", "19", "20", "21"], answer: 3 },
  { category: "Pattern Recognition", question: "What is missing: 2, ?, 8, 11, 14", options: ["4", "5", "6", "7"], answer: 1 },
  { category: "Pattern Recognition", question: "What comes next: 1, 2, 4, 7, 11, 16, ?", options: ["20", "21", "22", "23"], answer: 2 },
  { category: "Pattern Recognition", question: "What comes next: 6, 11, 21, 41, 81, ?", options: ["121", "141", "151", "161"], answer: 3 },
  { category: "Pattern Recognition", question: "What comes next: 144, 121, 100, 81, 64, ?", options: ["36", "49", "50", "48"], answer: 1 },
  { category: "Pattern Recognition", question: "What comes next: 2, 3, 5, 7, 11, 13, ?", options: ["15", "16", "17", "19"], answer: 2 },
  { category: "Pattern Recognition", question: "What comes next: 1, 8, 27, 64, 125, ?", options: ["196", "210", "216", "220"], answer: 2 },
  {
    type: "visual",
    category: "Pattern Recognition",
    question: "Which shape completes the 3x3 matrix?",
    grid: [
      vc("triangle", "circle", "black"), vc("circle", "square", "white"), vc("square", "triangle", "gray"),
      vc("square", "square", "gray"), vc("triangle", "triangle", "black"), vc("circle", "circle", "white"),
      vc("circle", "triangle", "white"), vc("square", "circle", "gray"),
    ],
    options: [
      vc("triangle", "square", "black"),
      vc("triangle", "square", "gray"),
      vc("square", "square", "black"),
      vc("triangle", "triangle", "black"),
      vc("circle", "square", "black"),
      vc("triangle", "circle", "black"),
    ],
    answer: 0,
  },
  {
    type: "visual",
    category: "Pattern Recognition",
    question: "Which shape completes the 3x3 matrix?",
    grid: [
      vc("circle", "dot", "white"), vc("square", "square", "gray"), vc("triangle", "triangle", "black"),
      vc("square", "triangle", "black"), vc("triangle", "dot", "white"), vc("circle", "square", "gray"),
      vc("triangle", "square", "gray"), vc("circle", "triangle", "black"),
    ],
    options: [
      vc("square", "dot", "white"),
      vc("square", "dot", "gray"),
      vc("circle", "dot", "white"),
      vc("square", "triangle", "white"),
      vc("triangle", "dot", "white"),
      vc("square", "square", "white"),
    ],
    answer: 0,
  },
  {
    type: "visual",
    category: "Pattern Recognition",
    question: "Which shape completes the 3x3 matrix?",
    grid: [
      vc("circle", "triangle", "black", { innerRotation: 0 }), vc("square", "triangle", "gray", { innerRotation: 90 }), vc("triangle", "triangle", "white", { innerRotation: 180 }),
      vc("square", "triangle", "gray", { innerRotation: 90 }), vc("triangle", "triangle", "white", { innerRotation: 180 }), vc("circle", "triangle", "black", { innerRotation: 270 }),
      vc("triangle", "triangle", "white", { innerRotation: 180 }), vc("circle", "triangle", "black", { innerRotation: 270 }),
    ],
    options: [
      vc("square", "triangle", "gray", { innerRotation: 0 }),
      vc("square", "triangle", "gray", { innerRotation: 180 }),
      vc("triangle", "triangle", "gray", { innerRotation: 0 }),
      vc("square", "triangle", "black", { innerRotation: 0 }),
      vc("square", "triangle", "white", { innerRotation: 0 }),
      vc("circle", "triangle", "gray", { innerRotation: 0 }),
    ],
    answer: 0,
  },
  {
    type: "visual",
    category: "Pattern Recognition",
    question: "Which shape completes the 3x3 matrix?",
    grid: [
      vc("circle", "square", "black", { innerScale: 0.8 }), vc("square", "circle", "black", { innerScale: 1.0 }), vc("triangle", "dot", "black", { innerScale: 1.2 }),
      vc("square", "circle", "black", { innerScale: 1.2 }), vc("triangle", "dot", "black", { innerScale: 0.8 }), vc("circle", "square", "black", { innerScale: 1.0 }),
      vc("triangle", "dot", "black", { innerScale: 1.0 }), vc("circle", "square", "black", { innerScale: 1.2 }),
    ],
    options: [
      vc("square", "circle", "black", { innerScale: 0.8 }),
      vc("square", "circle", "black", { innerScale: 1.2 }),
      vc("square", "square", "black", { innerScale: 0.8 }),
      vc("square", "circle", "gray", { innerScale: 0.8 }),
      vc("circle", "circle", "black", { innerScale: 0.8 }),
      vc("square", "dot", "black", { innerScale: 0.8 }),
    ],
    answer: 0,
  },
  {
    type: "visual",
    category: "Pattern Recognition",
    question: "Which shape completes the 3x3 matrix?",
    grid: [
      vc("triangle", "dot", "black"), vc("triangle", "square", "gray"), vc("triangle", "triangle", "white"),
      vc("square", "dot", "gray"), vc("square", "square", "white"), vc("square", "triangle", "black"),
      vc("circle", "dot", "white"), vc("circle", "square", "black"),
    ],
    options: [
      vc("circle", "triangle", "gray"),
      vc("circle", "triangle", "black"),
      vc("circle", "square", "gray"),
      vc("triangle", "triangle", "gray"),
      vc("square", "triangle", "gray"),
      vc("circle", "dot", "gray"),
    ],
    answer: 0,
  },
  {
    type: "visual",
    category: "Pattern Recognition",
    question: "Which shape completes the 3x3 matrix?",
    grid: [
      vc("circle", "triangle", "black", { innerRotation: 0 }), vc("circle", "triangle", "gray", { innerRotation: 90 }), vc("circle", "triangle", "white", { innerRotation: 180 }),
      vc("square", "triangle", "gray", { innerRotation: 180 }), vc("square", "triangle", "white", { innerRotation: 270 }), vc("square", "triangle", "black", { innerRotation: 0 }),
      vc("triangle", "triangle", "white", { innerRotation: 0 }), vc("triangle", "triangle", "black", { innerRotation: 90 }),
    ],
    options: [
      vc("triangle", "triangle", "gray", { innerRotation: 180 }),
      vc("triangle", "triangle", "gray", { innerRotation: 0 }),
      vc("triangle", "triangle", "black", { innerRotation: 180 }),
      vc("square", "triangle", "gray", { innerRotation: 180 }),
      vc("triangle", "triangle", "white", { innerRotation: 180 }),
      vc("triangle", "dot", "gray", { innerRotation: 180 }),
    ],
    answer: 0,
  },
  {
    type: "visual",
    category: "Pattern Recognition",
    question: "Which shape completes the 3x3 matrix?",
    grid: [
      vc("circle", "square", "white", { innerRotation: 0 }), vc("square", "square", "gray", { innerRotation: 45 }), vc("triangle", "square", "black", { innerRotation: 90 }),
      vc("square", "square", "black", { innerRotation: 90 }), vc("triangle", "square", "white", { innerRotation: 135 }), vc("circle", "square", "gray", { innerRotation: 180 }),
      vc("triangle", "square", "gray", { innerRotation: 180 }), vc("circle", "square", "black", { innerRotation: 225 }),
    ],
    options: [
      vc("square", "square", "white", { innerRotation: 270 }),
      vc("square", "square", "white", { innerRotation: 225 }),
      vc("square", "square", "gray", { innerRotation: 270 }),
      vc("circle", "square", "white", { innerRotation: 270 }),
      vc("square", "triangle", "white", { innerRotation: 270 }),
      vc("square", "square", "black", { innerRotation: 270 }),
    ],
    answer: 0,
  },
  {
    type: "visual",
    category: "Pattern Recognition",
    question: "Which shape completes the 3x3 matrix?",
    grid: [
      vc("square", "dot", "black", { outerRotation: 0 }), vc("square", "dot", "gray", { outerRotation: 45 }), vc("square", "dot", "white", { outerRotation: 0 }),
      vc("circle", "dot", "gray"), vc("circle", "dot", "white"), vc("circle", "dot", "black"),
      vc("triangle", "dot", "white", { outerRotation: 0 }), vc("triangle", "dot", "black", { outerRotation: 180 }),
    ],
    options: [
      vc("triangle", "dot", "gray", { outerRotation: 0 }),
      vc("triangle", "dot", "gray", { outerRotation: 180 }),
      vc("triangle", "dot", "white", { outerRotation: 0 }),
      vc("square", "dot", "gray", { outerRotation: 0 }),
      vc("triangle", "circle", "gray", { outerRotation: 0 }),
      vc("circle", "dot", "gray"),
    ],
    answer: 0,
  },
  {
    type: "visual",
    category: "Pattern Recognition",
    question: "Which shape completes the 3x3 matrix?",
    grid: [
      vc("circle", "triangle", "black", { innerRotation: 0, innerScale: 0.8 }), vc("square", "triangle", "black", { innerRotation: 90, innerScale: 1.0 }), vc("triangle", "triangle", "black", { innerRotation: 180, innerScale: 1.2 }),
      vc("square", "triangle", "gray", { innerRotation: 90, innerScale: 1.2 }), vc("triangle", "triangle", "gray", { innerRotation: 180, innerScale: 0.8 }), vc("circle", "triangle", "gray", { innerRotation: 270, innerScale: 1.0 }),
      vc("triangle", "triangle", "white", { innerRotation: 180, innerScale: 1.0 }), vc("circle", "triangle", "white", { innerRotation: 270, innerScale: 1.2 }),
    ],
    options: [
      vc("square", "triangle", "white", { innerRotation: 0, innerScale: 0.8 }),
      vc("square", "triangle", "white", { innerRotation: 0, innerScale: 1.2 }),
      vc("square", "triangle", "gray", { innerRotation: 0, innerScale: 0.8 }),
      vc("square", "triangle", "white", { innerRotation: 180, innerScale: 0.8 }),
      vc("triangle", "triangle", "white", { innerRotation: 0, innerScale: 0.8 }),
      vc("square", "square", "white", { innerRotation: 0, innerScale: 0.8 }),
    ],
    answer: 0,
  },
  {
    type: "visual",
    category: "Pattern Recognition",
    question: "Which shape completes the 3x3 matrix?",
    grid: [
      vc("circle", "dot", "black"), vc("square", "circle", "black"), vc("triangle", "square", "black"),
      vc("square", "circle", "gray"), vc("triangle", "square", "gray"), vc("circle", "dot", "gray"),
      vc("triangle", "square", "white"), vc("circle", "dot", "white"),
    ],
    options: [
      vc("square", "circle", "white"),
      vc("square", "square", "white"),
      vc("circle", "circle", "white"),
      vc("square", "circle", "gray"),
      vc("triangle", "circle", "white"),
      vc("square", "dot", "white"),
    ],
    answer: 0,
  },
  {
    type: "visual",
    category: "Pattern Recognition",
    question: "Which shape completes the 3x3 matrix?",
    grid: [
      vc("circle", "dot", "black"), vc("square", "dot", "gray"), vc("triangle", "dot", "white"),
      vc("square", "dot", "white"), vc("triangle", "dot", "black"), vc("circle", "dot", "gray"),
      vc("triangle", "dot", "gray"), vc("circle", "dot", "white"),
    ],
    options: [
      vc("square", "dot", "black"),
      vc("square", "dot", "white"),
      vc("circle", "dot", "black"),
      vc("triangle", "dot", "white"),
      vc("square", "circle", "black"),
      vc("square", "triangle", "black"),
    ],
    answer: 0,
  },
  {
    type: "visual",
    category: "Pattern Recognition",
    question: "Which shape completes the 3x3 matrix?",
    grid: [
      vc("triangle", "square", "black"), vc("circle", "triangle", "black"), vc("square", "circle", "black"),
      vc("circle", "square", "gray"), vc("square", "triangle", "gray"), vc("triangle", "circle", "gray"),
      vc("square", "square", "white"), vc("triangle", "triangle", "white"),
    ],
    options: [
      vc("circle", "circle", "white"),
      vc("circle", "triangle", "white"),
      vc("square", "circle", "white"),
      vc("circle", "circle", "gray"),
      vc("triangle", "circle", "white"),
      vc("circle", "dot", "white"),
    ],
    answer: 0,
  },
  {
    type: "visual",
    category: "Pattern Recognition",
    question: "Which shape completes the 3x3 matrix?",
    grid: [
      vc("circle", "dot", "white", { innerScale: 0.8 }), vc("circle", "dot", "gray", { innerScale: 1.0 }), vc("circle", "dot", "black", { innerScale: 1.2 }),
      vc("square", "dot", "gray", { innerScale: 1.2 }), vc("square", "dot", "black", { innerScale: 0.8 }), vc("square", "dot", "white", { innerScale: 1.0 }),
      vc("triangle", "dot", "black", { innerScale: 1.0 }), vc("triangle", "dot", "white", { innerScale: 1.2 }),
    ],
    options: [
      vc("triangle", "dot", "gray", { innerScale: 0.8 }),
      vc("triangle", "dot", "gray", { innerScale: 1.2 }),
      vc("triangle", "dot", "black", { innerScale: 0.8 }),
      vc("triangle", "dot", "white", { innerScale: 0.8 }),
      vc("square", "dot", "gray", { innerScale: 0.8 }),
      vc("triangle", "circle", "gray", { innerScale: 0.8 }),
    ],
    answer: 0,
  },
  {
    type: "visual",
    category: "Pattern Recognition",
    question: "Which shape completes the 3x3 matrix?",
    grid: [
      vc("triangle", "triangle", "black", { innerRotation: 0 }), vc("triangle", "triangle", "gray", { innerRotation: 90 }), vc("triangle", "triangle", "white", { innerRotation: 180 }),
      vc("square", "triangle", "gray", { innerRotation: 180 }), vc("square", "triangle", "white", { innerRotation: 270 }), vc("square", "triangle", "black", { innerRotation: 0 }),
      vc("circle", "triangle", "white", { innerRotation: 0 }), vc("circle", "triangle", "black", { innerRotation: 90 }),
    ],
    options: [
      vc("circle", "triangle", "gray", { innerRotation: 180 }),
      vc("circle", "triangle", "gray", { innerRotation: 0 }),
      vc("circle", "triangle", "black", { innerRotation: 180 }),
      vc("circle", "triangle", "white", { innerRotation: 180 }),
      vc("triangle", "triangle", "gray", { innerRotation: 180 }),
      vc("circle", "dot", "gray", { innerRotation: 180 }),
    ],
    answer: 0,
  },
  {
    type: "visual",
    category: "Pattern Recognition",
    question: "Which shape completes the 3x3 matrix?",
    grid: [
      vc("circle", "square", "black", { innerRotation: 0 }), vc("square", "square", "black", { innerRotation: 45 }), vc("triangle", "square", "black", { innerRotation: 90 }),
      vc("square", "square", "gray", { innerRotation: 90 }), vc("triangle", "square", "gray", { innerRotation: 135 }), vc("circle", "square", "gray", { innerRotation: 180 }),
      vc("triangle", "square", "white", { innerRotation: 180 }), vc("circle", "square", "white", { innerRotation: 225 }),
    ],
    options: [
      vc("square", "square", "white", { innerRotation: 270 }),
      vc("square", "square", "white", { innerRotation: 225 }),
      vc("square", "triangle", "white", { innerRotation: 270 }),
      vc("circle", "square", "white", { innerRotation: 270 }),
      vc("square", "square", "gray", { innerRotation: 270 }),
      vc("square", "square", "black", { innerRotation: 270 }),
    ],
    answer: 0,
  },
  { category: "Pattern Recognition", question: "What comes next: 2, 4, 12, 48, 240, ?", options: ["960", "1200", "1440", "1680"], answer: 2 },

  // ── MATH / NUMERICAL (35) ─────────────────────────────────
  { category: "Math / Numerical", question: "Train at 60 km/h for 2.5 hours. Distance travelled?", options: ["120 km", "130 km", "150 km", "160 km"], answer: 2 },
  { category: "Math / Numerical", question: "What is 15% of 240?", options: ["32", "34", "36", "38"], answer: 2 },
  { category: "Math / Numerical", question: "Price reduced 20%, then increased 20%. Net change?", options: ["0%", "-4%", "+4%", "-2%"], answer: 1 },
  { category: "Math / Numerical", question: "If 5x + 3 = 28, what is 2x?", options: ["8", "10", "12", "14"], answer: 1 },
  { category: "Math / Numerical", question: "A shirt costs ₹800 after 20% discount. Original price?", options: ["₹960", "₹1000", "₹1200", "₹880"], answer: 1 },
  { category: "Math / Numerical", question: "What is the average of 4, 8, 15, 16, 23, 42?", options: ["16", "17", "18", "19"], answer: 2 },
  { category: "Math / Numerical", question: "If a square has area 64, what is its perimeter?", options: ["16", "24", "32", "40"], answer: 2 },
  { category: "Math / Numerical", question: "A car travels 240 km in 4 hours. Speed in km/h?", options: ["50", "55", "60", "65"], answer: 2 },
  { category: "Math / Numerical", question: "What is 12.5% of 400?", options: ["40", "45", "50", "55"], answer: 2 },
  { category: "Math / Numerical", question: "If 3 pens cost ₹45, how much do 7 pens cost?", options: ["₹95", "₹100", "₹105", "₹110"], answer: 2 },
  { category: "Math / Numerical", question: "A rectangle is 8m long and 5m wide. Area?", options: ["30 m²", "35 m²", "40 m²", "45 m²"], answer: 2 },
  { category: "Math / Numerical", question: "If x/4 = 7, then x = ?", options: ["21", "24", "28", "32"], answer: 2 },
  { category: "Math / Numerical", question: "What is 30% of 30% of 1000?", options: ["60", "70", "80", "90"], answer: 3 },
  { category: "Math / Numerical", question: "A tank fills in 6 hours. Fraction filled in 90 minutes?", options: ["1/3", "1/4", "1/6", "1/5"], answer: 1 },
  { category: "Math / Numerical", question: "If today is Wednesday, what day is 100 days later?", options: ["Monday", "Tuesday", "Wednesday", "Friday"], answer: 3 },
  { category: "Math / Numerical", question: "Two numbers sum to 50. One is 18. Their product?", options: ["567", "576", "586", "596"], answer: 1 },
  { category: "Math / Numerical", question: "A cistern leaks at 5L/hr. It fills at 15L/hr. Net fill rate?", options: ["5 L/hr", "10 L/hr", "15 L/hr", "20 L/hr"], answer: 1 },
  { category: "Math / Numerical", question: "What is 2³ + 3²?", options: ["13", "15", "17", "19"], answer: 2 },
  { category: "Math / Numerical", question: "Profit percentage if cost ₹200, selling price ₹250?", options: ["20%", "25%", "30%", "35%"], answer: 1 },
  { category: "Math / Numerical", question: "A circle has radius 7. Its area (π=22/7)?", options: ["144", "154", "164", "174"], answer: 1 },
  { category: "Math / Numerical", question: "If 40% of a number is 120, the number is?", options: ["280", "300", "320", "340"], answer: 1 },
  { category: "Math / Numerical", question: "Simple interest on ₹1000 at 10% for 2 years?", options: ["₹150", "₹180", "₹200", "₹220"], answer: 2 },
  { category: "Math / Numerical", question: "A bag has 3 red, 4 blue balls. Probability of picking red?", options: ["3/4", "4/7", "3/7", "1/2"], answer: 2 },
  { category: "Math / Numerical", question: "If 8 workers finish in 6 days, how many days for 12 workers?", options: ["3", "4", "5", "6"], answer: 1 },
  { category: "Math / Numerical", question: "What is √(144 + 25)?", options: ["13", "14", "15", "16"], answer: 0 },
  { category: "Math / Numerical", question: "Ratio of 45 minutes to 2 hours?", options: ["3:8", "3:7", "2:5", "3:5"], answer: 0 },
  { category: "Math / Numerical", question: "A number doubled and increased by 7 gives 35. The number?", options: ["12", "13", "14", "15"], answer: 2 },
  { category: "Math / Numerical", question: "What is LCM of 12 and 18?", options: ["24", "36", "48", "54"], answer: 1 },
  { category: "Math / Numerical", question: "If 6 apples cost ₹90, cost of 10 apples?", options: ["₹140", "₹145", "₹150", "₹155"], answer: 2 },
  { category: "Math / Numerical", question: "How many prime numbers between 10 and 30?", options: ["4", "5", "6", "7"], answer: 1 },
  { category: "Math / Numerical", question: "A triangle has sides 3, 4, 5. Its area?", options: ["4", "5", "6", "7"], answer: 2 },
  { category: "Math / Numerical", question: "Speed of sound ≈ 340 m/s. Distance covered in 5 seconds?", options: ["1500 m", "1600 m", "1700 m", "1800 m"], answer: 2 },
  { category: "Math / Numerical", question: "What is 999 × 999?", options: ["997001", "998001", "999001", "996001"], answer: 1 },
  { category: "Math / Numerical", question: "The sum of angles in a pentagon?", options: ["360°", "450°", "540°", "630°"], answer: 2 },
  { category: "Math / Numerical", question: "A shopkeeper sells 10 items for cost of 8. Profit%?", options: ["15%", "20%", "25%", "30%"], answer: 2 },

  // ── VERBAL / LANGUAGE (35) ────────────────────────────────
  { category: "Verbal / Language", question: "Opposite of BENEVOLENT:", options: ["Generous", "Malevolent", "Indifferent", "Passive"], answer: 1 },
  { category: "Verbal / Language", question: "DOCTOR : HOSPITAL :: JUDGE : ?", options: ["Law", "Verdict", "Courtroom", "Attorney"], answer: 2 },
  { category: "Verbal / Language", question: "Which does NOT belong: Oak, Maple, Fern, Birch?", options: ["Oak", "Maple", "Fern", "Birch"], answer: 2 },
  { category: "Verbal / Language", question: "Symphony : Composer :: Sculpture : ?", options: ["Museum", "Canvas", "Sculptor", "Chisel"], answer: 2 },
  { category: "Verbal / Language", question: "Synonym of ELOQUENT:", options: ["Silent", "Articulate", "Confused", "Abrupt"], answer: 1 },
  { category: "Verbal / Language", question: "Antonym of FRUGAL:", options: ["Careful", "Wasteful", "Thrifty", "Saving"], answer: 1 },
  { category: "Verbal / Language", question: "BIRD : FLOCK :: FISH : ?", options: ["School", "Pack", "Herd", "Colony"], answer: 0 },
  { category: "Verbal / Language", question: "Which word is spelled correctly?", options: ["Accomodate", "Accommodate", "Acomodate", "Acommodate"], answer: 1 },
  { category: "Verbal / Language", question: "Choose the odd one out: Piano, Guitar, Violin, Trumpet, Drum", options: ["Piano", "Guitar", "Trumpet", "Drum"], answer: 2 },
  { category: "Verbal / Language", question: "LIGHT : DARK :: NOISE : ?", options: ["Loud", "Sound", "Silence", "Echo"], answer: 2 },
  { category: "Verbal / Language", question: "Antonym of EPHEMERAL:", options: ["Brief", "Temporary", "Permanent", "Fleeting"], answer: 2 },
  { category: "Verbal / Language", question: "PEN : WRITER :: BRUSH : ?", options: ["Canvas", "Painter", "Color", "Art"], answer: 1 },
  { category: "Verbal / Language", question: "Which does NOT belong: Rose, Lotus, Jasmine, Mango, Lily?", options: ["Rose", "Lotus", "Mango", "Lily"], answer: 2 },
  { category: "Verbal / Language", question: "Synonym of ARDUOUS:", options: ["Easy", "Difficult", "Simple", "Quick"], answer: 1 },
  { category: "Verbal / Language", question: "RAIN : FLOOD :: DROUGHT : ?", options: ["Water", "Famine", "Desert", "Sun"], answer: 1 },
  { category: "Verbal / Language", question: "Which word means 'a person who studies stars'?", options: ["Astrologer", "Astronomer", "Geologist", "Meteorologist"], answer: 1 },
  { category: "Verbal / Language", question: "TEACHER : SCHOOL :: SOLDIER : ?", options: ["War", "Gun", "Barracks", "Country"], answer: 2 },
  { category: "Verbal / Language", question: "Antonym of VERBOSE:", options: ["Talkative", "Concise", "Loud", "Wordy"], answer: 1 },
  { category: "Verbal / Language", question: "Choose the correctly used word: He was ___ by his friends.", options: ["Complemented", "Complimented", "Completed", "Compiled"], answer: 1 },
  { category: "Verbal / Language", question: "WATER : ICE :: STEAM : ?", options: ["Fire", "Cloud", "Water", "Air"], answer: 2 },
  { category: "Verbal / Language", question: "Synonym of METICULOUS:", options: ["Careless", "Careful", "Quick", "Bold"], answer: 1 },
  { category: "Verbal / Language", question: "ODD ONE OUT: Hammer, Screwdriver, Wrench, Microscope, Pliers", options: ["Hammer", "Wrench", "Microscope", "Pliers"], answer: 2 },
  { category: "Verbal / Language", question: "CHAPTER : BOOK :: EPISODE : ?", options: ["Movie", "Scene", "Series", "Script"], answer: 2 },
  { category: "Verbal / Language", question: "Antonym of LOQUACIOUS:", options: ["Talkative", "Quiet", "Funny", "Nervous"], answer: 1 },
  { category: "Verbal / Language", question: "Which word fits: The politician gave an ___ speech.", options: ["Abrupt", "Eloquent", "Silent", "Broken"], answer: 1 },
  { category: "Verbal / Language", question: "EYE : SEE :: NOSE : ?", options: ["Face", "Breathe", "Smell", "Touch"], answer: 2 },
  { category: "Verbal / Language", question: "Synonym of CACOPHONY:", options: ["Harmony", "Silence", "Discord", "Melody"], answer: 2 },
  { category: "Verbal / Language", question: "ODD ONE OUT: Jupiter, Saturn, Sun, Neptune, Mars", options: ["Jupiter", "Saturn", "Sun", "Mars"], answer: 2 },
  { category: "Verbal / Language", question: "GLOVES : HANDS :: HELMET : ?", options: ["Feet", "Head", "Neck", "Knees"], answer: 1 },
  { category: "Verbal / Language", question: "Antonym of CONSPICUOUS:", options: ["Obvious", "Hidden", "Bright", "Loud"], answer: 1 },
  { category: "Verbal / Language", question: "KNIFE : CUT :: NEEDLE : ?", options: ["Thread", "Cloth", "Sew", "Stitch"], answer: 2 },
  { category: "Verbal / Language", question: "Synonym of PRAGMATIC:", options: ["Idealistic", "Practical", "Dreamy", "Romantic"], answer: 1 },
  { category: "Verbal / Language", question: "Which is NOT a type of poem?", options: ["Sonnet", "Haiku", "Limerick", "Soliloquy"], answer: 3 },
  { category: "Verbal / Language", question: "HEAT : THERMOMETER :: Blood pressure : ?", options: ["Stethoscope", "Sphygmomanometer", "Glucometer", "ECG"], answer: 1 },
  { category: "Verbal / Language", question: "Antonym of ZENITH:", options: ["Top", "Nadir", "Peak", "Summit"], answer: 1 },

  // ── SPATIAL REASONING (35) ────────────────────────────────
  { category: "Spatial Reasoning", question: "A cube has 6 faces. Unfolded flat, how many squares?", options: ["4", "5", "6", "8"], answer: 2 },
  { category: "Spatial Reasoning", question: "How many triangles are in a Star of David?", options: ["6", "8", "12", "2"], answer: 2 },
  { category: "Spatial Reasoning", question: "A cube has how many edges?", options: ["8", "10", "12", "14"], answer: 2 },
  { category: "Spatial Reasoning", question: "How many corners does a cube have?", options: ["6", "8", "10", "12"], answer: 1 },
  { category: "Spatial Reasoning", question: "If you fold a square diagonally, what shape do you get?", options: ["Square", "Rectangle", "Triangle", "Pentagon"], answer: 2 },
  { category: "Spatial Reasoning", question: "A cylinder has how many flat faces?", options: ["1", "2", "3", "4"], answer: 1 },
  { category: "Spatial Reasoning", question: "How many squares are in a 3×3 grid (counting all sizes)?", options: ["9", "12", "14", "16"], answer: 2 },
  { category: "Spatial Reasoning", question: "If a shape has 5 sides, it is called a:", options: ["Hexagon", "Pentagon", "Octagon", "Heptagon"], answer: 1 },
  { category: "Spatial Reasoning", question: "A clock shows 3:00. What angle is between the hands?", options: ["60°", "90°", "120°", "180°"], answer: 1 },
  { category: "Spatial Reasoning", question: "How many faces does a triangular prism have?", options: ["3", "4", "5", "6"], answer: 2 },
  { category: "Spatial Reasoning", question: "If North is at top, which direction is to your left when facing South?", options: ["North", "East", "West", "South"], answer: 1 },
  { category: "Spatial Reasoning", question: "A pyramid with square base has how many faces?", options: ["4", "5", "6", "8"], answer: 1 },
  { category: "Spatial Reasoning", question: "How many diagonals does a rectangle have?", options: ["1", "2", "3", "4"], answer: 1 },
  { category: "Spatial Reasoning", question: "If you rotate a square 90°, what do you get?", options: ["Diamond", "Square", "Rectangle", "Triangle"], answer: 1 },
  { category: "Spatial Reasoning", question: "A mirror image reverses which direction?", options: ["Up-Down", "Left-Right", "Both", "Neither"], answer: 1 },
  { category: "Spatial Reasoning", question: "How many right angles does a rectangle have?", options: ["2", "3", "4", "6"], answer: 2 },
  { category: "Spatial Reasoning", question: "If you walk 3 steps North then 4 steps East, straight-line distance from start?", options: ["5", "6", "7", "8"], answer: 0 },
  { category: "Spatial Reasoning", question: "A hexagon has how many diagonals?", options: ["6", "7", "8", "9"], answer: 3 },
  { category: "Spatial Reasoning", question: "How many triangles can be drawn in a square by drawing both diagonals?", options: ["2", "3", "4", "8"], answer: 2 },
  { category: "Spatial Reasoning", question: "If East is in front of you and you turn 180°, you face:", options: ["North", "South", "East", "West"], answer: 3 },
  { category: "Spatial Reasoning", question: "How many surfaces does a sphere have?", options: ["0", "1", "2", "3"], answer: 1 },
  { category: "Spatial Reasoning", question: "A regular octagon has how many sides?", options: ["6", "7", "8", "9"], answer: 2 },
  { category: "Spatial Reasoning", question: "How many small cubes make a 3×3×3 big cube?", options: ["9", "18", "27", "36"], answer: 2 },
  { category: "Spatial Reasoning", question: "If you fold a circle in half, what shape do you get?", options: ["Circle", "Ellipse", "Semicircle", "Triangle"], answer: 2 },
  { category: "Spatial Reasoning", question: "A clock at 6:00 — the hands form what angle?", options: ["90°", "120°", "150°", "180°"], answer: 3 },
  { category: "Spatial Reasoning", question: "How many faces does a tetrahedron have?", options: ["3", "4", "5", "6"], answer: 1 },
  { category: "Spatial Reasoning", question: "If you turn a 'p' upside down, you get:", options: ["b", "d", "q", "Same"], answer: 3 },
  { category: "Spatial Reasoning", question: "A cube is painted red. Cut into 27 pieces. How many have NO red face?", options: ["0", "1", "4", "8"], answer: 1 },
  { category: "Spatial Reasoning", question: "How many times does a clock's minute and hour hand overlap in 12 hours?", options: ["10", "11", "12", "13"], answer: 1 },
  { category: "Spatial Reasoning", question: "If 'b' is mirrored horizontally, what do you see?", options: ["d", "p", "q", "b"], answer: 0 },
  { category: "Spatial Reasoning", question: "How many edges does a triangular pyramid (tetrahedron) have?", options: ["4", "6", "8", "12"], answer: 1 },
  { category: "Spatial Reasoning", question: "A 4×4 chessboard has how many squares total (all sizes)?", options: ["16", "20", "30", "42"], answer: 2 },
  { category: "Spatial Reasoning", question: "If you face North and turn 270° clockwise, you face:", options: ["North", "East", "West", "South"], answer: 2 },
  { category: "Spatial Reasoning", question: "Two identical triangles joined at their bases form a:", options: ["Square", "Rhombus", "Rectangle", "Kite"], answer: 1 },
  { category: "Spatial Reasoning", question: "How many vertices does a pentagonal prism have?", options: ["5", "7", "10", "12"], answer: 2 },

  // ── WORKING MEMORY (35) ───────────────────────────────────
  { category: "Working Memory", question: "Sequence: 7, 3, 9, 1, 5. Sum of 2nd and 4th numbers?", options: ["4", "6", "8", "10"], answer: 0 },
  { category: "Working Memory", question: "Reverse BRAIN, take the 3rd letter. What is it?", options: ["I", "A", "N", "R"], answer: 1 },
  { category: "Working Memory", question: "Numbers: 5, 12, 3, 8, 7. Largest minus smallest?", options: ["7", "8", "9", "10"], answer: 2 },
  { category: "Working Memory", question: "Letters: B, E, H, K. What is the next letter?", options: ["M", "N", "O", "P"], answer: 1 },
  { category: "Working Memory", question: "Reverse LEMON. What is the 2nd letter?", options: ["N", "O", "M", "E"], answer: 1 },
  { category: "Working Memory", question: "Numbers: 4, 7, 2, 9, 1. Sum of 1st, 3rd and 5th?", options: ["5", "6", "7", "8"], answer: 2 },
  { category: "Working Memory", question: "Word: PENCIL. Remove 3rd and 5th letters. What remains?", options: ["PENI", "PECL", "PEIL", "PENL"], answer: 2 },
  { category: "Working Memory", question: "5 × 3 − 7 + 2 = ?", options: ["8", "9", "10", "11"], answer: 2 },
  { category: "Working Memory", question: "Read once: RED, BLUE, GREEN, YELLOW. How many letters in the 3rd colour?", options: ["3", "4", "5", "6"], answer: 2 },
  { category: "Working Memory", question: "Sequence: 2, 4, 6, 8. What is the sum of all?", options: ["18", "20", "22", "24"], answer: 1 },
  { category: "Working Memory", question: "Reverse WATER. 4th letter?", options: ["A", "E", "T", "R"], answer: 0 },
  { category: "Working Memory", question: "Numbers: 14, 7, 21, 3. Product of smallest two?", options: ["14", "21", "42", "28"], answer: 1 },
  { category: "Working Memory", question: "STRONG reversed and 2nd letter?", options: ["G", "N", "O", "R"], answer: 2 },
  { category: "Working Memory", question: "5 words: CAT, DOG, BIRD, FISH, COW. 3rd word reversed?", options: ["DRIB", "DRBI", "BIRD", "DIRB"], answer: 0 },
  { category: "Working Memory", question: "List: 3, 6, 9, 12, 15. Product of 2nd and 4th?", options: ["54", "60", "72", "80"], answer: 2 },
  { category: "Working Memory", question: "EARTH has how many vowels?", options: ["1", "2", "3", "4"], answer: 1 },
  { category: "Working Memory", question: "Numbers: 8, 3, 6, 1, 4. Average of the two smallest?", options: ["2", "2.5", "3", "3.5"], answer: 1 },
  { category: "Working Memory", question: "WINTER backwards — last two letters?", options: ["ET", "NI", "TW", "RE"], answer: 3 },
  { category: "Working Memory", question: "If A=1, B=2... Z=26, what is the value of CAT?", options: ["22", "24", "26", "28"], answer: 1 },
  { category: "Working Memory", question: "Sequence: 100, 90, 81, 73. Differences decreasing by?", options: ["1", "2", "3", "4"], answer: 0 },
  { category: "Working Memory", question: "MONDAY: 3rd and 5th letters?", options: ["N+A", "N+D", "D+A", "O+A"], answer: 2 },
  { category: "Working Memory", question: "Numbers heard: 9, 4, 7, 2, 5. Middle number?", options: ["4", "5", "7", "9"], answer: 2 },
  { category: "Working Memory", question: "Reverse PLANET. What is 3rd letter?", options: ["E", "N", "A", "L"], answer: 0 },
  { category: "Working Memory", question: "3 + 7 × 2 − 4 = ?", options: ["13", "16", "17", "20"], answer: 2 },
  { category: "Working Memory", question: "SCHOOL: Remove vowels. What remains?", options: ["SCH", "SCHL", "SCL", "SCHOL"], answer: 1 },
  { category: "Working Memory", question: "Numbers: 11, 22, 33, 44, 55. Sum of 1st and last?", options: ["55", "60", "66", "70"], answer: 2 },
  { category: "Working Memory", question: "TIGER reversed — 1st and 3rd letters?", options: ["R+G", "T+G", "R+I", "E+G"], answer: 0 },
  { category: "Working Memory", question: "If A=Z, B=Y, C=X... what does CAT encode to?", options: ["ZXG", "XZG", "ZAT", "XAG"], answer: 0 },
  { category: "Working Memory", question: "Numbers: 6, 2, 8, 4. Multiply largest by smallest?", options: ["12", "16", "18", "20"], answer: 1 },
  { category: "Working Memory", question: "MUSIC: Which letter is in the middle?", options: ["S", "I", "U", "M"], answer: 2 },
  { category: "Working Memory", question: "Reverse FLOWER. Sum of positions of vowels in result?", options: ["5", "6", "7", "8"], answer: 2 },
  { category: "Working Memory", question: "Numbers: 5, 10, 15, 20, 25. Remove middle, sum rest?", options: ["50", "55", "60", "65"], answer: 2 },
  { category: "Working Memory", question: "STONE: Every other letter starting from 1st?", options: ["SO", "ST", "SN", "SE"], answer: 3 },
  { category: "Working Memory", question: "Read: 7 dogs, 3 cats, 5 birds. Total animals?", options: ["13", "14", "15", "16"], answer: 2 },
  { category: "Working Memory", question: "DREAM reversed — consonants only?", options: ["MRD", "DRM", "RMD", "RDM"], answer: 0 },
];

// ── Pick 20 balanced random questions (called once per session) ──
function buildOptions(correct, distractors, answerIndex) {
  const options = [...distractors];
  options.splice(answerIndex, 0, correct);
  return { options, answer: answerIndex };
}

function buildExtraLogicalQuestions() {
  const disjointSets = [
    ["sparrows", "birds", "mammals"], ["tables", "furniture", "vehicles"], ["poets", "writers", "machines"], ["violinists", "musicians", "planets"],
    ["apples", "fruits", "metals"], ["teachers", "educators", "reptiles"], ["roses", "flowers", "engines"], ["doctors", "professionals", "insects"],
    ["triangles", "polygons", "circles"], ["bicycles", "vehicles", "birds"], ["laptops", "electronics", "plants"], ["rivers", "waterbodies", "deserts"],
    ["pilots", "crew", "trees"], ["diamonds", "gems", "liquids"], ["pianos", "instruments", "fish"], ["satellites", "objects", "animals"],
  ];
  const overlapSets = [
    ["artists", "designers", "creatives"], ["coders", "developers", "professionals"], ["runners", "athletes", "competitors"], ["lawyers", "graduates", "professionals"],
    ["gamers", "students", "teenagers"], ["authors", "readers", "learners"], ["teachers", "trainers", "mentors"], ["investors", "planners", "professionals"],
    ["nurses", "caregivers", "workers"], ["engineers", "problem-solvers", "professionals"], ["scientists", "researchers", "academics"], ["drivers", "workers", "commuters"],
    ["singers", "performers", "artists"], ["managers", "leaders", "decision-makers"], ["analysts", "observers", "professionals"], ["designers", "creators", "artists"],
  ];
  const out = [];
  disjointSets.forEach(([a, b, c], idx) => {
    const placed = buildOptions(`No ${a} are ${c}.`, [`Some ${a} are ${c}.`, `All ${c} are ${a}.`, `${a} may be ${c}.`], idx % 4);
    out.push({ category: "Logical Reasoning", question: `All ${a} are ${b}. No ${b} are ${c}. Therefore, which statement must be true?`, options: placed.options, answer: placed.answer });
  });
  overlapSets.forEach(([a, b, c], idx) => {
    const placed = buildOptions(`Some ${a} are ${c}.`, [`No ${a} are ${c}.`, `All ${a} are ${c}.`, `No ${b} are ${c}.`], (idx + 1) % 4);
    out.push({ category: "Logical Reasoning", question: `Some ${a} are ${b}. All ${b} are ${c}. What follows logically?`, options: placed.options, answer: placed.answer });
  });
  return out;
}

function buildExtraPatternTextQuestions() {
  return [
    { category: "Pattern Recognition", question: "What comes next: 4, 9, 16, 25, 36, ?", options: ["42", "45", "49", "54"], answer: 2 },
    { category: "Pattern Recognition", question: "What comes next: 2, 5, 10, 17, 26, ?", options: ["35", "37", "39", "41"], answer: 1 },
    { category: "Pattern Recognition", question: "What comes next: 81, 27, 9, 3, ?", options: ["1", "0", "2", "1.5"], answer: 0 },
    { category: "Pattern Recognition", question: "What comes next: 7, 10, 16, 25, 37, ?", options: ["50", "52", "54", "56"], answer: 1 },
    { category: "Pattern Recognition", question: "What comes next: BC, DE, FG, HI, ?", options: ["IJ", "JK", "KL", "LM"], answer: 1 },
    { category: "Pattern Recognition", question: "What comes next: 3, 6, 12, 24, 48, ?", options: ["72", "84", "96", "108"], answer: 2 },
    { category: "Pattern Recognition", question: "What comes next: 13, 21, 34, 55, ?", options: ["76", "81", "89", "90"], answer: 2 },
    { category: "Pattern Recognition", question: "What comes next: 1, 3, 6, 10, 15, ?", options: ["18", "20", "21", "24"], answer: 2 },
    { category: "Pattern Recognition", question: "What comes next: 40, 36, 31, 25, 18, ?", options: ["11", "10", "9", "8"], answer: 1 },
    { category: "Pattern Recognition", question: "What comes next: M, J, G, D, ?", options: ["B", "A", "C", "E"], answer: 1 },
    { category: "Pattern Recognition", question: "What comes next: 5, 9, 17, 33, 65, ?", options: ["97", "121", "129", "130"], answer: 2 },
    { category: "Pattern Recognition", question: "What comes next: 2, 4, 7, 11, 16, ?", options: ["20", "21", "22", "23"], answer: 2 },
    { category: "Pattern Recognition", question: "What comes next: 90, 81, 73, 66, 60, ?", options: ["55", "54", "53", "52"], answer: 0 },
    { category: "Pattern Recognition", question: "What comes next: 11, 22, 44, 88, ?", options: ["132", "154", "166", "176"], answer: 3 },
    { category: "Pattern Recognition", question: "What comes next: 2, 9, 28, 65, ?", options: ["110", "126", "127", "129"], answer: 1 },
    { category: "Pattern Recognition", question: "What comes next: AZ, BY, CX, DW, ?", options: ["EV", "FU", "GV", "EW"], answer: 0 },
    { category: "Pattern Recognition", question: "What comes next: 14, 19, 29, 44, 64, ?", options: ["81", "85", "89", "94"], answer: 2 },
    { category: "Pattern Recognition", question: "What comes next: 3, 4, 6, 9, 13, ?", options: ["16", "17", "18", "19"], answer: 2 },
    { category: "Pattern Recognition", question: "What comes next: 256, 128, 64, 32, ?", options: ["8", "12", "16", "24"], answer: 2 },
    { category: "Pattern Recognition", question: "What comes next: C, F, J, O, U, ?", options: ["A", "B", "C", "D"], answer: 0 },
    { category: "Pattern Recognition", question: "What comes next: 6, 18, 54, 162, ?", options: ["324", "406", "486", "512"], answer: 2 },
    { category: "Pattern Recognition", question: "What comes next: 1, 5, 14, 30, 55, ?", options: ["79", "84", "91", "95"], answer: 2 },
  ];
}

function buildExtraPatternVisualQuestions() {
  return [
    { type: "visual", category: "Pattern Recognition", question: "Which shape completes the 3x3 matrix?", grid: [vc("triangle", "dot", "black"), vc("circle", "dot", "gray"), vc("square", "dot", "white"), vc("circle", "dot", "white"), vc("square", "dot", "black"), vc("triangle", "dot", "gray"), vc("square", "dot", "gray"), vc("triangle", "dot", "white")], options: [vc("circle", "dot", "black"), vc("circle", "dot", "white"), vc("triangle", "dot", "black"), vc("square", "dot", "black"), vc("circle", "square", "black"), vc("circle", "triangle", "black")], answer: 0 },
    { type: "visual", category: "Pattern Recognition", question: "Which shape completes the 3x3 matrix?", grid: [vc("circle", "square", "black"), vc("square", "triangle", "black"), vc("triangle", "circle", "black"), vc("square", "square", "gray"), vc("triangle", "triangle", "gray"), vc("circle", "circle", "gray"), vc("triangle", "square", "white"), vc("circle", "triangle", "white")], options: [vc("square", "circle", "white"), vc("square", "square", "white"), vc("circle", "circle", "white"), vc("square", "circle", "gray"), vc("triangle", "circle", "white"), vc("square", "dot", "white")], answer: 0 },
    { type: "visual", category: "Pattern Recognition", question: "Which shape completes the 3x3 matrix?", grid: [vc("triangle", "triangle", "black", { innerRotation: 0 }), vc("triangle", "triangle", "gray", { innerRotation: 90 }), vc("triangle", "triangle", "white", { innerRotation: 180 }), vc("circle", "triangle", "gray", { innerRotation: 180 }), vc("circle", "triangle", "white", { innerRotation: 270 }), vc("circle", "triangle", "black", { innerRotation: 0 }), vc("square", "triangle", "white", { innerRotation: 0 }), vc("square", "triangle", "black", { innerRotation: 90 })], options: [vc("square", "triangle", "gray", { innerRotation: 180 }), vc("square", "triangle", "gray", { innerRotation: 0 }), vc("square", "triangle", "white", { innerRotation: 180 }), vc("square", "triangle", "black", { innerRotation: 180 }), vc("triangle", "triangle", "gray", { innerRotation: 180 }), vc("square", "dot", "gray", { innerRotation: 180 })], answer: 0 },
    { type: "visual", category: "Pattern Recognition", question: "Which shape completes the 3x3 matrix?", grid: [vc("square", "circle", "black", { innerScale: 0.8 }), vc("square", "circle", "gray", { innerScale: 1.0 }), vc("square", "circle", "white", { innerScale: 1.2 }), vc("triangle", "circle", "gray", { innerScale: 1.2 }), vc("triangle", "circle", "white", { innerScale: 0.8 }), vc("triangle", "circle", "black", { innerScale: 1.0 }), vc("circle", "circle", "white", { innerScale: 1.0 }), vc("circle", "circle", "black", { innerScale: 1.2 })], options: [vc("circle", "circle", "gray", { innerScale: 0.8 }), vc("circle", "circle", "gray", { innerScale: 1.2 }), vc("circle", "circle", "black", { innerScale: 0.8 }), vc("circle", "circle", "white", { innerScale: 0.8 }), vc("triangle", "circle", "gray", { innerScale: 0.8 }), vc("circle", "dot", "gray", { innerScale: 0.8 })], answer: 0 },
    { type: "visual", category: "Pattern Recognition", question: "Which shape completes the 3x3 matrix?", grid: [vc("circle", "dot", "black", { outerRotation: 0 }), vc("square", "dot", "black", { outerRotation: 45 }), vc("triangle", "dot", "black", { outerRotation: 0 }), vc("circle", "dot", "gray", { outerRotation: 45 }), vc("square", "dot", "gray", { outerRotation: 0 }), vc("triangle", "dot", "gray", { outerRotation: 45 }), vc("circle", "dot", "white", { outerRotation: 0 }), vc("square", "dot", "white", { outerRotation: 45 })], options: [vc("triangle", "dot", "white", { outerRotation: 0 }), vc("triangle", "dot", "white", { outerRotation: 45 }), vc("triangle", "dot", "gray", { outerRotation: 0 }), vc("circle", "dot", "white", { outerRotation: 0 }), vc("triangle", "circle", "white", { outerRotation: 0 }), vc("triangle", "square", "white", { outerRotation: 0 })], answer: 0 },
    { type: "visual", category: "Pattern Recognition", question: "Which shape completes the 3x3 matrix?", grid: [vc("square", "triangle", "white", { innerRotation: 0 }), vc("square", "triangle", "gray", { innerRotation: 90 }), vc("square", "triangle", "black", { innerRotation: 180 }), vc("circle", "triangle", "gray", { innerRotation: 180 }), vc("circle", "triangle", "black", { innerRotation: 270 }), vc("circle", "triangle", "white", { innerRotation: 0 }), vc("triangle", "triangle", "black", { innerRotation: 0 }), vc("triangle", "triangle", "white", { innerRotation: 90 })], options: [vc("triangle", "triangle", "gray", { innerRotation: 180 }), vc("triangle", "triangle", "gray", { innerRotation: 0 }), vc("triangle", "triangle", "black", { innerRotation: 180 }), vc("square", "triangle", "gray", { innerRotation: 180 }), vc("triangle", "dot", "gray", { innerRotation: 180 }), vc("triangle", "square", "gray", { innerRotation: 180 })], answer: 0 },
    { type: "visual", category: "Pattern Recognition", question: "Which shape completes the 3x3 matrix?", grid: [vc("triangle", "square", "black"), vc("circle", "square", "gray"), vc("square", "square", "white"), vc("circle", "circle", "black"), vc("square", "circle", "gray"), vc("triangle", "circle", "white"), vc("square", "dot", "black"), vc("triangle", "dot", "gray")], options: [vc("circle", "dot", "white"), vc("circle", "dot", "gray"), vc("circle", "square", "white"), vc("square", "dot", "white"), vc("triangle", "dot", "white"), vc("circle", "circle", "white")], answer: 0 },
    { type: "visual", category: "Pattern Recognition", question: "Which shape completes the 3x3 matrix?", grid: [vc("circle", "dot", "black"), vc("circle", "square", "black"), vc("circle", "triangle", "black"), vc("square", "dot", "gray"), vc("square", "square", "gray"), vc("square", "triangle", "gray"), vc("triangle", "dot", "white"), vc("triangle", "square", "white")], options: [vc("triangle", "triangle", "white"), vc("triangle", "square", "white"), vc("triangle", "triangle", "gray"), vc("square", "triangle", "white"), vc("triangle", "dot", "white"), vc("circle", "triangle", "white")], answer: 0 },
    { type: "visual", category: "Pattern Recognition", question: "Which shape completes the 3x3 matrix?", grid: [vc("triangle", "dot", "black"), vc("square", "circle", "black"), vc("circle", "square", "black"), vc("square", "dot", "gray"), vc("circle", "circle", "gray"), vc("triangle", "square", "gray"), vc("circle", "dot", "white"), vc("triangle", "circle", "white")], options: [vc("square", "square", "white"), vc("square", "circle", "white"), vc("circle", "square", "white"), vc("triangle", "square", "white"), vc("square", "dot", "white"), vc("square", "triangle", "white")], answer: 0 },
    { type: "visual", category: "Pattern Recognition", question: "Which shape completes the 3x3 matrix?", grid: [vc("square", "dot", "white"), vc("triangle", "dot", "gray"), vc("circle", "dot", "black"), vc("triangle", "circle", "white"), vc("circle", "circle", "gray"), vc("square", "circle", "black"), vc("circle", "triangle", "white"), vc("square", "triangle", "gray")], options: [vc("triangle", "triangle", "black"), vc("triangle", "triangle", "gray"), vc("triangle", "circle", "black"), vc("circle", "triangle", "black"), vc("square", "triangle", "black"), vc("triangle", "dot", "black")], answer: 0 },
  ];
}

function buildExtraMathQuestions() {
  const out = [];
  for (let i = 0; i < 20; i++) {
    const a = 2 + (i % 5);
    const x = 3 + (i % 8);
    const b = 4 + (i % 9);
    const c = a * x + b;
    const placed = buildOptions(String(x), [String(x + 1), String(Math.max(1, x - 1)), String(x + 2)], i % 4);
    out.push({ category: "Math / Numerical", question: `If ${a}x + ${b} = ${c}, what is x?`, options: placed.options, answer: placed.answer });
  }
  for (let i = 0; i < 15; i++) {
    const base = 200 + i * 40;
    const pct = 10 + (i % 6) * 5;
    const ans = (base * pct) / 100;
    const placed = buildOptions(String(ans), [String(ans + 8), String(ans + 12), String(ans - 8)], (i + 1) % 4);
    out.push({ category: "Math / Numerical", question: `What is ${pct}% of ${base}?`, options: placed.options, answer: placed.answer });
  }
  for (let i = 0; i < 15; i++) {
    const speed = 35 + (i % 7) * 5;
    const hours = 2 + (i % 4);
    const dist = speed * hours;
    const placed = buildOptions(`${dist} km`, [`${dist - speed} km`, `${dist + speed} km`, `${dist + 2 * speed} km`], (i + 2) % 4);
    out.push({ category: "Math / Numerical", question: `A vehicle travels at ${speed} km/h for ${hours} hours. How far does it travel?`, options: placed.options, answer: placed.answer });
  }
  return out;
}

function buildExtraVerbalQuestions() {
  const synonyms = [
    ["ABUNDANT", "Plentiful", ["Rare", "Brief", "Hidden"]], ["CALM", "Peaceful", ["Loud", "Sharp", "Bitter"]], ["DILIGENT", "Hardworking", ["Careless", "Idle", "Lazy"]],
    ["ELATED", "Joyful", ["Angry", "Tired", "Doubtful"]], ["FRAGILE", "Delicate", ["Heavy", "Rough", "Rigid"]], ["HINDER", "Obstruct", ["Assist", "Create", "Expand"]],
    ["IMPARTIAL", "Fair", ["Biased", "Noisy", "Harsh"]], ["JOVIAL", "Cheerful", ["Silent", "Somber", "Rigid"]], ["KEEN", "Sharp", ["Slow", "Dull", "Weak"]],
    ["LUCID", "Clear", ["Foggy", "Complex", "Empty"]], ["METICULOUS", "Thorough", ["Hasty", "Rough", "Casual"]], ["NOBLE", "Honorable", ["Mean", "Crooked", "Lazy"]],
    ["OPTIMAL", "Best", ["Average", "Poor", "Late"]], ["PRUDENT", "Wise", ["Rash", "Blind", "Quick"]], ["ROBUST", "Strong", ["Fragile", "Thin", "Weak"]],
    ["VIVID", "Bright", ["Dull", "Dark", "Faint"]],
  ];
  const antonyms = [
    ["ANCIENT", "Modern", ["Aged", "Historic", "Classic"]], ["BOLD", "Timid", ["Brave", "Loud", "Sharp"]], ["COMPLEX", "Simple", ["Detailed", "Layered", "Dense"]],
    ["DENSE", "Sparse", ["Thick", "Heavy", "Solid"]], ["EAGER", "Reluctant", ["Ready", "Prompt", "Keen"]], ["FLEXIBLE", "Rigid", ["Soft", "Curved", "Bending"]],
    ["GENEROUS", "Stingy", ["Helpful", "Kind", "Open"]], ["HOSTILE", "Friendly", ["Rude", "Rough", "Cold"]], ["INTENSE", "Mild", ["Severe", "Sharp", "Strong"]],
    ["JUNIOR", "Senior", ["Young", "Small", "New"]], ["LAWFUL", "Illegal", ["Legal", "Valid", "Formal"]], ["MINOR", "Major", ["Small", "Lesser", "Tiny"]],
    ["NOISY", "Quiet", ["Loud", "Rough", "Busy"]], ["OPTIMISTIC", "Pessimistic", ["Hopeful", "Bright", "Positive"]], ["RAPID", "Slow", ["Fast", "Swift", "Quick"]],
    ["VISIBLE", "Hidden", ["Clear", "Bright", "Seen"]],
  ];
  const out = [];
  synonyms.forEach(([word, correct, wrong], idx) => {
    const placed = buildOptions(correct, wrong, idx % 4);
    out.push({ category: "Verbal / Language", question: `Choose the word closest in meaning to ${word}:`, options: placed.options, answer: placed.answer });
  });
  antonyms.forEach(([word, correct, wrong], idx) => {
    const placed = buildOptions(correct, wrong, (idx + 1) % 4);
    out.push({ category: "Verbal / Language", question: `Choose the opposite of ${word}:`, options: placed.options, answer: placed.answer });
  });
  return out;
}

function buildExtraSpatialQuestions() {
  const out = [];
  const diagNs = [5, 6, 7, 8, 9, 10];
  diagNs.forEach((n, idx) => {
    const d = (n * (n - 3)) / 2;
    const placed = buildOptions(String(d), [String(d - 2), String(d + 2), String(d + 4)], idx % 4);
    out.push({ category: "Spatial Reasoning", question: `How many diagonals does a ${n}-sided polygon have?`, options: placed.options, answer: placed.answer });
  });
  const sumNs = [5, 6, 7, 8, 9, 10];
  sumNs.forEach((n, idx) => {
    const s = (n - 2) * 180;
    const placed = buildOptions(`${s} deg`, [`${s - 180} deg`, `${s + 90} deg`, `${s + 180} deg`], (idx + 1) % 4);
    out.push({ category: "Spatial Reasoning", question: `Interior angle sum of a ${n}-sided polygon is:`, options: placed.options, answer: placed.answer });
  });
  out.push(
    { category: "Spatial Reasoning", question: "A cube has how many face diagonals in total?", options: ["6", "12", "18", "24"], answer: 1 },
    { category: "Spatial Reasoning", question: "A rectangular prism has how many vertices?", options: ["6", "8", "10", "12"], answer: 1 },
    { category: "Spatial Reasoning", question: "If you turn right three times from North, you face:", options: ["North", "East", "South", "West"], answer: 3 },
    { category: "Spatial Reasoning", question: "If you face East and turn left 90 deg, you face:", options: ["North", "South", "West", "East"], answer: 0 },
    { category: "Spatial Reasoning", question: "How many lines of symmetry does a square have?", options: ["2", "3", "4", "5"], answer: 2 },
    { category: "Spatial Reasoning", question: "How many lines of symmetry does an equilateral triangle have?", options: ["1", "2", "3", "4"], answer: 2 },
    { category: "Spatial Reasoning", question: "A pentagonal pyramid has how many faces?", options: ["5", "6", "7", "8"], answer: 1 },
    { category: "Spatial Reasoning", question: "A triangular pyramid has how many vertices?", options: ["3", "4", "5", "6"], answer: 1 },
    { category: "Spatial Reasoning", question: "How many edges does a square pyramid have?", options: ["6", "8", "10", "12"], answer: 1 },
    { category: "Spatial Reasoning", question: "How many cubes are in a 4x4x4 cube?", options: ["48", "56", "64", "72"], answer: 2 },
    { category: "Spatial Reasoning", question: "If a clock reads 9:00, angle between hands is:", options: ["45 deg", "90 deg", "135 deg", "180 deg"], answer: 1 },
    { category: "Spatial Reasoning", question: "At 12:30, the smaller angle between clock hands is:", options: ["15 deg", "30 deg", "45 deg", "60 deg"], answer: 0 },
    { category: "Spatial Reasoning", question: "A hemisphere has how many total surfaces (flat + curved)?", options: ["1", "2", "3", "4"], answer: 1 },
    { category: "Spatial Reasoning", question: "If you move 5 units east and 12 north, straight-line distance is:", options: ["11", "12", "13", "14"], answer: 2 },
    { category: "Spatial Reasoning", question: "A regular hexagon can be split into how many equilateral triangles?", options: ["4", "5", "6", "7"], answer: 2 },
    { category: "Spatial Reasoning", question: "A prism with n-sided base has how many vertices?", options: ["n", "2n", "3n", "n+2"], answer: 1 },
    { category: "Spatial Reasoning", question: "A dodecagon has how many sides?", options: ["10", "11", "12", "13"], answer: 2 },
    { category: "Spatial Reasoning", question: "A circle rotated by any angle remains:", options: ["Different", "Unchanged", "Mirrored", "Skewed"], answer: 1 }
  );
  return out;
}

function buildExtraWorkingMemoryQuestions() {
  const words = ["PLANET", "SILVER", "CANDLE", "THRONE", "MARKET", "POCKET", "BRIDGE", "TARGET", "SPRING", "DRAGON", "FLOWER", "STREAM"];
  const out = [];
  words.forEach((word, idx) => {
    const reversed = word.split("").reverse().join("");
    const correct = reversed[1];
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter(ch => ch !== correct);
    const placed = buildOptions(correct, [letters[idx], letters[idx + 7], letters[idx + 13]], idx % 4);
    out.push({ category: "Working Memory", question: `Reverse ${word}. Which is the 2nd letter in the reversed word?`, options: placed.options, answer: placed.answer });
  });
  for (let i = 0; i < 12; i++) {
    const a = 6 + i;
    const b = 2 + (i % 5);
    const c = 3 + (i % 4);
    const d = 1 + (i % 3);
    const correct = a * b - c + d;
    const placed = buildOptions(String(correct), [String(correct + 2), String(correct - 2), String(correct + 4)], (i + 1) % 4);
    out.push({ category: "Working Memory", question: `Compute quickly: ${a} x ${b} - ${c} + ${d} = ?`, options: placed.options, answer: placed.answer });
  }
  return out;
}

const EXTRA_QUESTIONS = [
  ...buildExtraLogicalQuestions(),
  ...buildExtraPatternTextQuestions(),
  ...buildExtraPatternVisualQuestions(),
  ...buildExtraMathQuestions(),
  ...buildExtraVerbalQuestions(),
  ...buildExtraSpatialQuestions(),
  ...buildExtraWorkingMemoryQuestions(),
];

export const QUESTION_BANK = [...BASE_QUESTION_BANK, ...EXTRA_QUESTIONS];

export function pickRandomQuestions() {
  const byCategory = {};
  QUESTION_BANK.forEach((q, idx) => {
    if (!byCategory[q.category]) byCategory[q.category] = [];
    byCategory[q.category].push({ ...q, id: idx });
  });

  const selected = [];
  const visualPool = QUESTION_BANK
    .map((q, idx) => ({ ...q, id: idx }))
    .filter(q => q.type === "visual")
    .sort(() => Math.random() - 0.5);
  selected.push(...visualPool.slice(0, Math.min(2, visualPool.length)));

  const cats = Object.keys(byCategory);
  const perCat = Math.floor(20 / cats.length);
  const extra = 20 - perCat * cats.length;

  cats.forEach(cat => {
    const alreadyInCat = selected.filter(q => q.category === cat).length;
    const needed = Math.max(0, perCat - alreadyInCat);
    const usedIds = new Set(selected.map(q => q.id));
    const pool = byCategory[cat]
      .filter(q => !usedIds.has(q.id))
      .sort(() => Math.random() - 0.5);
    selected.push(...pool.slice(0, needed));
  });

  const usedIds = new Set(selected.map(q => q.id));
  const remaining = QUESTION_BANK
    .filter((_, i) => !usedIds.has(i))
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.max(0, extra + (20 - selected.length)))
    .map((q, i) => ({ ...q, id: selected.length + i }));

  selected.push(...remaining);

  return selected
    .slice(0, 20)
    .sort(() => Math.random() - 0.5)
    .map((q, i) => {
      if (q.type === "visual") {
        const shuffled = shuffleWithAnswer(q.options, q.answer);
        return { ...q, options: shuffled.options, answer: shuffled.answer, id: i + 1 };
      }
      return { ...q, id: i + 1 };
    });
}

// All unique categories
export const ALL_CATEGORIES = [...new Set(QUESTION_BANK.map(q => q.category))];
