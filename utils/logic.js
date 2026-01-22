const generateSetProblem = () => {
  const regions = {};
  const keys = ["000", "001", "010", "011", "100", "101", "110", "111"];
  let total = 0;

  keys.forEach((k) => {
    const val = Math.floor(Math.random() * 20) + 2;
    regions[k] = val;
    total += val;
  });

  const getSum = (filterFn) =>
    keys.reduce((acc, k) => (filterFn(k) ? acc + regions[k] : acc), 0);

  const nA = getSum((k) => k[0] === "1");
  const nB = getSum((k) => k[1] === "1");
  const nC = getSum((k) => k[2] === "1");

  const nAB = getSum((k) => k[0] === "1" && k[1] === "1");
  const nAC = getSum((k) => k[0] === "1" && k[2] === "1");
  const nBC = getSum((k) => k[1] === "1" && k[2] === "1");

  const nABC = regions["111"];
  const nNone = regions["000"];

  const scenarios = [
    {
      name: "Classe de neige",
      A: "Ski alpin",
      B: "Luge",
      C: "Ski de fond",
      unit: "enfants",
      verb: "font",
    },
    {
      name: "Appareils ménagers",
      A: "Lave-linge",
      B: "Lave-vaisselle",
      C: "Sèche-linge",
      unit: "foyers",
      verb: "possèdent",
    },
    {
      name: "Langues",
      A: "Anglais",
      B: "Espagnol",
      C: "Allemand",
      unit: "étudiants",
      verb: "parlent",
    },
  ];
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const stepMap = {};
  const level0 = [];
  const level1 = [];

  const leafMap = {
    "000": "A",
    "001": "B",
    "010": "C",
    "011": "D",
    100: "E",
    101: "F",
    110: "G",
    111: "H",
  };

  const clues = [];
  let clueIdx = 0;
  const nextClueId = () => chars[clueIdx++] + ".";

  clues.push({
    id: nextClueId(),
    text: `${nABC} ${scenario.unit} ${scenario.verb} les trois.`,
    eq: "H",
    val: nABC,
  });

  clues.push({
    id: nextClueId(),
    text: `${nAB} ${scenario.unit} ${scenario.verb} ${scenario.A} et ${scenario.B}.`,
    eq: "G + H",
    val: nAB,
  });

  clues.push({
    id: nextClueId(),
    text: `${nAC} ${scenario.unit} ${scenario.verb} ${scenario.A} et ${scenario.C}.`,
    eq: "F + H",
    val: nAC,
  });

  clues.push({
    id: nextClueId(),
    text: `${nBC} ${scenario.unit} ${scenario.verb} ${scenario.B} et ${scenario.C}.`,
    eq: "D + H",
    val: nBC,
  });

  clues.push({
    id: nextClueId(),
    text: `${nA} ${scenario.unit} ${scenario.verb} ${scenario.A}.`,
    eq: "E + F + G + H",
    val: nA,
  });

  clues.push({
    id: nextClueId(),
    text: `${nB} ${scenario.unit} ${scenario.verb} ${scenario.B}.`,
    eq: "C + D + G + H",
    val: nB,
  });

  clues.push({
    id: nextClueId(),
    text: `${nC} ${scenario.unit} ${scenario.verb} ${scenario.C}.`,
    eq: "B + D + F + H",
    val: nC,
  });

  clues.push({
    id: nextClueId(),
    text: `${nNone} ${scenario.unit} ne ${scenario.verb} rien de tout cela.`,
    eq: "A",
    val: nNone,
  });

  const statement = clues.map((c) => `${c.id} ${c.text}`);

  while (level0.length > 0) level0.pop();
  l0_idx = 0;

  clues.forEach((c) => {
    level0.push({ id: c.id, text: `$${c.eq} = ${c.val}$` });
  });

  while (level1.length > 0) level1.pop();
  l1_idx = 0;

  clueIdx = 0;

  const solveOrder = ["H", "G", "F", "D", "E", "C", "B", "A"];
  const letterToKey = {};
  Object.entries(leafMap).forEach(([k, v]) => (letterToKey[v] = k));

  solveOrder.forEach((letter) => {
    const key = letterToKey[letter];
    level1.push({ id: nextClueId(), text: `$${letter} = ${regions[key]}$` });
  });

  for (let k in stepMap) delete stepMap[k];

  solveOrder.forEach((letter, idx) => {
    const logicId = level1[idx].id.replace("/", "");
    const key = letterToKey[letter];
    stepMap[key] = logicId;
  });

  stepMap["nAB"] = clues.find((c) => c.eq === "G + H").id.replace("/", "");
  stepMap["nAC"] = clues.find((c) => c.eq === "F + H").id.replace("/", "");
  stepMap["nBC"] = clues.find((c) => c.eq === "D + H").id.replace("/", "");
  stepMap["nA"] = clues
    .find((c) => c.eq === "E + F + G + H")
    .id.replace("/", "");
  stepMap["nB"] = clues
    .find((c) => c.eq === "C + D + G + H")
    .id.replace("/", "");
  stepMap["nC"] = clues
    .find((c) => c.eq === "B + D + F + H")
    .id.replace("/", "");
  stepMap["111"] = clues.find((c) => c.eq === "H").id.replace("/", "");
  stepMap["000"] = clues.find((c) => c.eq === "A").id.replace("/", "");

  const generateCombinedSheet = () => {
    return `
#set page(width: 35cm, height: auto, margin: 1cm)
#set text(font: "Roboto", size: 12pt)

#let val_idx(val, idx) = {
  box(inset: 2pt)[
    #stack(dir: ltr, spacing: 1pt,
      text(weight: "bold")[#val],
      move(dy: -2pt, box(circle(radius: 5pt, stroke: 0.5pt, inset: 0pt)[#align(center + horizon)[#text(size: 6pt)[#idx]]]))
    )
  ]
}

#let v000 = val_idx(${regions["000"]}, "${stepMap["000"]}")
#let v001 = val_idx(${regions["001"]}, "${stepMap["001"]}")
#let v010 = val_idx(${regions["010"]}, "${stepMap["010"]}")
#let v011 = val_idx(${regions["011"]}, "${stepMap["011"]}")
#let v100 = val_idx(${regions["100"]}, "${stepMap["100"]}")
#let v101 = val_idx(${regions["101"]}, "${stepMap["101"]}")
#let v110 = val_idx(${regions["110"]}, "${stepMap["110"]}")
#let v111 = val_idx(${regions["111"]}, "${stepMap["111"]}")

#let iAB = val_idx(${nAB}, "${stepMap["nAB"]}")
#let iAC = val_idx(${nAC}, "${stepMap["nAC"]}")
#let iBC = val_idx(${nBC}, "${stepMap["nBC"]}")

#let iFullA = val_idx(${nA}, "${stepMap["nA"]}")
#let iFullB = val_idx(${nB}, "${stepMap["nB"]}")
#let iFullC = val_idx(${nC}, "${stepMap["nC"]}")

#let nameA = "${scenario.A}"
#let nameB = "${scenario.B}"
#let nameC = "${scenario.C}"

#grid(
  columns: (1.2fr, 0.8fr),
  rows: (auto, auto),
  gutter: 0.5cm,
  
  // Tree
  [
    #align(center)[*Arbre de dénombrement*]
    #box(width: 100%, height: 10cm, stroke: 0.5pt + gray, radius: 5pt, inset: 5pt)[
      #block(width: 100%, height: 100%, inset: 5pt)[
         #let node(x, y, content) = {
            place(top + left, dx: x, dy: y, content)
            place(top + left, dx: x - 2pt, dy: y + 3pt, circle(radius: 2pt, fill: black))
         }
         #let link(x1, y1, x2, y2, label: none) = {
            place(top + left, line(start: (x1, y1), end: (x2, y2), stroke: 0.5pt))
            if label != none {
                place(top + left, dx: (x1+x2)/2 - 0.3cm, dy: (y1+y2)/2 - 0.4cm, text(size: 8pt, fill: black)[#label])
            }
         }
         
         #let rX = 0cm
         #let rY = 5cm
         
         #let l1X = 3.5cm
         #let l1Y_N = 2.0cm
         #let l1Y_O = 8.0cm
         
         #let l2X = 7cm
         #let l2Y_NN = 1.0cm
         #let l2Y_NO = 3.5cm
         #let l2Y_ON = 6.5cm
         #let l2Y_OO = 9.0cm
         
         #let l3X = 10.5cm
         
         #place(top + left, dx: (rX + l1X)/2 - 3cm, dy: 0cm, box(width: 6cm)[#align(center)[#text(fill: black, weight: "bold")[#upper(nameA)]]])
         #place(top + left, dx: (l1X + l2X)/2 - 3cm, dy: 0cm, box(width: 6cm)[#align(center)[#text(fill: black, weight: "bold")[#upper(nameB)]]])
         #place(top + left, dx: (l2X + l3X)/2 - 3cm, dy: 0cm, box(width: 6cm)[#align(center)[#text(fill: black, weight: "bold")[#upper(nameC)]]])

         #node(rX, rY)[]
         
         #link(rX, rY + 0.15cm, l1X, l1Y_N + 0.15cm, label: "Non")
         #node(l1X, l1Y_N)[]
         
         #link(rX, rY + 0.15cm, l1X, l1Y_O + 0.15cm, label: "Oui")
         #node(l1X, l1Y_O)[]
         
         #link(l1X, l1Y_N + 0.15cm, l2X, l2Y_NN + 0.15cm, label: "Non")
         #node(l2X, l2Y_NN)[]
         
         #link(l1X, l1Y_N + 0.15cm, l2X, l2Y_NO + 0.15cm, label: "Oui")
         #node(l2X, l2Y_NO)[]
         
         #link(l1X, l1Y_O + 0.15cm, l2X, l2Y_ON + 0.15cm, label: "Non")
         #node(l2X, l2Y_ON)[]
         
         #link(l1X, l1Y_O + 0.15cm, l2X, l2Y_OO + 0.15cm, label: "Oui")
         #node(l2X, l2Y_OO)[]
         
         #let leaf(parentX, parentY, i1, i2, val1, val2, l1, l2) = {
             let y1 = 0.5cm + i1 * 1.2cm
             let y2 = 0.5cm + i2 * 1.2cm
             
             link(parentX, parentY + 0.15cm, l3X, y1 + 0.15cm, label: "Non")
             place(top + left, dx: l3X + 0.2cm, dy: y1)[*#l1 =* #val1]
             
             link(parentX, parentY + 0.15cm, l3X, y2 + 0.15cm, label: "Oui")
             place(top + left, dx: l3X + 0.2cm, dy: y2)[*#l2 =* #val2]
         }
         
         #leaf(l2X, l2Y_NN, 0, 1, ${regions["000"]}, ${
           regions["001"]
         }, "A", "B")
         #leaf(l2X, l2Y_NO, 2, 3, ${regions["010"]}, ${
           regions["011"]
         }, "C", "D")
         #leaf(l2X, l2Y_ON, 4, 5, ${regions["100"]}, ${
           regions["101"]
         }, "E", "F")
         #leaf(l2X, l2Y_OO, 6, 7, ${regions["110"]}, ${
           regions["111"]
         }, "G", "H")
      ]
    ]
  ],

  // Karnaugh
  [
    #align(center)[*Table de Karnaugh*]
    #box(stroke: 1pt + black, inset: 10pt, radius: 5pt, width: 100%, height: 10cm)[
      #block(width: 100%, height: 100%, inset: 0pt)[        
        #let cw = 2.5cm
        #let rh = 1.5cm
        #let tm = 2.0cm
        #let lm = 2.0cm
        
        #let x0 = lm
        #let y0 = tm
        
        #let total_w = 4*cw
        #let total_h = 2*rh 
        
        #place(top + left, dx: x0, dy: y0, box(width: total_w, height: total_h, stroke: 0.5pt))
        
        #place(top + left, line(start: (x0 + cw, y0), end: (x0 + cw, y0 + total_h), stroke: 0.5pt))
        #place(top + left, line(start: (x0 + 2*cw, y0), end: (x0 + 2*cw, y0 + total_h), stroke: 0.5pt))
        #place(top + left, line(start: (x0 + 3*cw, y0), end: (x0 + 3*cw, y0 + total_h), stroke: 0.5pt))
        
        #place(top + left, line(start: (x0, y0 + rh), end: (x0 + total_w, y0 + rh), stroke: 0.5pt))
        #place(top + left, dx: x0 + 0*cw, dy: y0 + 0.5cm, box(width: cw)[#align(center)[#v110]])
        #place(top + left, dx: x0 + 1*cw, dy: y0 + 0.5cm, box(width: cw)[#align(center)[#v111]])
        #place(top + left, dx: x0 + 2*cw, dy: y0 + 0.5cm, box(width: cw)[#align(center)[#v011]])
        #place(top + left, dx: x0 + 3*cw, dy: y0 + 0.5cm, box(width: cw)[#align(center)[#v010]])
        
        #place(top + left, dx: x0 + 0*cw, dy: y0 + rh + 0.5cm, box(width: cw)[#align(center)[#v100]])
        #place(top + left, dx: x0 + 1*cw, dy: y0 + rh + 0.5cm, box(width: cw)[#align(center)[#v101]])
        #place(top + left, dx: x0 + 2*cw, dy: y0 + rh + 0.5cm, box(width: cw)[#align(center)[#v001]])
        #place(top + left, dx: x0 + 3*cw, dy: y0 + rh + 0.5cm, box(width: cw)[#align(center)[#v000]])
        
        #let top_start_x = x0
        #let top_end_x = x0 + 2*cw
        #let top_y = y0 - 0.2cm
        #place(top + left, line(start: (top_start_x, top_y), end: (top_end_x, top_y), stroke: 1pt))
        #place(top + left, line(start: (top_start_x, top_y), end: (top_start_x, top_y + 0.1cm), stroke: 1pt))
        #place(top + left, line(start: (top_end_x, top_y), end: (top_end_x, top_y + 0.1cm), stroke: 1pt))
        #place(top + left, dx: (top_start_x + top_end_x)/2 - 3cm, dy: top_y - 0.5cm, box(width: 6cm)[#align(center)[*#upper(nameA)*]])
        
        #let left_start_y = y0
        #let left_end_y = y0 + rh
        #let left_x = x0 - 0.3cm
        #place(top + left, line(start: (left_x, left_start_y), end: (left_x, left_end_y), stroke: 1pt))
        #place(top + left, line(start: (left_x, left_start_y), end: (left_x + 0.1cm, left_start_y), stroke: 1pt))
        #place(top + left, line(start: (left_x, left_end_y), end: (left_x + 0.1cm, left_end_y), stroke: 1pt))
        #place(top + left, dx: left_x - 6.5cm, dy: (left_start_y + left_end_y)/2 - 0.2cm, box(width: 6cm)[#align(right)[*#upper(nameB)*]])
        
        #let bot_start_x = x0 + cw
        #let bot_end_x = x0 + 3*cw
        #let bot_y = y0 + total_h + 0.2cm
        #place(top + left, line(start: (bot_start_x, bot_y), end: (bot_end_x, bot_y), stroke: 1pt))
        #place(top + left, line(start: (bot_start_x, bot_y), end: (bot_start_x, bot_y - 0.1cm), stroke: 1pt))
        #place(top + left, line(start: (bot_end_x, bot_y), end: (bot_end_x, bot_y - 0.1cm), stroke: 1pt))
        #place(top + left, dx: (bot_start_x + bot_end_x)/2 - 3cm, dy: bot_y + 0.1cm, box(width: 6cm)[#align(center)[*#upper(nameC)*]])

        // Intersections
        #place(top + left, dx: x0 + cw - 0.5cm, dy: y0 + 0.5*rh - 0.3cm, box(width: 1cm, fill: white, outset: 0pt)[#align(center)[#iAB]])        
        #place(top + left, dx: x0 + 2*cw - 0.5cm, dy: y0 + 0.5*rh - 0.3cm, box(width: 1cm, fill: white, outset: 0pt)[#align(center)[#iBC]])
        #place(top + left, dx: x0 + 1.5*cw - 0.5cm, dy: y0 + rh - 0.3cm, box(width: 1cm, fill: white, outset: 0pt)[#align(center)[#iAC]])

        // Full sets
        #place(top + left, dx: x0 + cw - 0.5cm, dy: y0 + rh - 0.3cm, box(width: 1cm, fill: white, outset: 0pt)[#align(center)[#iFullA]])        
        #place(top + left, dx: x0 + 2*cw - 0.5cm, dy: y0 + rh - 0.3cm, box(width: 1cm, fill: white, outset: 0pt)[#align(center)[#iFullC]])
        #place(top + left, dx: x0 - 0.5cm, dy: y0 + 0.5*rh - 0.3cm, box(width: 1cm, fill: white, outset: 0pt)[#align(center)[#iFullB]])

      ]
    ]
  ],

  // Logic Steps (level 0 et level 1)
  [
    #box(stroke: 1pt + black, inset: 10pt, radius: 5pt, width: 100%, height: 90%)[
      #set text(size: 11pt)
      #grid(
         columns: (1fr, 5pt, 1fr),         
         [
            #align(center)[#underline[*NIVEAU 0*]]
            #v(0.2cm)
            ${level0.map((s) => `${s.id} ${s.text}`).join("\\ \n")}
         ],
         
         line(start: (0pt, 0pt), end: (0pt, 80%), stroke: 0.5pt + black),
         
         [
            #align(center)[#underline[*NIVEAU 1*]]
            #v(0.2cm)
            ${level1.map((s) => `${s.id} ${s.text}`).join("\\ \n")}
         ]
      )
    ]
  ],

  // Venn
  [
      #align(center)[*Diagramme de Venn*]
      #box(stroke: 1pt + black, inset: 0pt, radius: 5pt, width: 100%, height: 9cm)[
        #let c_radius = 2.5cm
        #place(center + horizon)[
          #block(width: 100%, height: 100%)[
            #place(top + left, dx: 10pt, dy: 10pt)[Univers: *${total}*]
            
            #place(center + horizon, dx: -1.2cm, dy: -1cm)[ #circle(radius: c_radius, stroke: 2pt + red) ]
            #place(center + horizon, dx: 1.2cm, dy: -1cm)[ #circle(radius: c_radius, stroke: 2pt + green) ]
            #place(center + horizon, dx: 0cm, dy: 1.2cm)[ #circle(radius: c_radius, stroke: 2pt + blue) ]
            
            #place(center + horizon, dx: -2.0cm, dy: -3.8cm)[#text(fill: black, weight: "bold")[#nameA]]
            #place(center + horizon, dx: 2.0cm, dy: -3.8cm)[#text(fill: black, weight: "bold")[#nameB]]
            #place(center + horizon, dx: 0cm, dy: 4.2cm)[#text(fill: black, weight: "bold")[#nameC]]

            #place(center + horizon, dx: -2.6cm, dy: -1.3cm)[#v100]
            #place(center + horizon, dx: 2.6cm, dy: -1.3cm)[#v010]
            #place(center + horizon, dx: 0cm, dy: 2.8cm)[#v001]
            
            #place(center + horizon, dx: 0.15cm, dy: -2.1cm)[#v110]
            #place(center + horizon, dx: -1.8cm, dy: 0.6cm)[#v101]
            #place(center + horizon, dx: 1.8cm, dy: 0.6cm)[#v011]
            
            #place(center + horizon, dx: 0.15cm, dy: -0.2cm)[#v111]
            
            #place(bottom + right, dx: -1cm, dy: -1cm)[Aucun: #v000]

            // Intersections
            #place(center + horizon, dx: 0.15cm, dy: -1.3cm)[#box(fill: white, inset: 0pt)[#iAB]]
            #place(center + horizon, dx: -0.8cm, dy: 0.3cm)[#box(fill: white, inset: 0pt)[#iAC]]
            #place(center + horizon, dx: 1.1cm, dy: 0.3cm)[#box(fill: white, inset: 0pt)[#iBC]]

            // Full sets
            #place(center + horizon, dx: -1.15cm, dy: -1cm)[#box(fill: white, inset: 0pt)[#iFullA]]
            #place(center + horizon, dx: 1.5cm, dy: -1.0cm)[#box(fill: white, inset: 0pt)[#iFullB]]
            #place(center + horizon, dx: 0cm, dy: 1.2cm)[#box(fill: white, inset: 0pt)[#iFullC]]
          ]
       ]
     ]
  ]
)
        `;
  };

  return {
    scenario,
    statement,
    data: regions,
    typst: {
      combined: generateCombinedSheet(),
    },
  };
};

