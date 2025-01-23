const generateMatrix = (size = 3) => {
    return Array.from({ length: size }, function() {
        return Array.from({ length: size }, function() {
            return Math.floor(Math.random() * 10);
        });
    });
};

const getMinor = (matrix, row, col) => {
    return matrix
        .filter((_, i) => i !== row)
        .map(row => row.filter((_, j) => j !== col));
};

// Fonction pour calculer le déterminant d'une matrice 2x2
const determinant2x2 = (matrix) => {
    const [[a, b], [c, d]] = matrix;
    return a * d - b * c;
};

// Fonction pour calculer le déterminant d'une matrice 3x3 par la règle de Sarrus
const determinantSarrus = (matrix) => {
    const [[a, b, c], [d, e, f], [g, h, i]] = matrix;
    return a * e * i + b * f * g + c * d * h - c * e * g - b * d * i - a * f * h;
};

// Fonction pour calculer le cofacteur d'un mineur
const getCofactor = (matrix, row, col) => {
    const minor = getMinor(matrix, row-1, col-1);
    console.log("Mineur " + row + " " + col + " : " + minor);
    const sign = (row + col) % 2 === 0 ? 1 : -1;
    return sign * determinant2x2(minor);
};

// Fonction pour additionner deux matrices 3x3
const addMatrices = (a, b) => 
    a.map((row, i) => 
        row.map((val, j) => val + b[i][j])
    );

 // Fonction pour multiplier deux matrices 3x3
 const multiplyMatrices = (a, b) => 
    a.map((row, i) => 
        row.map((_, j) => 
            row.reduce((sum, _, k) => sum + a[i][k] * b[k][j], 0)
        )
    );

module.exports = {
    generateMatrix, getMinor, determinant2x2, getCofactor, determinantSarrus, addMatrices, multiplyMatrices
};