const { normalizeSigns } = require("./system");

// Fonction pour formater une équation en LaTeX
const systemToLatex = (coeff, result = '', red = [], green = [], blue = []) => {
    const getColor = (i, j) => {
        if (red.some(coord => coord.i === i && coord.j === j)) return "Red";
        if (green.some(coord => coord.i === i && coord.j === j)) return "DarkGreen";
        if (blue.some(coord => coord.i === i && coord.j === j)) return "Blue";
        return null;
    };

    let equations = '';
    
    for (let i = 0; i < coeff.length; i++) {
        let x = `${getColor(i, 0) ? `{\\color{${getColor(i, 0)}}` : ""}${normalizeSigns(coeff[i][0], 'x', '', true)}${getColor(i, 0) ? "}" : ""}`
        let y = `${getColor(i, 1) ? `{\\color{${getColor(i, 1)}}` : ""}${normalizeSigns(coeff[i][1], 'y', coeff[i][0])}${getColor(i, 1) ? "}" : ""}`
        let z = `${getColor(i, 2) ? `{\\color{${getColor(i, 2)}}` : ""}${normalizeSigns(coeff[i][2], 'z', coeff[i][0] + coeff[i][1])}${getColor(i, 2) ? "}" : ""}`
        equations += `${x} ${y} ${z} &= ${result[i]} \\\\ `;
    }

    return `\\begin{cases}
            ${equations}
            \\end{cases}`;
};

// Fonction pour afficher le pivot de gauss en latex
const gaussSystemToLatex = (coeff, result, red = [], green = [], blue = [], symbols = false) => {
    const getColor = (i, j) => {
        if (red.some(coord => coord.i === i && coord.j === j)) return "Red";
        if (green.some(coord => coord.i === i && coord.j === j)) return "DarkGreen";
        if (blue.some(coord => coord.i === i && coord.j === j)) return "Blue";
        return null;
    };

    let equations = '';
    for (let i = 0; i < 3; i++) {
        equations += `${getColor(i, 0) ? `{\\color{${getColor(i, 0)}}` : ""}${coeff[i][0]}${getColor(i, 0) ? "}" : ""}${symbols ? "x + " : " & "}` +
                     `${getColor(i, 1) ? `{\\color{${getColor(i, 1)}}` : ""}${coeff[i][1]}${getColor(i, 1) ? "}" : ""}${symbols ? "y + " : " & "}` +
                     `${getColor(i, 2) ? `{\\color{${getColor(i, 2)}}` : ""}${coeff[i][2]}${getColor(i, 2) ? "}" : ""}${symbols ? "z " : ""} & ` +
                     `\\vert & ${result[i]} \\\\ `;
    }

    return `\\begin{pmatrix}
            ${equations}
            \\end{pmatrix}`;
};

// Fonction pour formater une matrice en LaTeX
const matrixToLatex = (matrix) => {
    try {
        // Si c'est un tableau 2d
        return `\\begin{pmatrix}${matrix.map(row => row.join('&')).join('\\\\')}\\end{pmatrix}`;
    } catch {
        // Si c'est un tableau 1d
        return `\\begin{pmatrix}${matrix.join('\\\\')}\\end{pmatrix}`;
    }
};

const sousEspaceVectorielToLatex = (system) => {
    return `F = \\{{(x, y, z) \\in \\mathbb{R}^3 | ` +
    `${system.coefficients[0][0] === 1 ? '' : system.coefficients[0][0] === -1 ? '-' : system.coefficients[0][0]}x ` +
    `${system.coefficients[0][1] >= 0 ? '+' : ''}${system.coefficients[0][1] === 1 ? '' : system.coefficients[0][1] === -1 ? '-' : system.coefficients[0][1]}y ` +
    `${system.coefficients[0][2] >= 0 ? '+' : ''}${system.coefficients[0][2] === 1 ? '' : system.coefficients[0][2] === -1 ? '-' : system.coefficients[0][2]}z = ${system.results[0]}}\\}`;
}

const familyToLatex = (family) => {
    return `V = \\{${family.map((vector, i) => `v${i+1} = (${vector[0]}, ${vector[1]}, ${vector[2]})${i < family.length - 1 ? ', ' : ''}`).join('')}\\}`;
}

const combinaisonLineaireToLatex = (v1, v2, v3, w) => {
    return `v1 = (${v1.x}, ${v1.y}, ${v1.z}), v2 = (${v2.x}, ${v2.y}, ${v2.z}), v3 = (${v3.x}, ${v3.y}, ${v3.z}), w = (${w.x}, ${w.y}, ${w.z})`;
}

const applicationLineaireToLatex = (system) => {
    let x1, x2, x3, y1, y2, y3, z1, z2, z3;
    x1 = system.coefficients[0][0]
    y1 = system.coefficients[0][1]
    z1 = system.coefficients[0][2]

    x2 = system.coefficients[1][0]
    y2 = system.coefficients[1][1]
    z2 = system.coefficients[1][2]

    x3 = system.coefficients[2][0]
    y3 = system.coefficients[2][1]
    z3 = system.coefficients[2][2]
    return `
        \\forall (x,y,z) \\in \\mathbb{R}^3 : 
            \\left< f(x,y,z) = 
                ${normalizeSigns(x1, 'x', '', true)} ${normalizeSigns(y1, 'y', x1)} ${normalizeSigns(z1, 'z', y1)} \\:; \\:
                ${normalizeSigns(x2, 'x', '', true)} ${normalizeSigns(y2, 'y', x2)} ${normalizeSigns(z2, 'z', y2)} \\:; \\:
                ${normalizeSigns(x3, 'x', '', true)} ${normalizeSigns(y3, 'y', x3)} ${normalizeSigns(z3, 'z', y3)}
            \\right>`
};

module.exports = {
    systemToLatex, gaussSystemToLatex, matrixToLatex, sousEspaceVectorielToLatex, familyToLatex, combinaisonLineaireToLatex, applicationLineaireToLatex
}