const generateGraphProblem = () => {
  const scenarios = [
    {
      left: ["Mr André", "Mr Bernard", "Mr Charles"],
      right: ["X", "Y", "Z"],
      intro: (l, r) =>
        `Trois professeurs ${l.join(
          ", ",
        )} devront donner lundi prochain un certain nombre d'heures de cours aux trois classes de Terminale ${r.join(
          ", ",
        )} :`,
      lineFragment: (dest, count) =>
        `${count} heure${count > 1 ? "s" : ""} à ${dest}`,
      lineStart: (actor) => `- ${actor} doit donner `,
      lineEmpty: (actor) => `- ${actor} ne donne aucun cours.`,
      objName: "Cours",
      timeName: "Heure",
    },
    {
      left: ["Michel", "Jean-Marc", "Pierre"],
      right: ["Machine A", "Machine B", "Machine C"],
      intro: (l, r) =>
        `Dans une usine, trois opérateurs ${l.join(
          ", ",
        )} doivent effectuer des maintenance sur trois machines ${r.join(
          ", ",
        )}.\nChaque maintenance dure 1 heure.\nVoici les besoins :`,
      lineFragment: (dest, count) => `${count} fois sur la ${dest}`,
      lineStart: (actor) => `- ${actor} doit intervenir `,
      lineEmpty: (actor) => `- ${actor} n'a aucune maintenance.`,
      objName: "Maintenances",
      timeName: "Créneau",
    },
    {
      left: ["Alice", "Bob", "Chloé"],
      right: ["Projet Alpha", "Projet Beta", "Projet Gamma"],
      intro: (l, r) =>
        `Trois freelances ${l.join(
          ", ",
        )} se répartissent des missions sur trois projets ${r.join(
          ", ",
        )}.\nUne mission correspond à une demi-journée de travail.\nVoici les besoins :`,
      lineFragment: (dest, count) =>
        `${count} mission${count > 1 ? "s" : ""} sur le ${dest}`,
      lineStart: (actor) => `- ${actor} a `,
      lineEmpty: (actor) => `- ${actor} n'a aucune mission.`,
      objName: "Missions",
      timeName: "Demi-journée",
    },
  ];

  const scenarioData = scenarios[Math.floor(Math.random() * scenarios.length)];
  const profs = scenarioData.left;
  const classes = scenarioData.right;
  const slotColors = ["blue", "red", "green", "orange", "purple", "fuchsia"];

  let matrix;
  let maxDeg = 0;

  do {
    matrix = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    let totalTasks = Math.floor(Math.random() * 5) + 5;

    for (let i = 0; i < totalTasks; i++) {
      const p = Math.floor(Math.random() * 3);
      const c = Math.floor(Math.random() * 3);
      matrix[p][c]++;
    }

    maxDeg = 0;
    for (let r = 0; r < 3; r++) {
      let s = matrix[r].reduce((a, b) => a + b, 0);
      if (s > maxDeg) maxDeg = s;
    }
    for (let c = 0; c < 3; c++) {
      let s = matrix[0][c] + matrix[1][c] + matrix[2][c];
      if (s > maxDeg) maxDeg = s;
    }
  } while (maxDeg < 3 || maxDeg > 5);

  let remaining = JSON.parse(JSON.stringify(matrix));
  let schedule = [];

  while (remaining.some((row) => row.some((v) => v > 0))) {
    let slotEdges = [];
    let usedC = new Set();

    let pDegs = remaining.map((row) => row.reduce((a, b) => a + b, 0));
    let cDegs = [0, 1, 2].map(
      (c) => remaining[0][c] + remaining[1][c] + remaining[2][c],
    );

    let pIndices = [0, 1, 2].sort((a, b) => pDegs[b] - pDegs[a]);

    for (let p of pIndices) {
      if (pDegs[p] === 0) continue;

      let possibleCs = [0, 1, 2].filter(
        (c) => remaining[p][c] > 0 && !usedC.has(c),
      );

      if (possibleCs.length > 0) {
        possibleCs.sort((a, b) => cDegs[b] - cDegs[a]);
        let chosenC = possibleCs[0];

        slotEdges.push({ p, c: chosenC });
        usedC.add(chosenC);
        remaining[p][chosenC]--;
      }
    }

    if (
      slotEdges.length === 0 &&
      remaining.some((row) => row.some((v) => v > 0))
    ) {
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (remaining[r][c] > 0) {
            slotEdges.push({ p: r, c });
            remaining[r][c]--;
            break;
          }
        }
        if (slotEdges.length > 0) break;
      }
    }

    schedule.push(slotEdges);
  }

  const statementLines = profs.map((prof, pIdx) => {
    let frags = [];
    classes.forEach((cls, cIdx) => {
      let h = matrix[pIdx][cIdx];
      if (h > 0) {
        frags.push(scenarioData.lineFragment(cls, h));
      }
    });
    if (frags.length === 0) return scenarioData.lineEmpty(prof);
    let text = frags.join(", ").replace(/, ([^,]*)$/, " et $1");
    return scenarioData.lineStart(prof) + text;
  });

  const scenario =
    scenarioData.intro(profs, classes) + "\n" + statementLines.join("\n");

  let allEdges = [];
  schedule.forEach((slotEdges, sIdx) => {
    slotEdges.forEach((e) => {
      allEdges.push({ p: e.p, c: e.c, slot: sIdx + 1 });
    });
  });

  let pairEdges = {};
  allEdges.forEach((e) => {
    let key = `${e.p}-${e.c}`;
    if (!pairEdges[key]) pairEdges[key] = [];
    pairEdges[key].push(e.slot);
  });

  const generateSolutionSheet = () => {
    return `
#set page(width: 25cm, height: auto, margin: 1cm)
#set text(font: "Roboto", size: 12pt)

#let radius_node = 0.6cm
#let dist_x = 8cm
#let dist_y = 3cm

#let draw_nodes() = {
    let names_p = ("${profs[0]}", "${profs[1]}", "${profs[2]}")
    let names_c = ("${classes[0]}", "${classes[1]}", "${classes[2]}")
    
    for i in (0, 1, 2) {
        place(top + left, dx: 0cm, dy: i * dist_y, 
            box(width: radius_node*2, height: radius_node*2, circle(radius: radius_node, stroke: 1pt, fill: white)[
                #align(center + horizon)[#text(size:10pt)[#names_p.at(i)]]
            ])
        )
        place(top + left, dx: dist_x, dy: i * dist_y, 
            box(width: radius_node*2, height: radius_node*2, circle(radius: radius_node, stroke: 1pt, fill: white)[
                #align(center + horizon)[#text(size:10pt)[#names_c.at(i)]]
            ])
        )
    }
}

#let draw_edges() = {
    ${Object.entries(pairEdges)
      .map(([key, slots]) => {
        const [p, c] = key.split("-").map(Number);
        const count = slots.length;

        const py = p * 3.0 + 0.6;
        const px = 0.6;
        const cy = c * 3.0 + 0.6;
        const cx = 8.0 + 0.6;

        const dx = cx - px;
        const dy = cy - py;
        const len = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / len;
        const uy = dy / len;

        const nx = -uy;
        const ny = ux;

        const spacing = 0.15;

        return slots
          .map((s, idx) => {
            const color = slotColors[s - 1] || "black";
            const offset = (idx - (count - 1) / 2) * spacing;

            const sx = px + offset * nx;
            const sy = py + offset * ny;
            const ex = cx + offset * nx;
            const ey = cy + offset * ny;

            return `place(top + left, line(start: (${sx.toFixed(
              2,
            )}cm, ${sy.toFixed(2)}cm), end: (${ex.toFixed(2)}cm, ${ey.toFixed(
              2,
            )}cm), stroke: (paint: ${color}, thickness: 2pt)))`;
          })
          .join("\n    ");
      })
      .join("\n    ")}
}

#let draw_legend() = {
    let colors = (blue, red, green, orange, purple, fuchsia)
    let labels = (${Array.from(
      { length: schedule.length },
      (_, i) => `"${scenarioData.timeName} ${i + 1}"`,
    ).join(", ")})
    
    for i in range(0, ${schedule.length}) {
       place(top + left, dy: i * 1cm, stack(dir: ltr, spacing: 5pt,
          line(length: 1cm, stroke: (paint: colors.at(i), thickness: 2pt)),
          text(size: 10pt)[#labels.at(i)]
       ))
    }
}

#block[
    #box(width: 100%, height: 10cm)[
        #place(left + horizon, dx: 2cm, draw_legend())
        
        #place(center + horizon, box(width: 10cm, height: 8cm)[
            #draw_edges()
            #draw_nodes()
        ])
    ]
]
#v(1cm)
*Il faudra donc ${
      schedule.length
    } plages horaires pour que cette situation soit possible.*

#v(0.5cm)
#text(size: 9pt, style: "italic")[
  Note : Les couleurs sont utilisées ici pour faciliter la lecture.
]

#text(size: 9pt, style: "italic")[
  La solution est correcte tant que le nombre de liaisons entre chaque élément correspond, peu importe les couleurs que vous avez choisies.
]

    `;
  };

  return {
    scenario,
    matrix,
    maxSlots: schedule.length,
    typst: {
      solution: generateSolutionSheet(),
    },
  };
};

