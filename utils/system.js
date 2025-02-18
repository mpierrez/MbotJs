const { determinantSarrus } = require("./matrix");

// Fonction pour générer un système d'équations 3x3 avec des coefficients aléatoires
const generateSystem = (n, isResolvable=true) => {
    const coefficients = [];
    const results = [];

    // Valeurs entières aléatoires différentes pour x, y et z
    const x = Math.floor(Math.random() * 11) - 5; // x (entre -5 et 5)
    const y = Math.floor(Math.random() * 11) - 5; // y (entre -5 et 5)
    const z = Math.floor(Math.random() * 11) - 5; // z (entre -5 et 5)

    for (let i = 0; i < n; i++) {
        let a, b, c, result;
        do {
            // Générer des coefficients non nuls
            do {
                a = Math.floor(Math.random() * 11) - 5; // Coefficient pour x (entre -5 et 5)
            } while (a === 0);
            do {
                b = Math.floor(Math.random() * 11) - 5; // Coefficient pour y (entre -5 et 5)
            } while (b === 0);
            do {
                c = Math.floor(Math.random() * 11) - 5; // Coefficient pour z (entre -5 et 5)
            } while (c === 0);

            // Calculer le résultat et vérifier qu'il est dans la plage désirée
            result = a * x + b * y + c * z + (isResolvable ? 0 : 2);
        } while (Math.abs(result) > 30); // Répéter si le résultat est hors de la plage

        coefficients.push([a, b, c]); // Ajouter les coefficients de l'équation
        results.push(result); // Ajouter le résultat
    }

    return { coefficients, results };
};

// Fonction pour générer un système de manière aléatoire facile à résoudre
const generateEasySystem = (n = 3) => {
    let coefficients, results;
    let det = 0;
    let attempts = 0;  // Limiter les tentatives pour éviter boucle infinie

    while (det === 0 && attempts < 100) {
        coefficients = [];
        results = [];

        // Créer une solution aléatoire avec des entiers entre -5 et 5
        const solution = Array.from({ length: n }, () => Math.floor(Math.random() * 11) - 5);

        // Construire les lignes de la matrice
        for (let i = 0; i < n; i++) {
            let row = Array.from({ length: n }, () => 0);

            // Remplir la diagonale avec des entiers entre -3 et 3
            row[i] = Math.floor(Math.random() * 4) * 2;  // Coefficient diagonal entre -6 et 6 (pas de 1)

            // Remplir la partie hors diagonale avec des valeurs multiples de 2 ou 3
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    // Choisir des coefficients comme multiples de 2 ou 3
                    row[j] = Math.random() < 0.5 ? Math.floor(Math.random() * 3) * 2 : Math.floor(Math.random() * 3) * 3;
                }
            }

            // Calculer le résultat de l'équation (produit matriciel)
            const result = row.reduce((sum, coeff, idx) => sum + coeff * solution[idx], 0);

            coefficients.push(row);
            results.push(result);
        }

        // Vérifier que le déterminant est non nul (condition pour garantir une solution unique)
        det = coefficients.reduce((determinant, row, i) => determinant * row[i], 1);

        attempts++; // Augmenter le nombre de tentatives
    }

    if (attempts === 100) {
        throw new Error("Échec de la génération du système après plusieurs tentatives.");
    }

    return { coefficients, results };
};

// Fonction utilitaire pour créer une fraction simplifiée en chaîne
function toFraction(numerator, denominator) {
    if (numerator === 0) return "0";
    if (denominator === 1) return `${numerator}`;
    if (numerator === denominator) return "1";
    return `\\frac{${numerator}}{${denominator}}`;
}

// Fonction pour simplifier les fractions
function simplifyFraction(numerator, denominator) {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(numerator, denominator);
    return [numerator / divisor, denominator / divisor];
}

function pivotGauss(system) {
    const { coefficients, results } = system;
    let augmentedMatrix = coefficients.map((row, i) => [...row.map(x => [x, 1]), [results[i], 1]]);
    const n = augmentedMatrix.length;

    let step = 0;
    let phase = 0;

    function normalizeRow(i) {
        const [num, den] = augmentedMatrix[i][i];
        for (let j = 0; j < augmentedMatrix[i].length; j++) {
            const [n, d] = augmentedMatrix[i][j];
            augmentedMatrix[i][j] = simplifyFraction(n * den, d * num);
        }
    }

    function eliminateColumn(i) {
        for (let j = 0; j < n; j++) {
            if (j !== i) {
                const [factorNum, factorDen] = augmentedMatrix[j][i];
                for (let k = 0; k < augmentedMatrix[j].length; k++) {
                    const [pivotNum, pivotDen] = augmentedMatrix[i][k];
                    const [currentNum, currentDen] = augmentedMatrix[j][k];
                    
                    const newNum = currentNum * factorDen * pivotDen - factorNum * pivotNum * currentDen;
                    const newDen = currentDen * factorDen * pivotDen;
                    augmentedMatrix[j][k] = simplifyFraction(newNum, newDen);
                }
            }
        }
    }

    function copyMatrix() {
        return augmentedMatrix.map(row => row.map(([num, den]) => toFraction(num, den)));
    }

    return function() {
        if (step >= n) return null;

        if (phase === 0) {
            normalizeRow(step);
            phase = 1;
        } else if (phase === 1) {
            eliminateColumn(step);
            phase = 0;
            step++;
        }

        const currentMatrix = copyMatrix();
        return currentMatrix;
    };
}

const formatTerm = (coef, vector, color) => {
    if (coef === 0) return '';
    if (coef === 1) return `{\\color{${color}}\\begin{pmatrix} ${vector.x} \\\\ ${vector.y} \\\\ ${vector.z} \\end{pmatrix}}`;
    if (coef === -1) return `- {\\color{${color}}\\begin{pmatrix} ${vector.x} \\\\ ${vector.y} \\\\ ${vector.z} \\end{pmatrix}}`;
    return `${coef} * {\\color{${color}}\\begin{pmatrix} ${vector.x} \\\\ ${vector.y} \\\\ ${vector.z} \\end{pmatrix}}`;
};

const normalizeSigns = (coef, letter, lastCoeff = 0, isFirst = false) => {
    if(lastCoeff === 0) isFirst = true;
    if (coef == 0) return '';
    if (coef == 1) return `${isFirst ? '' : '+'}` + `${letter.startsWith('*') ? letter.slice(1) : letter}`;
    if (coef == -1) return (letter.startsWith('*')) ? `-${letter.slice(1)}` : `-${letter}`;
    if (coef > 1) return `${isFirst ? '' : '+'} ${coef}${letter}`;
    return `${coef}${letter}`;

};

module.exports = {
    generateSystem, pivotGauss, formatTerm, normalizeSigns, generateEasySystem
};