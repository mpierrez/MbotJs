const { AttachmentBuilder } = require("discord.js");
const { getCofactor, generateMatrix } = require("../utils/matrix");
const { matrixToLatex } = require("../utils/latex");

module.exports = {
    name: "deter_cofacteur",
    description: "Trouver le déterminant d'une matrice 3x3 avec la méthode des cofacteurs",

    async run(bot, interaction) {
        const matrix = generateMatrix(3);
        const c11 = getCofactor(matrix, 1, 1);
        const c12 = getCofactor(matrix, 1, 2);
        const c13 = getCofactor(matrix, 1, 3);

        const minorDeterminant = matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1];
        const matrixDeterminant = matrix[0][0] * c11 + matrix[0][1] * c12 + matrix[0][2] * c13;

        // Enoncé de l'exercice
        const statement = `**Déterminant d'une matrice 3x3 avec la méthode des cofacteurs**\n\n` + 
                          `Trouvez le déterminant de la matrice M en utilisant la méthode des cofacteurs :\n`;

        // Résultat de l'exercice
        const explanation = `\\begin{array}{c}
        \\text{-} \\\\\\\\
        \\text{Nous avons la matrice suivante :} \\\\
        \\begin{pmatrix}
            {\\color{Red}${matrix[0][0]}} & {\\color{DarkGreen}${matrix[0][1]}} & {\\color{Blue}${matrix[0][2]}} \\\\
            ${matrix[1][0]} & ${matrix[1][1]} & ${matrix[1][2]} \\\\
            ${matrix[2][0]} & ${matrix[2][1]} & ${matrix[2][2]} \\\\
        \\end{pmatrix} \\\\\\\\
        
        \\text{Pour rappel, pour calculer le d\\'{e}terminant d'une matrice en utilisant la m\\'{e}thode des cofacteurs, la formule est la suivante :} \\\\
        \\text{det} = a_{1,1} * C_{1,1} + a_{1,2} * C_{1,2} + a_{1,3} * C_{1,3} \\\\\\\\

        \\text{Avec }  {\\color{Red}a_{1,1} = ${matrix[0][0]}}\\text{, } {\\color{DarkGreen}a_{1,2} = ${matrix[0][1]}} \\text{ et } {\\color{Blue}a_{1,3} = ${matrix[0][2]}} \\\\

        \\text{Nous allons donc calculer les cofacteurs (je vais d\\'{e}tailler pour } C_{1,1} \\text{ mais le principe est le meme pour les autres)} \\\\
        \\text{En premier, nous allons calculer le mineur de l'\\'{e}l\\'{e}ment situ\\'{e} a la ligne 1 et la colonne 1.} \\\\\\\\
        \\text{Pour cela, nous allons enlever la ligne 1 et la colonne 1 de la matrice (on enl\\\`{e}ve les chiffres en rouge).} \\\\

        \\text{Cela nous donne la matrice suivante :} \\\\
        \\begin{bmatrix}
            {\\color{Red}${matrix[0][0]}} & {\\color{Red}${matrix[0][1]}} & {\\color{Red}${matrix[0][2]}} \\\\
            {\\color{Red}${matrix[1][0]}} & ${matrix[1][1]} & ${matrix[1][2]} \\\\
            {\\color{Red}${matrix[2][0]}} & ${matrix[2][1]} & ${matrix[2][2]} \\\\
        \\end{bmatrix} \\\\\\\\
        
        \\text{Voici donc le mineur } M_{1,1} \\\\
        \\begin{bmatrix}
            ${matrix[1][1]} & ${matrix[1][2]} \\\\
            ${matrix[2][1]} & ${matrix[2][2]} \\\\
        \\end{bmatrix} \\\\\\\\

        \\text{Calculons maintenant le d\\'{e}terminant de ce mineur.} \\\\\\\\
        \\text{Le d\\'{e}terminant d une matrice 2x2 est donn\\'{e} par la formule suivante :} \\\\
        \\text{det} = a_{1,1} * a_{2,2} - a_{1,2} * a_{2,1} \\\\\\\\
                
        \\text{Dans notre cas : } a_{1,1} = ${matrix[1][1]}\\text{, } a_{2,2} = ${matrix[2][2]}\\text{, } a_{1,2} = ${matrix[1][2]} \\text{ et } a_{2,1} = ${matrix[2][1]} \\\\
        \\text{Il ne reste plus qu a remplacer dans la formule :} \\\\
        D = ${matrix[1][1]} * ${matrix[2][2]} - ${matrix[1][2]} * ${matrix[2][1]} = ${minorDeterminant} \\\\\\\\

        \\textbf{La d\\'{e}terminant du mineur (1, 1) est donc de ${minorDeterminant}} \\\\\\\\

        \\text{Calculons maintenant le cofacteur grace a ce mineur} \\\\\\\\
        \\text{Le cofacteur est donn\\'{e} par la formule suivante :}\\\\
        C_{i,j} = (-1)^{i + j} * \\text{d\\'{e}terminant du mineur}\\\\\\\\
        \\text{Dans notre cas, i = 1, j = 1 et le d\\'{e}terminant du mineur = ${minorDeterminant}} \\\\
        \\text{Le cofacteur (1, 1) est donc de : } (-1)^{1 + 1} * ${minorDeterminant} = ${c11} \\\\\\\\
        \\textbf{{\\color{Orange}Le cofacteur (1, 1) est donc de ${c11}}} \\\\\\\\

        \\text{Les autres cofacteurs sont calcul\\'{e}s de la même mani\\\`{e}re.} \\\\\\\\

        {\\color{Emerald}C_{1,2} = ${c12}} \\\\
        {\\color{Teal}C_{1,3} = ${c13}} \\\\\\\\

        \\text{Tout ce qu'il reste a faire est de remplacer les termes dans la formule du d\\'{e}terminant cit\\'{e}e plus haut} \\\\\\\\

        \\text{Rappel de la formule : } \\\\
        \\text{det} = {\\color{Red}a_{1,1}} * {\\color{Orange}C_{1,1}} + {\\color{DarkGreen}a_{1,2}} * {\\color{Emerald}C_{1,2}} + {\\color{Blue}a_{1,3}} * {\\color{Teal}C_{1,3}} \\\\\\\\

        \\text{det} = {\\color{Red}${matrix[0][0]}} * {\\color{Orange}${c11}} + {\\color{DarkGreen}${matrix[0][1]}} * {\\color{Emerald}${c12}} + {\\color{Blue}${matrix[0][2]}} * {\\color{Teal}${c13}} = ${matrixDeterminant} \\\\\\\\

        \\textbf{Le d\\'{e}terminant de la matrice est donc : ${matrixDeterminant}} \\\\\\\\

        - \\\\
        \\end{array}`;

        // Génération des images
        const attachmentStatement = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;\\begin{align}M=${encodeURIComponent(matrixToLatex(matrix))}\\end{align}`, { name: 'matrix.png' });
        const attachmentResult = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;${encodeURIComponent(explanation)}`, { name: 'SPOILER_result.png' });

        // Envoi de l'énoncé et de la solution à l'utilisateur
        await interaction.user.send({ content: statement, files: [attachmentStatement] });
        await interaction.user.send({ files: [attachmentResult] });    
    }
};