const generatePrimProblem = () => {
  const nodes = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const numNodes = nodes.length;
  const radiusX = 5;
  const radiusY = 3.5;

  const nodePos = nodes.map((_, i) => {
    const angle = (2 * Math.PI * i) / numNodes;
    const jitterX = (Math.random() - 0.5) * 0.5;
    const jitterY = (Math.random() - 0.5) * 0.5;
    return {
      x: radiusX * Math.cos(angle) + jitterX + 7,
      y: radiusY * Math.sin(angle) + jitterY + 5,
      name: nodes[i],
    };
  });

  const edges = [];
  const addedEdges = new Set();

  const intersect = (a, b, c, d) => {
    const ccw = (p1, p2, p3) => {
      return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
    };
    return ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);
  };

  const doesEdgeIntersectAny = (uIdx, vIdx) => {
    const p1 = nodePos[uIdx];
    const p2 = nodePos[vIdx];

    for (let edge of edges) {
      if (
        edge.u === uIdx ||
        edge.u === vIdx ||
        edge.v === uIdx ||
        edge.v === vIdx
      ) {
        continue;
      }
      const p3 = nodePos[edge.u];
      const p4 = nodePos[edge.v];

      if (intersect(p1, p2, p3, p4)) {
        return true;
      }
    }
    return false;
  };

  const addEdge = (u, v, w) => {
    if (u === v) return false;
    const key = `${Math.min(u, v)}-${Math.max(u, v)}`;
    if (addedEdges.has(key)) return false;

    if (doesEdgeIntersectAny(u, v)) return false;

    edges.push({ u, v, w });
    addedEdges.add(key);
    return true;
  };

  for (let i = 0; i < numNodes; i++) {
    const nextNode = (i + 1) % numNodes;
    const key = `${Math.min(i, nextNode)}-${Math.max(i, nextNode)}`;
    edges.push({ u: i, v: nextNode, w: Math.floor(Math.random() * 40) + 10 });
    addedEdges.add(key);
  }

  let attempts = 0;
  while (edges.length < numNodes + 6 && attempts < 200) {
    attempts++;
    const u = Math.floor(Math.random() * numNodes);
    const v = Math.floor(Math.random() * numNodes);

    if (Math.abs(u - v) <= 1 || Math.abs(u - v) === numNodes - 1) continue;

    addEdge(u, v, Math.floor(Math.random() * 50) + 10);
  }

  let visited = new Set([0]);
  let mstEdges = [];
  let detailedSteps = [`Source = ${nodes[0]}`];
  let totalWeight = 0;

  while (visited.size < numNodes) {
    let minEdge = null;
    let minW = Infinity;
    let nextNode = -1;
    let fromNode = -1;

    for (let e of edges) {
      const uVis = visited.has(e.u);
      const vVis = visited.has(e.v);

      if (uVis && !vVis) {
        if (e.w < minW) {
          minW = e.w;
          minEdge = e;
          nextNode = e.v;
          fromNode = e.u;
        }
      } else if (!uVis && vVis) {
        if (e.w < minW) {
          minW = e.w;
          minEdge = e;
          nextNode = e.u;
          fromNode = e.v;
        }
      }
    }

    if (minEdge) {
      mstEdges.push(minEdge);
      visited.add(nextNode);
      totalWeight += minW;
      detailedSteps.push(`${nodes[fromNode]},${nodes[nextNode]} = ${minW}`);
    } else {
      break;
    }
  }

  detailedSteps.push(`\nSomme = ${totalWeight}`);

  const generateTypstContent = (showSolution) => {
    let content = "";

    edges.forEach((e) => {
      const u = nodePos[e.u];
      const v = nodePos[e.v];
      const isMst = showSolution && mstEdges.includes(e);

      let stroke = 'stroke: (paint: red, dash: "dashed", thickness: 1pt)';

      if (isMst) {
        stroke = 'stroke: (paint: blue, thickness: 4pt, cap: "round")';
      }

      content += `\n    #place(top + left, line(start: (${u.x}cm, ${u.y}cm), end: (${v.x}cm, ${v.y}cm), ${stroke}))`;

      const mx = (u.x + v.x) / 2;
      const my = (u.y + v.y) / 2;
      content += `\n    #place(top + left, dx: ${mx}cm - 0.4cm, dy: ${my}cm - 0.25cm, rect(fill: rgb("ffffffcc"), inset: 1pt, stroke: none)[#text(fill: maroon, weight: "bold")[${e.w}]])`;
    });

    nodePos.forEach((n) => {
      content += `\n    #place(top + left, dx: ${n.x}cm - 0.4cm, dy: ${n.y}cm - 0.4cm, circle(radius: 0.4cm, fill: red, stroke: none)[#align(center + horizon)[#text(fill: white, weight: "bold")[${n.name}]]])`;
    });

    return content;
  };

  const commonHeader = `
#set page(width: 20cm, height: 12cm, margin: 1cm)
#set text(font: "Roboto", size: 12pt)
`;

  const statement = `
${commonHeader}
#place(top + left, text(size: 16pt, weight: "bold")[Exercice : Algorithme de Prim])
#place(top + left, dy: 1cm)[Départ: *${nodes[0]}*]

#place(top + left, dy: 1cm, dx: 0cm, box(width: 100%, height: 100%)[
  ${generateTypstContent(false)}
])
  `;

  const solution = `
${commonHeader}
#grid(
    columns: (auto, 1fr),
    gutter: 1cm,
    [
        #text(size: 18pt, fill: blue)[*Prim*]
        #v(0.5cm)
        #stack(dir: ttb, spacing: 0.2cm,
            ${detailedSteps.map((s) => `text(11pt)[${s}]`).join(",\n            ")}
        )
    ],
    [
        #box(width: 100%, height: 100%)[
            ${generateTypstContent(true)}
        ]
    ]
)
  `;

  return {
    scenario:
      "Appliquez l'algorithme de Prim en partant du sommet donné sur l'image.",
    typst: {
      statement: statement,
      solution: solution,
    },
  };
};

