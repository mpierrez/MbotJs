const { AttachmentBuilder } = require('discord.js');
const { generateMatrix } = require('../utils/matrix');
const { matrixToLatex } = require('../utils/latex');

module.exports = {
    name: "deter_sarrus",
    description: "Trouver le déterminant d'une matrice 3x3 avec la méthode de Sarrus",

    async run(bot, interaction) {
        const matrix = generateMatrix(3);

        const sumRed = matrix[0][0] * matrix[1][1] * matrix[2][2];
        const sumGreen = matrix[1][0] * matrix[2][1] * matrix[0][2];
        const sumBlue = matrix[2][0] * matrix[0][1] * matrix[1][2];

        const sumRed2 = matrix[2][0] * matrix[1][1] * matrix[0][2];
        const sumGreen2 = matrix[0][0] * matrix[2][1] * matrix[1][2];
        const sumBlue2 = matrix[1][0] * matrix[0][1] * matrix[2][2];
        
        const sum = sumRed + sumGreen + sumBlue;
        const sum2 = sumRed2 + sumGreen2 + sumBlue2;

        // Enoncé de l'exercice
        const statement = `**Déterminant d'une matrice 3x3 avec la méthode de Sarrus**\n\n` +
                          `Trouvez le déterminant de la matrice M en utilisant la méthode de Sarrus :\n`;

        // Résultat de l'exercice
        const latexResult = `\\begin{array}{c}
        \\text{-} \\\\\\\\
        \\text{Tout d'abord, nous allons r\\'{e}\\'{e}crire notre matrice et y ajouter les \\textbf{DEUX premi\\\`{e}res lignes} \\\`{a} la \\textbf{fin de la matrice}.} \\\\
    
        \\begin{vmatrix}
        {${matrix[0][0]}} & ${matrix[0][1]} & ${matrix[0][2]} \\\\
        {${matrix[1][0]}} & {${matrix[1][1]}} & ${matrix[1][2]} \\\\
        {${matrix[2][0]}} & {${matrix[2][1]}} & {${matrix[2][2]}} \\\\
        \\textbf{${matrix[0][0]}} & \\textbf{{${matrix[0][1]}}} & \\textbf{{${matrix[0][2]}}} \\\\
        \\textbf{${matrix[1][0]}} & \\textbf{${matrix[1][1]}} & \\textbf{{${matrix[1][2]}}} \\\\
        \\end{vmatrix} \\\\\\\\

        \\text{On va ensuite mettre en \\'{e}vidence les couleurs des \\textbf{diagonales de gauche à droite} de la matrice.} \\\\

        \\begin{vmatrix}
        {\\color{Red} ${matrix[0][0]}} & ${matrix[0][1]} & ${matrix[0][2]} \\\\
        {\\color{DarkGreen} ${matrix[1][0]}} & {\\color{Red} ${matrix[1][1]}} & ${matrix[1][2]} \\\\
        {\\color{Blue} ${matrix[2][0]}} & {\\color{DarkGreen} ${matrix[2][1]}} & {\\color{Red} ${matrix[2][2]}} \\\\
        ${matrix[0][0]} & {\\color{Blue} ${matrix[0][1]}} & {\\color{DarkGreen} ${matrix[0][2]}} \\\\
        ${matrix[1][0]} & ${matrix[1][1]} & {\\color{Blue} ${matrix[1][2]}} \\\\
        \\end{vmatrix} \\\\\\\\

        \\text{Nous allons commencer par les multiplications des \\'{e}l\\'{e}ments suivant les couleurs \\textbf{de gauche \\\`{a} droite} (suivez les couleurs).} \\\\
        \\text{On commence par la \\textbf{diagonale rouge} : (${matrix[0][0]} × ${matrix[1][1]} × ${matrix[2][2]} = ${sumRed})} \\\\
        \\text{On passe ensuite \\\`{a} la \\textbf{diagonale verte} : (${matrix[1][0]} × ${matrix[2][1]} × ${matrix[0][2]} = ${sumGreen})} \\\\
        \\text{Enfin, on passe \\\`{a} la \\textbf{diagonale bleue} : (${matrix[2][0]} × ${matrix[0][1]} × ${matrix[1][2]} = ${sumBlue})} \\\\
        \\text{Une fois les diagonales finies, nous allons additionner les trois r\\'{e}sultats obtenus : (${sumRed} + ${sumGreen} + ${sumBlue} = ${sum})} \\\\\\\\
    
        \\text{Ensuite, nous allons r\\'{e}p\\'{e}ter le processus, mais cette fois-ci, nous allons multiplier de \\textbf{droite \\\`{a} gauche}. Concentrons-nous \\\`{a} nouveau sur les couleurs :} \\\\
        
        \\begin{vmatrix}
        ${matrix[0][0]} & ${matrix[0][1]} & {\\color{Red} ${matrix[0][2]}} \\\\
        ${matrix[1][0]} & {\\color{Red} ${matrix[1][1]}} & {\\color{DarkGreen} ${matrix[1][2]}} \\\\
        {\\color{Red} ${matrix[2][0]}} & {\\color{DarkGreen} ${matrix[2][1]}} & {\\color{Blue} ${matrix[2][2]}} \\\\
        {\\color{DarkGreen} ${matrix[0][0]}} & {\\color{Blue} ${matrix[0][1]}} & ${matrix[0][2]} \\\\
        {\\color{Blue} ${matrix[1][0]}} & ${matrix[1][1]} & ${matrix[1][2]} \\\\
        \\end{vmatrix} \\\\\\\\
        
        \\text{On commence par la \\textbf{diagonale rouge} : (${matrix[0][2]} × ${matrix[1][1]} × ${matrix[2][0]} = ${sumRed2})} \\\\
        \\text{On passe ensuite \\\`{a} la \\textbf{diagonale verte} : (${matrix[1][2]} × ${matrix[2][1]} × ${matrix[0][0]} = ${sumGreen2})} \\\\
        \\text{Enfin, on passe \\\`{a} la \\textbf{diagonale bleue} : (${matrix[2][2]} × ${matrix[0][1]} × ${matrix[1][0]} = ${sumBlue2})} \\\\
        \\text{Une fois les diagonales finies, nous allons additionner \\'{e}galement les trois r\\'{e}sultats obtenus : (${sumRed2} + ${sumGreen2} + ${sumBlue2} = ${sum2})} \\\\\\\\
        \\text{Pour obtenir le d\\'{e}terminant de la matrice, il ne nous reste plus qu'\\\`{a} soustraire les deux sommes obtenues (de gauche \\\`{a} droite et de droite \\\`{a} gauche) : (${sum} - ${sum2} = ${sum - sum2})} \\\\\\\\
        \\textbf{Le d\\'{e}terminant de la matrice est donc : ${sum - sum2}.} \\\\\\\\
        \\text{-} \\\\
        \\end{array}`;   
    
        // Génération des images
        const attachmentStatement = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;\\begin{align}M=${encodeURIComponent(matrixToLatex(matrix))}\\end{align}`, { name: 'matrix.png' });
        const attachmentResult = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;${encodeURIComponent(latexResult)}`, { name: 'SPOILER_result.png' });

        // Envoi de l'énoncé et de la solution à l'utilisateur
        await interaction.user.send({ content: statement, files: [attachmentStatement] });
        await interaction.user.send({ content: `**Solution détaillée :**`, files: [attachmentResult] });
    }
};
