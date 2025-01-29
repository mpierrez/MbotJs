const { AttachmentBuilder } = require('discord.js');
const { generateMatrix, getMinor, determinant2x2, getCofactor } = require('../utils/matrix');
const { matrixToLatex } = require('../utils/latex');

module.exports = {
    name: "cofacteur",
    description: "Déterminer un cofacteur d'une matrice 3x3",

    async run(bot, interaction) {
        const matrix3x3 = generateMatrix(3);

        const i = Math.floor(Math.random() * 3) + 1;
        const j = Math.floor(Math.random() * 3) + 1;

        const minorMatrix = getMinor(matrix3x3, i, j);
        const minorDet = determinant2x2(minorMatrix);
        const cofactor = getCofactor(matrix3x3, i, j);

        // Enoncé de l'exercice
        const statement = `** Détermination d'un cofacteur d'une matrice 3x3**.
                            \nDéterminez le cofacteur C(${i}, ${j}) de la matrice M`;

        // Résultat de l'exercice
        const explanation = `\\begin{array}{c}
        \\text{-} \\\\\\\\
        \\text{Nous avons la matrice suivante :} \\\\
        ${matrixToLatex(matrix3x3)} \\\\\\\\
        
        \\text{En premier, nous allons calculer le mineur de l'élément situé à la ligne ${i} et la colonne ${j}.} \\\\\\\\
        \\text{Pour cela, nous allons enlever la ligne ${i} et la colonne ${j} de la matrice (on enlève les chiffres en rouge).} \\\\

        \\text{Cela nous donne la matrice suivante :} \\\\
        \\begin{bmatrix}
            ${i === 1 || j === 1 ? `{\\color{Red}${matrix3x3[0][0]}}` : matrix3x3[0][0]} & ${i === 1 || j === 2 ? `{\\color{Red}${matrix3x3[0][1]}}` : matrix3x3[0][1]} & ${i === 1 || j === 3 ? `{\\color{Red}${matrix3x3[0][2]}}` : matrix3x3[0][2]} \\\\
            ${i === 2 || j === 1 ? `{\\color{Red}${matrix3x3[1][0]}}` : matrix3x3[1][0]} & ${i === 2 || j === 2 ? `{\\color{Red}${matrix3x3[1][1]}}` : matrix3x3[1][1]} & ${i === 2 || j === 3 ? `{\\color{Red}${matrix3x3[1][2]}}` : matrix3x3[1][2]} \\\\
            ${i === 3 || j === 1 ? `{\\color{Red}${matrix3x3[2][0]}}` : matrix3x3[2][0]} & ${i === 3 || j === 2 ? `{\\color{Red}${matrix3x3[2][1]}}` : matrix3x3[2][1]} & ${i === 3 || j === 3 ? `{\\color{Red}${matrix3x3[2][2]}}` : matrix3x3[2][2]} \\\\
        \\end{bmatrix} \\\\\\\\
        
        \\text{Voici donc le mineur } M_{${i},${j}} \\\\
        \\begin{bmatrix}
            ${minorMatrix[0][0]} & ${minorMatrix[0][1]} \\\\
            ${minorMatrix[1][0]} & ${minorMatrix[1][1]} \\\\
        \\end{bmatrix} \\\\\\\\

        \\text{Calculons maintenant le déterminant de ce mineur.} \\\\\\\\
        \\text{Le déterminant d une matrice 2x2 est donné par la formule suivante :} \\\\
        \\text{det} = a_{1,1} * a_{2,2} - a_{1,2} * a_{2,1} \\\\\\\\
                
        \\text{Dans notre cas : } a_{1,1} = ${minorMatrix[0][0]}\\text{, } a_{2,2} = ${minorMatrix[1][1]}\\text{, } a_{1,2} = ${minorMatrix[0][1]}\\text{ et } a_{2,1} = ${minorMatrix[1][0]} \\\\
        \\text{Il ne reste plus qu à remplacer dans la formule :} \\\\
        D = ${minorMatrix[0][0]} * ${minorMatrix[1][1]} - ${minorMatrix[0][1]} * ${minorMatrix[1][0]} = ${minorDet} \\\\\\\\

        \\textbf{La déterminant du mineur (${i}, ${j}) est donc de ${minorDet}} \\\\\\\\

        \\text{Calculons maintenant le cofacteur grace a ce mineur} \\\\\\\\
        \\text{Le cofacteur est donné par la formule suivante :}\\\\
        C_{i,j} = (-1)^{i + j} * \\text{déterminant du mineur}\\\\\\\\
        \\text{Dans notre cas, i = ${i}, j = ${j} et le déterminant du mineur = ${minorDet}} \\\\
        \\text{Le cofacteur (${i}, ${j}) est donc de : } (-1)^{${i} + ${j}} * ${minorDet} = ${cofactor} \\\\\\\\
        \\textbf{Le cofacteur (${i}, ${j}) est donc de ${cofactor}} \\\\
        - \\\\
        \\end{array}`;

        // Génération des images
        const attachmentStatement = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;\\begin{align}M=${encodeURIComponent(matrixToLatex(matrix3x3))}\\end{align}`, { name: 'matrix.png' });
        const attachmentResult = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;${encodeURIComponent(explanation)}`, { name: 'SPOILER_explanation.png' });

        // Envoi de l'énoncé et de la solution à l'utilisateur
        await interaction.user.send({ content: statement, files: [attachmentStatement] });
        await interaction.user.send({ content: "**Solution détaillée :**", files: [attachmentResult] });
    }
};