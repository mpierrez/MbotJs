const { AttachmentBuilder } = require('discord.js');
const { determinantSarrus } = require('../utils/matrix');
const { systemToLatex, matrixToLatex } = require('../utils/latex');
const { generateSystem } = require('../utils/system');

module.exports = {
    name: "syst_cramer",
    description: "Résoudre un système d'équations à 3 inconnues en utilisant la méthode de Cramer",

    async run(bot, interaction) {
        let system;
        let det;

        // Génération du système et vérification de sa résolvabilité
        do {
            system = generateSystem(3);
            const { coefficients } = system;

            // Calculer le déterminant
            const coeffMatrix = [
                [coefficients[0][0], coefficients[0][1], coefficients[0][2]],
                [coefficients[1][0], coefficients[1][1], coefficients[1][2]],
                [coefficients[2][0], coefficients[2][1], coefficients[2][2]]
            ];
            det = determinantSarrus(coeffMatrix);

        } while (det === 0); // Répéter jusqu'à obtenir un système résolvable

        // Calcul des déterminants des inconnues
        const detX = determinantSarrus([
            [system.results[0], system.coefficients[0][1], system.coefficients[0][2]],
            [system.results[1], system.coefficients[1][1], system.coefficients[1][2]],
            [system.results[2], system.coefficients[2][1], system.coefficients[2][2]]
        ]);

        const detY = determinantSarrus([
            [system.coefficients[0][0], system.results[0], system.coefficients[0][2]],
            [system.coefficients[1][0], system.results[1], system.coefficients[1][2]],
            [system.coefficients[2][0], system.results[2], system.coefficients[2][2]]
        ]);

        const detZ = determinantSarrus([
            [system.coefficients[0][0], system.coefficients[0][1], system.results[0]],
            [system.coefficients[1][0], system.coefficients[1][1], system.results[1]],
            [system.coefficients[2][0], system.coefficients[2][1], system.results[2]]
        ]);

        const x = detX / det;
        const y = detY / det;
        const z = detZ / det;

        // Enoncé de l'exercice
        const statement = `**Déterminant d'une matrice 3x3 avec la méthode de Cramer**\n\n` +
                          `Résolvez le système suivant en utilisant la méthode de Cramer :\n`;

        // Résultat de l'exercice
        const latexResult = `\\begin{array}{c}
        \\text{-} \\\\\\\\
        \\text{On a les matrices suivantes : } \\\\
        ${matrixToLatex(system.coefficients)} ${matrixToLatex(system.results)} \\\\\\\\

        \\textbf{Calcul du d\\'{e}terminant de la matrice} \\\\\\\\

        \\text{Tout d'abord, pour r\\'{e}\\'{e}soudre notre syst\\\`{e}me d \\'{e}quations, nous devons calculer le d\\'{e}terminant de la matrice qui les repr\\'{e}sente} \\\\
        \\text{(je ne d\\'{e}taillerai pas les calculs ici car ça serait beaucoup trop long, si vous ne savez pas comment faire, faites l'exercice sur les d\\'{e}terminants de sarrus en premier).} \\\\\\\\
    
        D = 
        \\begin{vmatrix}
        {${system.coefficients[0][0]}} & ${system.coefficients[0][1]} & ${system.coefficients[0][2]} \\\\
        {${system.coefficients[1][0]}} & {${system.coefficients[1][1]}} & ${system.coefficients[1][2]} \\\\
        {${system.coefficients[2][0]}} & {${system.coefficients[2][1]}} & {${system.coefficients[2][2]}} \\\\
        \\end{vmatrix} = ${det}\\\\\\\\

        \\textbf{Calcul des d\\'{e}terminants des inconnues} \\\\\\\\
        \\text{Pour trouver les valeurs de x, y et z, nous devons calculer trois d\\'{e}terminants en remplaçant les colonnes de la matrice par les r\\'{e}sultats du syt\\\`{e}me.} \\\\
        \\text{En d'autres termes:} \\\\
        \\text{- Pour x, on remplace la \\textbf{PREMIERE colonne} de la matrice par la {\\color{Red}colonne des r\\'{e}sultats}} \\\\
        \\text{- Pour y, on remplace la \\textbf{DEUXIEME colonne} de la matrice par la {\\color{Red}colonne des r\\'{e}sultats}} \\\\
        \\text{- Pour z, on remplace la \\textbf{TROISIEME colonne} de la matrice par la {\\color{Red}colonne des r\\'{e}sultats}} \\\\\\\\

        \\text{Nous obtenons donc les matrices suivantes (regardez bien les chiffres en rouge, qui viennent remplacer la colonne de la matrice de base par la colonne des r\\'{e}sultats) :} \\\\
        X = 
        \\begin{pmatrix}
        {\\color{Red}${system.results[0]}} & ${system.coefficients[0][1]} & ${system.coefficients[0][2]} \\\\
        {\\color{Red}${system.results[1]}} & ${system.coefficients[1][1]} & ${system.coefficients[1][2]} \\\\
        {\\color{Red}${system.results[2]}} & ${system.coefficients[2][1]} & ${system.coefficients[2][2]} \\\\
        \\end{pmatrix} \\\\\\\\

        Y =
        \\begin{pmatrix}
        ${system.coefficients[0][0]} & {\\color{Red}${system.results[0]}} & ${system.coefficients[0][2]} \\\\
        ${system.coefficients[1][0]} & {\\color{Red}${system.results[1]}} & ${system.coefficients[1][2]} \\\\
        ${system.coefficients[2][0]} & {\\color{Red}${system.results[2]}} & ${system.coefficients[2][2]} \\\\
        \\end{vmatrix} \\\\\\\\

        Z =
        \\begin{pmatrix}
        ${system.coefficients[0][0]} & ${system.coefficients[0][1]} & {\\color{Red}${system.results[0]}} \\\\
        ${system.coefficients[1][0]} & ${system.coefficients[1][1]} & {\\color{Red}${system.results[1]}} \\\\
        ${system.coefficients[2][0]} & ${system.coefficients[2][1]} & {\\color{Red}${system.results[2]}} \\\\
        \\end{pmatrix} \\\\\\\\

        \\text{Il faut calculer le d\\'{e}terminant de chacune de ces matrices (encore une fois, je ne d\\'{e}taillerai pas les calculs car trop long)} \\\\

        D_{x} = 
        \\begin{vmatrix}
        {${system.results[0]}} & ${system.coefficients[0][1]} & ${system.coefficients[0][2]} \\\\
        {${system.results[1]}} & {${system.coefficients[1][1]}} & ${system.coefficients[1][2]} \\\\
        {${system.results[2]}} & {${system.coefficients[2][1]}} & {${system.coefficients[2][2]}} \\\\
        \\end{vmatrix} = ${detX} \\\\\\\\

        D_{y} =
        \\begin{vmatrix}
        {${system.coefficients[0][0]}} & {${system.results[0]}} & ${system.coefficients[0][2]} \\\\
        {${system.coefficients[1][0]}} & {${system.results[1]}} & ${system.coefficients[1][2]} \\\\
        {${system.coefficients[2][0]}} & {${system.results[2]}} & {${system.coefficients[2][2]}} \\\\
        \\end{vmatrix} = ${detY} \\\\\\\\

        D_{z} =
        \\begin{vmatrix}
        {${system.coefficients[0][0]}} & ${system.coefficients[0][1]} & {${system.results[0]}} \\\\
        {${system.coefficients[1][0]}} & {${system.coefficients[1][1]}} & {${system.results[1]}} \\\\
        {${system.coefficients[2][0]}} & {${system.coefficients[2][1]}} & {${system.results[2]}} \\\\
        \\end{vmatrix} = ${detZ} \\\\\\\\

        \\text{Enfin, nous pouvons trouver les valeurs de x, y et z en divisant les d\\'{e}terminants des matrices X, Y et Z par le d\\'{e}terminant de la matrice initiale.} \\\\
        x = \\frac{D_{x}}{D} = \\frac{${detX}}{${det}} = ${x} \\\\\\\\

        y = \\frac{D_{y}}{D} = \\frac{${detY}}{${det}} = ${y} \\\\\\\\

        z = \\frac{D_{z}}{D} = \\frac{${detZ}}{${det}} = ${z} \\\\\\\\

        \\textbf{Les solutions du syst\\\`{e}me sont donc : x = ${x}, y = ${y}, z = ${z}} \\\\

        \\text{-} \\\\
        \\end{array}`;   
    
        // Génération des images
        const attachmentStatement = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;\\begin{align}${encodeURIComponent(systemToLatex(system.coefficients, system.results))}\\end{align}`, { name: 'equations.png' });
        const attachmentResult = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;${encodeURIComponent(latexResult)}`, { name: 'SPOILER_result.png' });

        // Envoi de l'énoncé et de la solution à l'utilisateur
        await interaction.user.send({ content: statement, files: [attachmentStatement] });
        await interaction.user.send({ content: `**Solution détaillée :**`, files: [attachmentResult] });
    }
};