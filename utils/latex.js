// Fonction pour formater une équation en LaTeX
const systemToLatex = (coeff, result, red = [], green = [], blue = []) => {
    const getColor = (i, j) => {
        if (red.some(coord => coord.i === i && coord.j === j)) return "Red";
        if (green.some(coord => coord.i === i && coord.j === j)) return "DarkGreen";
        if (blue.some(coord => coord.i === i && coord.j === j)) return "Blue";
        return null;
    };

    let equations = '';
    for (let i = 0; i < coeff.length; i++) {
        equations += `${getColor(i, 0) ? `{\\color{${getColor(i, 0)}}` : ""}${coeff[i][0] === 1 ? '' : coeff[i][0] === -1 ? '-' : coeff[i][0]}x${getColor(i, 0) ? "}" : ""} ` +
                     `${coeff[i][1] < 0 ? '-' : '+'} ${getColor(i, 1) ? `{\\color{${getColor(i, 1)}}` : ""}${Math.abs(coeff[i][1]) === 1 ? '' : Math.abs(coeff[i][1])}y${getColor(i, 1) ? "}" : ""} ` +
                     `${coeff[i][2] < 0 ? '-' : '+'} ${getColor(i, 2) ? `{\\color{${getColor(i, 2)}}` : ""}${Math.abs(coeff[i][2]) === 1 ? '' : Math.abs(coeff[i][2])}z${getColor(i, 2) ? "}" : ""} &= ${result[i]} \\\\ `;
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

module.exports = {
    systemToLatex, gaussSystemToLatex, matrixToLatex, sousEspaceVectorielToLatex, familyToLatex, combinaisonLineaireToLatex
}