const generateDijkstraProblem = () => {
  const nodes = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const activeNodes = nodes.slice(0, 7);
  const numNodes = activeNodes.length;
  const startNode = 0; // A

  const radiusX = 6;
  const radiusY = 4;

  let validScenario = null;
  let attempts = 0;

  // Wrap generation in a loop to ensure path length >= 3
  while (!validScenario && attempts < 100) {
    attempts++;

    // 1. Setup Data Structures
    const nodePos = activeNodes.map((_, i) => {
      const angle = (2 * Math.PI * i) / numNodes;
      const jitterX = (Math.random() - 0.5) * 0.5;
      const jitterY = (Math.random() - 0.5) * 0.5;
      return {
        x: radiusX * Math.cos(angle) + jitterX + 8,
        y: radiusY * Math.sin(angle) + jitterY + 6,
        name: activeNodes[i],
      };
    });

    const edges = [];
    const addedEdges = new Set();
    const adjacency = Array(numNodes)
      .fill(null)
      .map(() => []);

    const intersect = (a, b, c, d) => {
      const ccw = (p1, p2, p3) => {
        return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
      };
      return ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);
    };

    const doesEdgeIntersectAny = (uIdx, vIdx) => {
      const p1 = nodePos[uIdx];
      const p2 = nodePos[vIdx];
      for (let edge of edges) {
        if (
          edge.u === uIdx ||
          edge.u === vIdx ||
          edge.v === uIdx ||
          edge.v === vIdx
        )
          continue;
        const p3 = nodePos[edge.u];
        const p4 = nodePos[edge.v];
        if (intersect(p1, p2, p3, p4)) return true;
      }
      return false;
    };

    const addEdge = (u, v, w) => {
      if (u === v) return false;
      const key = `${Math.min(u, v)}-${Math.max(u, v)}`;
      if (addedEdges.has(key)) return false;

      // Allow slightly higher degree for central nodes if needed, but aim for 3 max
      if (adjacency[u].length >= 3 || adjacency[v].length >= 3) return false;

      if (doesEdgeIntersectAny(u, v)) return false;

      edges.push({ u, v, w });
      addedEdges.add(key);
      adjacency[u].push({ to: v, w });
      adjacency[v].push({ to: u, w });
      return true;
    };

    // 2. Generate Edges (Circle + Random)
    for (let i = 0; i < numNodes; i++) {
      const nextNode = (i + 1) % numNodes;
      const w = Math.floor(Math.random() * 20) + 5;
      edges.push({ u: i, v: nextNode, w });
      addedEdges.add(`${Math.min(i, nextNode)}-${Math.max(i, nextNode)}`);
      adjacency[i].push({ to: nextNode, w });
      adjacency[nextNode].push({ to: i, w });
    }

    let edgeAttempts = 0;
    while (edges.length < numNodes + 4 && edgeAttempts < 200) {
      edgeAttempts++;
      const u = Math.floor(Math.random() * numNodes);
      const v = Math.floor(Math.random() * numNodes);
      if (Math.abs(u - v) <= 1 || Math.abs(u - v) === numNodes - 1) continue;
      if (adjacency[u].length >= 3 || adjacency[v].length >= 3) continue;
      addEdge(u, v, Math.floor(Math.random() * 30) + 5);
    }

    // 3. Run Dijkstra to check path lengths
    const dist = Array(numNodes).fill(Infinity);
    const prev = Array(numNodes).fill(null);
    const visited = new Array(numNodes).fill(false);

    dist[startNode] = 0;

    const history = [];
    history.push({
      pivot: null,
      dists: [...dist],
      prevs: [...prev],
      closed: [...visited],
    });

    let remainingNodes = new Set(activeNodes.map((_, i) => i));

    while (remainingNodes.size > 0) {
      let u = -1;
      let minDist = Infinity;

      remainingNodes.forEach((nodeIdx) => {
        if (dist[nodeIdx] < minDist) {
          minDist = dist[nodeIdx];
          u = nodeIdx;
        }
      });

      if (u === -1) break;

      remainingNodes.delete(u);
      visited[u] = true;

      for (let edge of adjacency[u]) {
        const v = edge.to;
        if (visited[v]) continue;

        const newDist = dist[u] + edge.w;
        if (newDist < dist[v]) {
          dist[v] = newDist;
          prev[v] = u;
        }
      }

      history.push({
        pivot: u,
        dists: [...dist],
        prevs: [...prev],
        closed: [...visited],
      });
    }

    // 4. Check valid end nodes (hop count >= 3)
    const validEnds = [];
    for (let i = 1; i < numNodes; i++) {
      if (dist[i] === Infinity) continue;
      let hops = 0;
      let curr = i;
      while (curr !== startNode && curr !== null) {
        curr = prev[curr];
        hops++;
      }
      if (hops >= 3) {
        validEnds.push(i);
      }
    }

    if (validEnds.length > 0) {
      const endNode = validEnds[Math.floor(Math.random() * validEnds.length)];
      validScenario = {
        nodePos,
        edges,
        dist,
        prev,
        history,
        endNode,
      };
    }
  }

  // Fallback if loop fails (extremely unlikely given params)
  if (!validScenario) {
    // Just run once and take whatever
    // (omitted for brevity as 100 attempts on 7 nodes is plenty)
    return generateDijkstraProblem(); // Recursive retry as last resort
  }

  const { nodePos, edges, dist, prev, history, endNode } = validScenario;

  const path = [];
  let curr = endNode;
  if (dist[endNode] !== Infinity) {
    while (curr !== null) {
      path.unshift(curr);
      curr = prev[curr];
    }
  }

  const pathEdges = [];
  for (let i = 0; i < path.length - 1; i++) {
    const u = path[i];
    const v = path[i + 1];
    const edge = edges.find(
      (e) => (e.u === u && e.v === v) || (e.u === v && e.v === u),
    );
    if (edge) pathEdges.push(edge);
  }

  // --- Génération Typst ---

  const generateGraphTypst = (showSolution) => {
    let content = "";
    edges.forEach((e) => {
      const u = nodePos[e.u];
      const v = nodePos[e.v];
      const isPath = showSolution && pathEdges.includes(e);

      let stroke = 'stroke: (paint: gray, dash: "dashed", thickness: 1pt)';
      let weightColor = "maroon";
      let weightWeight = "regular";

      if (showSolution) {
        if (isPath) {
          stroke = "stroke: (paint: blue, thickness: 3pt)";
          weightColor = "blue";
          weightWeight = "bold";
        }
      } else {
        stroke = "stroke: (paint: red, thickness: 1pt)";
      }

      content += `\n    #place(top + left, line(start: (${u.x}cm, ${u.y}cm), end: (${v.x}cm, ${v.y}cm), ${stroke}))`;

      const mx = (u.x + v.x) / 2;
      const my = (u.y + v.y) / 2;
      content += `\n    #place(top + left, dx: ${mx}cm - 0.4cm, dy: ${my}cm - 0.25cm, rect(fill: rgb("ffffffdd"), inset: 1pt, stroke: none)[#text(fill: ${weightColor}, weight: "${weightWeight}")[${e.w}]])`;
    });

    nodePos.forEach((n, i) => {
      let fill = "white";
      let stroke = "2pt + red";
      if (showSolution) {
        if (path.includes(i)) {
          fill = 'rgb("e6f0ff")';
          stroke = "2pt + blue";
        } else {
          stroke = "1pt + gray";
        }
      }
      content += `\n    #place(top + left, dx: ${n.x}cm - 0.4cm, dy: ${n.y}cm - 0.4cm, circle(radius: 0.4cm, fill: ${fill}, stroke: ${stroke})[#align(center + horizon)[*${n.name}*]])`;
    });
    return content;
  };

  const generateTableTypst = () => {
    let header = `[], ${activeNodes.map((n) => `[*${n}*]`).join(", ")}`;
    let displayRows = history.slice(0, -1);

    let rows = displayRows
      .map((step, stepIdx) => {
        let cells = [];

        if (stepIdx === 0) {
          cells.push(`[*${activeNodes[startNode]}*]`);
        } else {
          const labelPivot = history[stepIdx + 1]
            ? history[stepIdx + 1].pivot
            : step.pivot;
          cells.push(`[*${activeNodes[labelPivot]}*]`);
        }

        let nextPivot = -1;
        let minVal = Infinity;

        activeNodes.forEach((_, idx) => {
          if (!step.closed[idx] && step.dists[idx] < minVal) {
            minVal = step.dists[idx];
            nextPivot = idx;
          }
        });

        activeNodes.forEach((_, nodeIdx) => {
          const isClosed = step.closed[nodeIdx];

          if (isClosed) {
            cells.push(`[X]`);
          } else {
            const d = step.dists[nodeIdx];
            const p =
              step.prevs[nodeIdx] !== null
                ? activeNodes[step.prevs[nodeIdx]]
                : "";

            let valStr =
              d === Infinity ? "$infinity$" : p ? `${d} ${p}` : `${d}`;

            if (nodeIdx === nextPivot) {
              cells.push(
                `box(stroke: 1pt + blue, inset: 4pt, radius: 2pt)[*${valStr}*]`,
              );
            } else {
              cells.push(`[${valStr}]`);
            }
          }
        });
        return cells.join(", ");
      })
      .join(",\n");

    return `
    #table(
        columns: ${numNodes + 1},
        align: center + horizon,
        stroke: 0.5pt + gray,
        inset: 8pt,
        ${header},
        ${rows}
    )
    `;
  };

  const commonHeader = `
#set page(width: 20cm, height: auto, margin: 1cm)
#set text(font: "Roboto", size: 11pt)
`;

  const statement = `
${commonHeader}
#place(top + left, text(size: 16pt, weight: "bold")[Exercice : Algorithme de Dijkstra])
#v(1cm)
Trouver le plus court chemin de *${activeNodes[startNode]}* à *${activeNodes[endNode]}*.

#v(0.5cm)
#box(width: 100%, height: 12cm, stroke: 1pt + black, radius: 5pt)[
  ${generateGraphTypst(false)}
]
`;

  const solution = `
${commonHeader}
#text(size: 16pt, fill: blue, weight: "bold")[Solution Dijkstra]

#stack(
  dir: ttb,
  spacing: 0.5cm,
  [
     *Graphe résolu :*
     #v(0.2cm)
     #box(width: 100%, height: 12cm, stroke: 0.5pt + gray, radius: 5pt)[
        ${generateGraphTypst(true)}
     ]
  ],
  [
     *Chemin final : ${path.map((i) => activeNodes[i]).join(" -> ")}* \
     *Coût total : ${dist[endNode]}*
  ],
  [
     #align(center)[
        *Tableau des itérations :*
        #v(0.2cm)
        ${generateTableTypst()}
     ]
  ]
)
`;

  return {
    scenario: "Appliquez l'algorithme de Dijkstra sur le graphe suivant :",
    typst: {
      statement,
      solution,
    },
  };
};

