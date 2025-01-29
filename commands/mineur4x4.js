const { AttachmentBuilder } = require('discord.js');
const { generateMatrix, getMinor } = require('../utils/matrix');
const { matrixToLatex } = require('../utils/latex');

module.exports = {
    name: "mineur4x4",
    description: "Déterminer le mineur d'une matrice 4x4 et calculer son déterminant",

    async run(bot, interaction) {
        const matrix4x4 = generateMatrix(4);

        const i = Math.floor(Math.random() * 4) + 1;
        const j = Math.floor(Math.random() * 4) + 1;

        const minorMatrix = getMinor(matrix4x4, i, j);

        const sumRed = minorMatrix[0][0] * minorMatrix[1][1] * minorMatrix[2][2];
        const sumGreen = minorMatrix[1][0] * minorMatrix[2][1] * minorMatrix[0][2];
        const sumBlue = minorMatrix[2][0] * minorMatrix[0][1] * minorMatrix[1][2];

        const sumRed2 = minorMatrix[2][0] * minorMatrix[1][1] * minorMatrix[0][2];
        const sumGreen2 = minorMatrix[0][0] * minorMatrix[2][1] * minorMatrix[1][2];
        const sumBlue2 = minorMatrix[1][0] * minorMatrix[0][1] * minorMatrix[2][2];
        
        const sum = sumRed + sumGreen + sumBlue;
        const sum2 = sumRed2 + sumGreen2 + sumBlue2;

        // Enoncé de l'exercice
        const statement = `** Détermination et calcul du mineur d'une matrice 4x4**.
                            \nDéterminez le mineur (${i}, ${j}) de la matrice M et calculez son déterminant.`;


        // Résultat de l'exercice
        const explanation = `\\begin{array}{c}
        \\text{-} \\\\\\\\
        \\text{Nous avons la matrice suivante :} \\\\
        ${matrixToLatex(matrix4x4)} \\\\\\\\
        
        \\text{Nous allons calculer le mineur de l'\\'{e}l\\'{e}ment situ\\'{e} \\\`{a} la ligne ${i} et la colonne ${j}.} \\\\\\\\
        \\text{Pour cela, nous allons enlever la ligne ${i} et la colonne ${j} de la matrice (on enl\\\`{e}ve les chiffres en rouge).} \\\\

        \\text{Cela nous donne la matrice suivante :} \\\\
        \\begin{bmatrix}
            ${i === 1 || j === 1 ? `{\\color{Red}${matrix4x4[0][0]}}` : matrix4x4[0][0]} & ${i === 1 || j === 2 ? `{\\color{Red}${matrix4x4[0][1]}}` : matrix4x4[0][1]} & ${i === 1 || j === 3 ? `{\\color{Red}${matrix4x4[0][2]}}` : matrix4x4[0][2]} & ${i === 1 || j === 4 ? `{\\color{Red}${matrix4x4[0][3]}}` : matrix4x4[0][3]} \\\\
            ${i === 2 || j === 1 ? `{\\color{Red}${matrix4x4[1][0]}}` : matrix4x4[1][0]} & ${i === 2 || j === 2 ? `{\\color{Red}${matrix4x4[1][1]}}` : matrix4x4[1][1]} & ${i === 2 || j === 3 ? `{\\color{Red}${matrix4x4[1][2]}}` : matrix4x4[1][2]} & ${i === 2 || j === 4 ? `{\\color{Red}${matrix4x4[1][3]}}` : matrix4x4[1][3]} \\\\
            ${i === 3 || j === 1 ? `{\\color{Red}${matrix4x4[2][0]}}` : matrix4x4[2][0]} & ${i === 3 || j === 2 ? `{\\color{Red}${matrix4x4[2][1]}}` : matrix4x4[2][1]} & ${i === 3 || j === 3 ? `{\\color{Red}${matrix4x4[2][2]}}` : matrix4x4[2][2]} & ${i === 3 || j === 4 ? `{\\color{Red}${matrix4x4[2][3]}}` : matrix4x4[2][3]} \\\\
            ${i === 4 || j === 1 ? `{\\color{Red}${matrix4x4[3][0]}}` : matrix4x4[3][0]} & ${i === 4 || j === 2 ? `{\\color{Red}${matrix4x4[3][1]}}` : matrix4x4[3][1]} & ${i === 4 || j === 3 ? `{\\color{Red}${matrix4x4[3][2]}}` : matrix4x4[3][2]} & ${i === 4 || j === 4 ? `{\\color{Red}${matrix4x4[3][3]}}` : matrix4x4[3][3]} \\\\
        \\end{bmatrix} \\\\\\\\
        
        \\text{Voici donc le mineur } M_{${i},${j}} \\\\
        \\begin{bmatrix}
            ${minorMatrix[0][0]} & ${minorMatrix[0][1]} & ${minorMatrix[0][2]} \\\\
            ${minorMatrix[1][0]} & ${minorMatrix[1][1]} & ${minorMatrix[1][2]} \\\\
            ${minorMatrix[2][0]} & ${minorMatrix[2][1]} & ${minorMatrix[2][2]} \\\\
        \\end{bmatrix} \\\\\\\\

        \\text{Calculons maintenant le d\\'{e}terminant de ce mineur.} \\\\\\\\
        \\text{Il y a plusieurs façons de calculer le d\\'{e}terminant d'une matrice 3x3, je vais personnellement utiliser la m\\'{e}thode de Sarrus.} \\\\
        
                \\text{Tout d'abord, nous allons r\\'{e}\\'{e}crire notre matrice et y ajouter les \\textbf{DEUX premi\\\`{e}res lignes} \\\`{a} la \\textbf{fin de la matrice}.} \\\\
    
        \\begin{vmatrix}
        {${minorMatrix[0][0]}} & ${minorMatrix[0][1]} & ${minorMatrix[0][2]} \\\\
        {${minorMatrix[1][0]}} & {${minorMatrix[1][1]}} & ${minorMatrix[1][2]} \\\\
        {${minorMatrix[2][0]}} & {${minorMatrix[2][1]}} & {${minorMatrix[2][2]}} \\\\
        \\textbf{${minorMatrix[0][0]}} & \\textbf{{${minorMatrix[0][1]}}} & \\textbf{{${minorMatrix[0][2]}}} \\\\
        \\textbf{${minorMatrix[1][0]}} & \\textbf{${minorMatrix[1][1]}} & \\textbf{{${minorMatrix[1][2]}}} \\\\
        \\end{vmatrix} \\\\\\\\

        \\text{On va ensuite mettre en \\'{e}vidence les couleurs des \\textbf{diagonales de gauche \\\`{a} droite} de la matrice.} \\\\

        \\begin{vmatrix}
        {\\color{Red} ${minorMatrix[0][0]}} & ${minorMatrix[0][1]} & ${minorMatrix[0][2]} \\\\
        {\\color{DarkGreen} ${minorMatrix[1][0]}} & {\\color{Red} ${minorMatrix[1][1]}} & ${minorMatrix[1][2]} \\\\
        {\\color{Blue} ${minorMatrix[2][0]}} & {\\color{DarkGreen} ${minorMatrix[2][1]}} & {\\color{Red} ${minorMatrix[2][2]}} \\\\
        ${minorMatrix[0][0]} & {\\color{Blue} ${minorMatrix[0][1]}} & {\\color{DarkGreen} ${minorMatrix[0][2]}} \\\\
        ${minorMatrix[1][0]} & ${minorMatrix[1][1]} & {\\color{Blue} ${minorMatrix[1][2]}} \\\\
        \\end{vmatrix} \\\\\\\\

        \\text{Nous allons commencer par les multiplications des \\'{e}l\\'{e}ments suivant les couleurs \\textbf{de gauche \\\`{a} droite} (suivez les couleurs).} \\\\
        \\text{On commence par la \\textbf{diagonale rouge} : (${minorMatrix[0][0]} × ${minorMatrix[1][1]} × ${minorMatrix[2][2]} = ${sumRed})} \\\\
        \\text{On passe ensuite \\\`{a} la \\textbf{diagonale verte} : (${minorMatrix[1][0]} × ${minorMatrix[2][1]} × ${minorMatrix[0][2]} = ${sumGreen})} \\\\
        \\text{Enfin, on passe \\\`{a} la \\textbf{diagonale bleue} : (${minorMatrix[2][0]} × ${minorMatrix[0][1]} × ${minorMatrix[1][2]} = ${sumBlue})} \\\\
        \\text{Une fois les diagonales finies, nous allons additionner les trois r\\'{e}sultats obtenus : (${sumRed} + ${sumGreen} + ${sumBlue} = ${sum})} \\\\\\\\
    
        \\text{Ensuite, nous allons r\\'{e}p\\'{e}ter le processus, mais cette fois-ci, nous allons multiplier de \\textbf{droite \\\`{a} gauche}. Concentrons-nous \\\`{a} nouveau sur les couleurs :} \\\\
        
        \\begin{vmatrix}
        ${minorMatrix[0][0]} & ${minorMatrix[0][1]} & {\\color{Red} ${minorMatrix[0][2]}} \\\\
        ${minorMatrix[1][0]} & {\\color{Red} ${minorMatrix[1][1]}} & {\\color{DarkGreen} ${minorMatrix[1][2]}} \\\\
        {\\color{Red} ${minorMatrix[2][0]}} & {\\color{DarkGreen} ${minorMatrix[2][1]}} & {\\color{Blue} ${minorMatrix[2][2]}} \\\\
        {\\color{DarkGreen} ${minorMatrix[0][0]}} & {\\color{Blue} ${minorMatrix[0][1]}} & ${minorMatrix[0][2]} \\\\
        {\\color{Blue} ${minorMatrix[1][0]}} & ${minorMatrix[1][1]} & ${minorMatrix[1][2]} \\\\
        \\end{vmatrix} \\\\\\\\
        
        \\text{On commence par la \\textbf{diagonale rouge} : (${minorMatrix[0][2]} × ${minorMatrix[1][1]} × ${minorMatrix[2][0]} = ${sumRed2})} \\\\
        \\text{On passe ensuite \\\`{a} la \\textbf{diagonale verte} : (${minorMatrix[1][2]} × ${minorMatrix[2][1]} × ${minorMatrix[0][0]} = ${sumGreen2})} \\\\
        \\text{Enfin, on passe \\\`{a} la \\textbf{diagonale bleue} : (${minorMatrix[2][2]} × ${minorMatrix[0][1]} × ${minorMatrix[1][0]} = ${sumBlue2})} \\\\
        \\text{Une fois les diagonales finies, nous allons additionner \\'{e}galement les trois r\\'{e}sultats obtenus : (${sumRed2} + ${sumGreen2} + ${sumBlue2} = ${sum2})} \\\\\\\\
        \\text{Pour obtenir le d\\'{e}terminant de la matrice, il ne nous reste plus qu'\\\`{a} soustraire les deux sommes obtenues (de gauche \\\`{a} droite et de droite \\\`{a} gauche) : (${sum} - ${sum2} = ${sum - sum2})} \\\\\\\\
        \\textbf{Le d\\'{e}terminant de la matrice (et par cons\\'{e}quent, du mineur) est donc : ${sum - sum2}.} \\\\\\\\
                        
        - \\\\
        \\end{array}`;

        // Génération des images
        const attachmentStatement = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;M=${encodeURIComponent(matrixToLatex(matrix4x4))}`, { name: 'matrix.png' });
        const attachmentResult = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;${encodeURIComponent(explanation)}`, { name: 'SPOILER_explanation.png' });

        // Envoi de l'énoncé et du résultat à l'utilisateur
        await interaction.user.send({ content: statement, files: [attachmentStatement] });
        await interaction.user.send({ content: "**Solution détaillée :**", files: [attachmentResult] });
    }
};
