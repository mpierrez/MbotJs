const { AttachmentBuilder } = require("discord.js");
const { matrixToLatex, applicationLineaireToLatex } = require("../utils/latex");
const { generateSystem, normalizeSigns } = require("../utils/system");

module.exports = {
    name: "app_lineaire_canonique",
    description: "Trouver une matrice d'une application linéaire par rapport à la base canonique",

    async run(bot, interaction) {

        system = generateSystem(3);

        const e11 = system.coefficients[0][0] * 1 + system.coefficients[0][1] * 0 + system.coefficients[0][2] * 0;
        const e12 = system.coefficients[1][0] * 1 + system.coefficients[1][1] * 0 + system.coefficients[1][2] * 0;
        const e13 = system.coefficients[2][0] * 1 + system.coefficients[2][1] * 0 + system.coefficients[2][2] * 0;

        const e21 = system.coefficients[0][0] * 0 + system.coefficients[0][1] * 1 + system.coefficients[0][2] * 0;
        const e22 = system.coefficients[1][0] * 0 + system.coefficients[1][1] * 1 + system.coefficients[1][2] * 0;
        const e23 = system.coefficients[2][0] * 0 + system.coefficients[2][1] * 1 + system.coefficients[2][2] * 0;

        const e31 = system.coefficients[0][0] * 0 + system.coefficients[0][1] * 0 + system.coefficients[0][2] * 1;
        const e32 = system.coefficients[1][0] * 0 + system.coefficients[1][1] * 0 + system.coefficients[1][2] * 1;
        const e33 = system.coefficients[2][0] * 0 + system.coefficients[2][1] * 0 + system.coefficients[2][2] * 1;

        const applicationLineaire = [
            [e11, e21, e31],
            [e12, e22, e32],
            [e13, e23, e33]
        ];

        // Enoncé de l'exercice
        const statement = `**Résoudre une application linéaire par rapport à la base canonique**\n\n` + 
                          `Trouvez la matrice de l'application linéaire f par rapport à la base canonique B :\n`;

        // Résultat de l'exercice
        const explanation = `\\begin{array}{c}
        \\text{-} \\\\\\\\

        \\text{Nous avons les equations suivantes :} \\\\
        \\begin{cases}
            ${normalizeSigns(system.coefficients[0][0], 'x', true)} ${normalizeSigns(system.coefficients[0][1], 'y')} ${normalizeSigns(system.coefficients[0][2], 'z')} \\\\
            ${normalizeSigns(system.coefficients[1][0], 'x', true)} ${normalizeSigns(system.coefficients[1][1], 'y')} ${normalizeSigns(system.coefficients[1][2], 'z')} \\\\
            ${normalizeSigns(system.coefficients[2][0], 'x', true)} ${normalizeSigns(system.coefficients[2][1], 'y')} ${normalizeSigns(system.coefficients[2][2], 'z')} \\\\    
        \\end{cases} \\\\\\\\

        \\text{Pour rappel, la base canonique est la base suivante :} \\\\
        e1 = (1, 0, 0) \\\\
        e2 = (0, 1, 0) \\\\
        e3 = (0, 0, 1) \\\\\\\\

        \\text{Il suffit donc de remplacer les x, y et z de chaque vecteur par les coefficients de la matrice pour obtenir la matrice de l'application linéaire.} \\\\\\\\

        f(e1) = f({\\color{Red}1}, 0, 0) = (${normalizeSigns(system.coefficients[0][0], '*{\\color{Red}1}', true)} ${normalizeSigns(system.coefficients[0][1], '*0')} ${normalizeSigns(system.coefficients[0][2], '*0')} \\:; \\:
                             ${normalizeSigns(system.coefficients[1][0], '*{\\color{Red}1}', true)} ${normalizeSigns(system.coefficients[1][1], '*0')} ${normalizeSigns(system.coefficients[1][2], '*0')} \\:; \\:
                             ${normalizeSigns(system.coefficients[2][0], '*{\\color{Red}1}', true)} ${normalizeSigns(system.coefficients[2][1], '*0')} ${normalizeSigns(system.coefficients[2][2], '*0')}) \\:
              = (${e11}\\:;\\:${e12}\\:;\\:${e13}) \\\\

        f(e2) = f(0, {\\color{Red}1}, 0) = (${normalizeSigns(system.coefficients[0][0], '*0', true)} ${normalizeSigns(system.coefficients[0][1], '*{\\color{Red}1}')} ${normalizeSigns(system.coefficients[0][2], '*0')} \\:; \\:
                             ${normalizeSigns(system.coefficients[1][0], '*0', true)} ${normalizeSigns(system.coefficients[1][1], '*{\\color{Red}1}')} ${normalizeSigns(system.coefficients[1][2], '*0')} \\:; \\:
                             ${normalizeSigns(system.coefficients[2][0], '*0', true)} ${normalizeSigns(system.coefficients[2][1], '*{\\color{Red}1}')} ${normalizeSigns(system.coefficients[2][2], '*0')}) \\:
              = (${e21}\\:;\\:${e22}\\:;\\:${e23}) \\\\

        f(e3) = f(0, 0, {\\color{Red}1}) = (${normalizeSigns(system.coefficients[0][0], '*0', true)} ${normalizeSigns(system.coefficients[0][1], '*0')} ${normalizeSigns(system.coefficients[0][2], '*{\\color{Red}1}')} \\:; \\:
                             ${normalizeSigns(system.coefficients[1][0], '*0', true)} ${normalizeSigns(system.coefficients[1][1], '*0')} ${normalizeSigns(system.coefficients[1][2], '*{\\color{Red}1}')} \\:; \\:
                             ${normalizeSigns(system.coefficients[2][0], '*0', true)} ${normalizeSigns(system.coefficients[2][1], '*0')} ${normalizeSigns(system.coefficients[2][2], '*{\\color{Red}1}')}) \\:
              = (${e31}\\:;\\:${e32}\\:;\\:${e33}) \\\\\\\\

        \\textbf{La matrice de l'application lineaire f en fonction de la base canonique B est :} \\\\

        M(f,B) = ${matrixToLatex(applicationLineaire)} \\\\\\\\

        \\text{-} \\\\        

        \\end{array}`;

        // Génération des images
        const attachmentStatement = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;\\begin{align}${applicationLineaireToLatex(system)}\\end{align}`, { name: 'application_lineaire.png' });
        const attachmentResult = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;${encodeURIComponent(explanation)}`, { name: 'SPOILER_result.png' });

        // Envoi de l'énoncé et de la solution à l'utilisateur
        await interaction.user.send({ content: statement, files: [attachmentStatement] });
        await interaction.user.send({ content: `**Solution détaillée :**`, files: [attachmentResult] });    
    }
};