const generateKruskalProblem = () => {
  const nodes = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const numNodes = nodes.length;
  // Layout similar to Prim/Dijkstra
  const radiusX = 6;
  const radiusY = 4;

  const nodePos = nodes.map((_, i) => {
    const angle = (2 * Math.PI * i) / numNodes;
    const jitterX = (Math.random() - 0.5) * 0.5;
    const jitterY = (Math.random() - 0.5) * 0.5;
    return {
      x: radiusX * Math.cos(angle) + jitterX + 8,
      y: radiusY * Math.sin(angle) + jitterY + 6,
      name: nodes[i],
    };
  });

  const edges = [];
  const addedEdges = new Set();

  // Reuse intersection logic
  const intersect = (a, b, c, d) => {
    const ccw = (p1, p2, p3) => {
      return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
    };
    return ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);
  };

  const doesEdgeIntersectAny = (uIdx, vIdx) => {
    const p1 = nodePos[uIdx];
    const p2 = nodePos[vIdx];
    for (let edge of edges) {
      if (
        edge.u === uIdx ||
        edge.u === vIdx ||
        edge.v === uIdx ||
        edge.v === vIdx
      )
        continue;
      const p3 = nodePos[edge.u];
      const p4 = nodePos[edge.v];
      if (intersect(p1, p2, p3, p4)) return true;
    }
    return false;
  };

  const addEdge = (u, v, w) => {
    if (u === v) return false;
    const key = `${Math.min(u, v)}-${Math.max(u, v)}`;
    if (addedEdges.has(key)) return false;
    if (doesEdgeIntersectAny(u, v)) return false;
    edges.push({ u, v, w });
    addedEdges.add(key);
    return true;
  };

  // Build Graph
  // 1. Circle
  for (let i = 0; i < numNodes; i++) {
    const nextNode = (i + 1) % numNodes;
    addEdge(i, nextNode, Math.floor(Math.random() * 40) + 10);
  }
  // 2. Internal edges
  let attempts = 0;
  while (edges.length < numNodes + 6 && attempts < 200) {
    attempts++;
    const u = Math.floor(Math.random() * numNodes);
    const v = Math.floor(Math.random() * numNodes);
    if (Math.abs(u - v) <= 1 || Math.abs(u - v) === numNodes - 1) continue;
    addEdge(u, v, Math.floor(Math.random() * 50) + 10);
  }

  // --- Solve Kruskal ---
  // Sort edges by weight
  const sortedEdges = [...edges].sort((a, b) => a.w - b.w);
  const mstEdges = [];
  const steps = [];
  let totalWeight = 0;
  let edgesCount = 0;

  // Distinct colors for the steps
  const stepColors = [
    "blue",
    "red",
    "green",
    "orange",
    "purple",
    "fuchsia",
    "teal",
    "olive",
  ];

  // Union-Find
  const parent = Array.from({ length: numNodes }, (_, i) => i);
  const find = (i) => {
    if (parent[i] === i) return i;
    return (parent[i] = find(parent[i]));
  };
  const union = (i, j) => {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      parent[rootI] = rootJ;
      return true;
    }
    return false;
  };

  let continueLoop = true;
  for (let i = 0; i < sortedEdges.length; i++) {
    const edge = sortedEdges[i];

    if (edgesCount === numNodes - 1 && continueLoop) {
      steps.push({
        type: "stop",
        text: `🛑 STOP 🛑\n${numNodes - 1} arêtes validées\n(${nodes.length} sommets)`,
      });
      continueLoop = false;
    }

    const added = union(edge.u, edge.v);
    if (added) {
      const color = stepColors[edgesCount % stepColors.length];
      mstEdges.push({ ...edge, order: edgesCount, color });
      steps.push({
        type: continueLoop ? "edge" : "skip",
        edge,
        added: true,
        color,
        order: edgesCount + 1,
      });
      totalWeight += edge.w;
      edgesCount++;
    } else {
      steps.push({ type: continueLoop ? "edge" : "skip", edge, added: false });
    }
  }

  // --- Typst ---
  const generateGraphTypst = (showSolution) => {
    let content = "";
    edges.forEach((e) => {
      const u = nodePos[e.u];
      const v = nodePos[e.v];

      // Check if e is in mstEdges (match by props usually safe here as edges objects are stable)
      // Actually spread operator above created copies in mstEdges.
      const mstEdge = mstEdges.find(
        (me) => me.u === e.u && me.v === e.v && me.w === e.w,
      );

      let stroke = 'stroke: (paint: gray, dash: "dashed", thickness: 1pt)';
      let weightColor = "maroon";
      let weightWeight = "regular";

      if (showSolution) {
        if (mstEdge) {
          stroke = `stroke: (paint: ${mstEdge.color}, thickness: 3pt)`;
          weightColor = mstEdge.color;
          weightWeight = "bold";
        }
      } else {
        stroke = 'stroke: (paint: red, dash: "dashed", thickness: 1pt)';
      }

      content += `\n    #place(top + left, line(start: (${u.x}cm, ${u.y}cm), end: (${v.x}cm, ${v.y}cm), ${stroke}))`;

      const mx = (u.x + v.x) / 2;
      const my = (u.y + v.y) / 2;

      content += `\n    #place(top + left, dx: ${mx}cm - 0.4cm, dy: ${my}cm - 0.25cm, rect(fill: rgb("ffffffdd"), inset: 1pt, stroke: none)[#text(fill: ${weightColor}, weight: "${weightWeight}")[${e.w}]])`;
    });

    nodePos.forEach((n) => {
      content += `\n    #place(top + left, dx: ${n.x}cm - 0.4cm, dy: ${n.y}cm - 0.4cm, circle(radius: 0.4cm, fill: white, stroke: 1pt + black)[#align(center + horizon)[*${n.name}*]])`;
    });
    return content;
  };

  const stepsList = steps
    .map((s) => {
      if (s.type === "stop") {
        return `text(fill: red, weight: "bold")[${s.text}]`;
      }
      const uName = nodes[s.edge.u];
      const vName = nodes[s.edge.v];
      if (s.added) {
        return `text(fill: ${s.color})[${uName}-${vName} = ${s.edge.w} : ✓]`;
      } else if (s.type === "edge") {
        return `text(fill: gray)[${uName}-${vName} = ${s.edge.w} : ✗ (cycle)]`;
      } else if (s.type === "skip") {
        return `text(fill: gray)[${uName}-${vName} = ${s.edge.w} : ✗ (stop)]`;
      }
    })
    .join(",\n");

  const commonHeader = `
#set page(width: 20cm, height: auto, margin: 1cm)
#set text(font: "Roboto", size: 11pt)
`;

  const statement = `
${commonHeader}
#place(top + left, text(size: 16pt, weight: "bold")[Exercice : Algorithme de Kruskal])
#v(1cm)
Trouver l'Arbre Couvrant Minimum (ACM) en utilisant l'algorithme de Kruskal.

#v(0.5cm)
#box(width: 100%, height: 12cm, stroke: 1pt + black, radius: 5pt)[
  ${generateGraphTypst(false)}
]
`;

  const solution = `
${commonHeader}
#text(size: 16pt, fill: blue, weight: "bold")[Solution Kruskal]

#grid(
  columns: (1fr, 4fr),
  gutter: 0.5cm,
  [
      *Étapes (ordre croissant) :*
      #v(0.2cm)
      #stack(dir: ttb, spacing: 0.2cm, 
        ${stepsList}
      )
      #v(0.5cm)
      *Poids total = ${totalWeight}*
  ],
  [
      *Graphe final :*
      #v(0.2cm)
      #box(width: 100%, height: 12cm, stroke: 0.5pt + gray, radius: 5pt)[
        ${generateGraphTypst(true)}
     ]
  ]
)
`;

  return {
    scenario: "Appliquez l'algorithme de Kruskal sur le graphe suivant.",
    typst: {
      statement,
      solution,
    },
  };
};

module.exports = {
  generateSetProblem,
  generateGraphProblem,
  generatePrimProblem,
  generateDijkstraProblem,
  generateKruskalProblem,
};
