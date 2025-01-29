const { AttachmentBuilder } = require("discord.js");
const { generateSystem } = require("../utils/system");
const { systemToLatex, sousEspaceVectorielToLatex } = require("../utils/latex");

module.exports = {
    name: "sous_espace_vectoriel",
    description: "Vérifie si un ensemble est un sous-espace vectoriel",

    async run(bot, interaction) {

        // Générer un système d'équations linéaires
        const system = generateSystem(1);
        system.results[0] = (Math.random()) < 0.5 ? 0 : 1

        const coef1 = system.coefficients[0][0];
        const coef2 = system.coefficients[0][1];
        const coef3 = system.coefficients[0][2];

        const sign = (coef) => coef >= 0 ? '+' : '-';
        const abs = (coef) => Math.abs(coef);

        // Vérification pour (0, 0, 0)
        const expZeroVector = (coef1 * 0 - coef2 * 0 + coef3 * 0 === system.results[0]); // Vérification pour (0,0,0)

        // Enoncé de l'exercice
        const statement = `**Détermination d'un sous-espace vectoriel**\n\n` + `Déteminez si c'est un sous-espace vectoriel :\n`;

        // Résultat de l'exercice
        const latexResult = `\\begin{array}{c}
        \\text{-} \\\\\\\\
        \\textbf{1. V\\'{e}rification de l appartenance \\\`{a} } R^3 : \\\\        
        \\text{- L ensemble F appartient \\\`{a}} R^3 \\text{(toujours vrai).} \\\\\\\\

        \\textbf{2. V\\'{e}rification pour le vecteur (0, 0, 0) :} \\\\
        \\text{- Pour x = 0, y = 0 et z = 0, l \\'{e}quation devient :} \\\\\\\\

        ${coef1} * 0 ${sign(coef2)} ${abs(coef2)} * 0 ${sign(coef3)} ${abs(coef3)} * 0 = ${system.results[0]} \\\\\\\\
        
        ${expZeroVector ? `\\text{Ce qui est bien \\'{e}gal \\\`{a} ${system.results[0]}. Cela montre que (0, 0, 0) appartient \\\`{a} F.} ` : `\\text{Ce n est pas \\'{e}gal \\\`{a} ${system.results[0]} donc cela montre que (0,0,0) n appartient pas \\\`{a} F}`}\\\\\\\\

        \\textbf{Vérification de \( U + V \) :} \\\\\\\\
        U = (x, y, z) \\\\
        V = (x', y', z') \\\\\\\\

        U + V \\\\
        = (x + x', y + y', z + z') \\\\
        = ${coef1}(x + x') ${sign(coef2)} ${abs(coef2)}(y + y') ${sign(coef3)} ${abs(coef3)}(z + z') \\\\
        = ${coef1}x ${sign(coef1)} ${abs(coef1)}x' ${sign(coef2)} ${abs(coef2)}y ${sign(coef2)} ${abs(coef2)}y' ${sign(coef3)} ${abs(coef3)}z ${sign(coef3)} ${abs(coef3)}z' \\\\\\\\
        = (${coef1}x ${sign(coef2)} ${abs(coef2)}y ${sign(coef3)} ${abs(coef3)}z) + (${abs(coef1)}x' ${sign(coef2)} ${abs(coef2)}y' ${sign(coef3)} ${abs(coef3)}z') \\\\\\\\
        = U + V \\\\
        \\text{Ce qui montre que U + V appartient \\\`{a} F.} \\\\\\\

        \\textbf{V\\'{e}rification de \\lambda U :} \\\\\\\\

        \\text{-} \\\\
        \\end{array}`;

        // Génération des images
        const attachmentStatement = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;\\begin{align}${encodeURIComponent(sousEspaceVectorielToLatex(system))}\\end{align}`, { name: 'equations.png' });
        const attachmentResult = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;${encodeURIComponent(latexResult)}`, { name: 'SPOILER_result.png' });

        // Envoi de l'énoncé et de la solution à l'utilisateur
        await interaction.user.send({ content: statement, files: [attachmentStatement] });
        await interaction.user.send({ content: `**Solution détaillée :**`, files: [attachmentResult] });
    }
};