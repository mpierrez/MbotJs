const { AttachmentBuilder } = require("discord.js");
const { generateObviousFamilyLinearlyDependent, generateFamilyNotLinearlyDependent } = require("../utils/family");
const { familyToLatex } = require("../utils/latex");

module.exports = {
    name: "famille_libre",
    description: "Déterminer si une famille est libre de manière intuitive",

    async run(bot, interaction) {
        const { family, explanation, explanation2, explanation3 } =  Math.random() < 0.75 ? generateObviousFamilyLinearlyDependent() : generateFamilyNotLinearlyDependent()

        // Enoncé de l'exercice
        const statement = `**Détermination de la liberté d'une famille**\n\n` +
                          `Déterminez si la famille suivante est libre:\n`;

        // Résultat de l'exercice
        const latexResult = `\\begin{array}{c}
        \\text{-} \\\\\\\\

        \\text{Nous avons les vecteurs suivants :} \\\\\\\\
        {\\color{Red}v1 = (${family[0][0]}, ${family[0][1]}, ${family[0][2]})} \\\\
        {\\color{DarkGreen}v2 = (${family[1][0]}, ${family[1][1]}, ${family[1][2]})} \\\\
        {\\color{Blue}v3 = (${family[2][0]}, ${family[2][1]}, ${family[2][2]}}) \\\\\\\\

        ${explanation != null ? `\\text{La famille est libre car ${explanation}} \\\\\\\\` 
            : `\\text{La famille est liee (non libre), car il n y a aucune relation entre les differents vecteurs.}`}

        \\text{${explanation2 != null ? explanation2 : ''}} \\\\
        \\text{${explanation3 != null ? explanation3 : ''}} \\\\
        \\text{-} \\\\
        \\end{array}`;

        // Génération des images
        const attachmentStatement = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;\\begin{align}${encodeURIComponent(familyToLatex(family))}\\end{align}`, { name: 'family.png' });
        const attachmentResult = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;${encodeURIComponent(latexResult)}`, { name: 'SPOILER_result.png' });

        // Envoi de l'énoncé et de la solution à l'utilisateur
        await interaction.user.send({ content: statement, files: [attachmentStatement] });
        await interaction.user.send({ files: [attachmentResult] });
    }
};