const generateSetProblem = () => {
    const regions = {};
    const keys = ['000', '001', '010', '011', '100', '101', '110', '111'];
    let total = 0;
    
    keys.forEach(k => {
        const val = Math.floor(Math.random() * 20) + 2; 
        regions[k] = val;
        total += val;
    });

    const getSum = (filterFn) => keys.reduce((acc, k) => filterFn(k) ? acc + regions[k] : acc, 0);

    const nA = getSum(k => k[0] === '1');
    const nB = getSum(k => k[1] === '1');
    const nC = getSum(k => k[2] === '1');
    
    const nAB = getSum(k => k[0] === '1' && k[1] === '1');
    const nAC = getSum(k => k[0] === '1' && k[2] === '1');
    const nBC = getSum(k => k[1] === '1' && k[2] === '1');
    
    const nABC = regions['111'];
    const nNone = regions['000'];

    const scenarios = [
        {
            name: "Classe de neige",
            A: "Ski alpin", B: "Luge", C: "Ski de fond",
            unit: "enfants", verb: "font"
        },
        {
            name: "Appareils ménagers",
            A: "Lave-linge", B: "Lave-vaisselle", C: "Sèche-linge",
            unit: "foyers", verb: "possèdent"
        },
        {
            name: "Langues",
            A: "Anglais", B: "Espagnol", C: "Allemand",
            unit: "étudiants", verb: "parlent"
        }
    ];
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const stepMap = {};
    const level0 = [];
    const level1 = [];
    
    const leafMap = {
        '000': 'A', '001': 'B', '010': 'C', '011': 'D',
        '100': 'E', '101': 'F', '110': 'G', '111': 'H'
    };

    const clues = [];
    let clueIdx = 0;
    const nextClueId = () => chars[clueIdx++] + '/';

    clues.push({
        id: nextClueId(),
        text: `${nABC} ${scenario.unit} ${scenario.verb} les trois (A, B et C).`,
        eq: 'H',
        val: nABC
    });

    clues.push({
        id: nextClueId(),
        text: `${nAB} ${scenario.unit} ${scenario.verb} ${scenario.A} et ${scenario.B}.`,
        eq: 'G + H',
        val: nAB
    });

    clues.push({
        id: nextClueId(),
        text: `${nAC} ${scenario.unit} ${scenario.verb} ${scenario.A} et ${scenario.C}.`,
        eq: 'F + H',
        val: nAC
    });

    clues.push({
        id: nextClueId(),
        text: `${nBC} ${scenario.unit} ${scenario.verb} ${scenario.B} et ${scenario.C}.`,
        eq: 'D + H',
        val: nBC
    });

    clues.push({
        id: nextClueId(),
        text: `${nA} ${scenario.unit} ${scenario.verb} ${scenario.A}.`,
        eq: 'E + F + G + H',
        val: nA
    });

    clues.push({
        id: nextClueId(),
        text: `${nB} ${scenario.unit} ${scenario.verb} ${scenario.B}.`,
        eq: 'C + D + G + H',
        val: nB
    });

    clues.push({
        id: nextClueId(),
        text: `${nC} ${scenario.unit} ${scenario.verb} ${scenario.C}.`,
        eq: 'B + D + F + H',
        val: nC
    });

    clues.push({
        id: nextClueId(),
        text: `${nNone} ${scenario.unit} ne ${scenario.verb} rien de tout cela.`,
        eq: 'A',
        val: nNone
    });

    const statement = clues.map(c => `${c.id} ${c.text}`);

    while(level0.length > 0) level0.pop();
    l0_idx = 0;

    clues.forEach(c => {
        level0.push({ id: c.id, text: `$${c.eq} = ${c.val}$` });
    });

    while(level1.length > 0) level1.pop();
    l1_idx = 0;
    
    clueIdx = 0;

    const solveOrder = ['H', 'G', 'F', 'D', 'E', 'C', 'B', 'A'];
    const letterToKey = {};
    Object.entries(leafMap).forEach(([k, v]) => letterToKey[v] = k);

    solveOrder.forEach(letter => {
        const key = letterToKey[letter];
        level1.push({ id: nextClueId(), text: `$${letter} = ${regions[key]}$` });
    });
    
    for (let k in stepMap) delete stepMap[k];
    
    solveOrder.forEach((letter, idx) => {
        const logicId = level1[idx].id.replace('/', '');
        const key = letterToKey[letter];
        stepMap[key] = logicId;
    });

    stepMap['nAB'] = clues.find(c => c.eq === 'G + H').id.replace('/', '');
    stepMap['nAC'] = clues.find(c => c.eq === 'F + H').id.replace('/', '');
    stepMap['nBC'] = clues.find(c => c.eq === 'D + H').id.replace('/', '');
    stepMap['nA']  = clues.find(c => c.eq === 'E + F + G + H').id.replace('/', '');
    stepMap['nB']  = clues.find(c => c.eq === 'C + D + G + H').id.replace('/', '');
    stepMap['nC']  = clues.find(c => c.eq === 'B + D + F + H').id.replace('/', '');
    stepMap['111'] = clues.find(c => c.eq === 'H').id.replace('/', '');
    stepMap['000'] = clues.find(c => c.eq === 'A').id.replace('/', '');


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

#let v000 = val_idx(${regions['000']}, "${stepMap['000']}")
#let v001 = val_idx(${regions['001']}, "${stepMap['001']}")
#let v010 = val_idx(${regions['010']}, "${stepMap['010']}")
#let v011 = val_idx(${regions['011']}, "${stepMap['011']}")
#let v100 = val_idx(${regions['100']}, "${stepMap['100']}")
#let v101 = val_idx(${regions['101']}, "${stepMap['101']}")
#let v110 = val_idx(${regions['110']}, "${stepMap['110']}")
#let v111 = val_idx(${regions['111']}, "${stepMap['111']}")

#let iAB = val_idx(${nAB}, "${stepMap['nAB']}")
#let iAC = val_idx(${nAC}, "${stepMap['nAC']}")
#let iBC = val_idx(${nBC}, "${stepMap['nBC']}")

#let iFullA = val_idx(${nA}, "${stepMap['nA']}")
#let iFullB = val_idx(${nB}, "${stepMap['nB']}")
#let iFullC = val_idx(${nC}, "${stepMap['nC']}")

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
         
         #leaf(l2X, l2Y_NN, 0, 1, ${regions['000']}, ${regions['001']}, "A", "B")
         #leaf(l2X, l2Y_NO, 2, 3, ${regions['010']}, ${regions['011']}, "C", "D")
         #leaf(l2X, l2Y_ON, 4, 5, ${regions['100']}, ${regions['101']}, "E", "F")
         #leaf(l2X, l2Y_OO, 6, 7, ${regions['110']}, ${regions['111']}, "G", "H")
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
            ${level0.map(s => `${s.id} ${s.text}`).join('\\ \n')}
         ],
         
         line(start: (0pt, 0pt), end: (0pt, 80%), stroke: 0.5pt + black),
         
         [
            #align(center)[#underline[*NIVEAU 1*]]
            #v(0.2cm)
            ${level1.map(s => `${s.id} ${s.text}`).join('\\ \n')}
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
            combined: generateCombinedSheet()
        }
    };

};

module.exports = { generateSetProblem };
