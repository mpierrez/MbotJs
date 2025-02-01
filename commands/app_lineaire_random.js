const { AttachmentBuilder } = require("discord.js");
const { matrixToLatex, applicationLineaireToLatex, systemToLatex } = require("../utils/latex");
const { generateSystem, normalizeSigns } = require("../utils/system");
const { generateMatrix } = require("../utils/matrix");

module.exports = {
    name: "app_lineaire_random",
    description: "Trouver une matrice d'une application linéaire par rapport à une base aléatoire",

    async run(bot, interaction) {

        matrix = generateMatrix(3);
        system = generateSystem(3);

        const e11 = system.coefficients[0][0] * matrix[0][0] + system.coefficients[0][1] * matrix[0][1] + system.coefficients[0][2] * matrix[0][2];
        const e12 = system.coefficients[1][0] * matrix[0][0] + system.coefficients[1][1] * matrix[0][1] + system.coefficients[1][2] * matrix[0][2];
        const e13 = system.coefficients[2][0] * matrix[0][0] + system.coefficients[2][1] * matrix[0][1] + system.coefficients[2][2] * matrix[0][2];

        const e21 = system.coefficients[0][0] * matrix[1][0] + system.coefficients[0][1] * matrix[1][1] + system.coefficients[0][2] * matrix[1][2];
        const e22 = system.coefficients[1][0] * matrix[1][0] + system.coefficients[1][1] * matrix[1][1] + system.coefficients[1][2] * matrix[1][2];
        const e23 = system.coefficients[2][0] * matrix[1][0] + system.coefficients[2][1] * matrix[1][1] + system.coefficients[2][2] * matrix[1][2];

        const e31 = system.coefficients[0][0] * matrix[2][0] + system.coefficients[0][1] * matrix[2][1] + system.coefficients[0][2] * matrix[2][2];
        const e32 = system.coefficients[1][0] * matrix[2][0] + system.coefficients[1][1] * matrix[2][1] + system.coefficients[1][2] * matrix[2][2];
        const e33 = system.coefficients[2][0] * matrix[2][0] + system.coefficients[2][1] * matrix[2][1] + system.coefficients[2][2] * matrix[2][2];

        const applicationLineaire = [
            [e11, e21, e31],
            [e12, e22, e32],
            [e13, e23, e33]
        ];

        // Enoncé de l'exercice
        const statement = `**Résoudre une application linéaire par rapport à la base S**\n\n` + 
                          `Trouvez la matrice de l'application linéaire f par rapport à la base S :\n`;

        // Résultat de l'exercice
        const explanation = `\\begin{array}{c}
        \\text{-} \\\\\\\\

        \\text{Nous avons les equations suivantes :} \\\\
        ${systemToLatex(system.coefficients)} \\\\\\\\

        \\text{La base S a les vecteurs suivants :} \\\\
        u1 = (${matrix[0][0]}, ${matrix[0][1]}, ${matrix[0][2]}) \\\\
        u2 = (${matrix[1][0]}, ${matrix[1][1]}, ${matrix[1][2]}) \\\\
        u3 = (${matrix[2][0]}, ${matrix[2][1]}, ${matrix[2][2]}) \\\\\\\\

        \\text{Il suffit donc de remplacer les x, y et z de chaque vecteur par les coefficients de la matrice pour obtenir la matrice de l'application linéaire.} \\\\\\\\

        f(e1) = f({\\color{Red}${matrix[0][0]}}, {\\color{DarkGreen}${matrix[0][1]}}, {\\color{Blue}${matrix[0][2]}}) = (${normalizeSigns(system.coefficients[0][0], '*{\\color{Red}' + matrix[0][0] + '}', true)} ${normalizeSigns(system.coefficients[0][1], '*{\\color{DarkGreen}' + matrix[0][1] + '}')} ${normalizeSigns(system.coefficients[0][2], '*{\\color{Blue}' + matrix[0][2] + '}')} \\:; \\:
                                ${normalizeSigns(system.coefficients[1][0], '*{\\color{Red}' + matrix[0][0] + '}', true)} ${normalizeSigns(system.coefficients[1][1], '*{\\color{DarkGreen}' + matrix[0][1] + '}')} ${normalizeSigns(system.coefficients[1][2], '*{\\color{Blue}' + matrix[0][2] + '}')} \\:; \\:
                                ${normalizeSigns(system.coefficients[2][0], '*{\\color{Red}' + matrix[0][0] + '}', true)} ${normalizeSigns(system.coefficients[2][1], '*{\\color{DarkGreen}' + matrix[0][1] + '}')} ${normalizeSigns(system.coefficients[2][2], '*{\\color{Blue}' + matrix[0][2] + '}')}) \\:
                    = (${e11}\\:;\\:${e12}\\:;\\:${e13}) \\\\

        f(e2) = f({\\color{Red}${matrix[1][0]}}, {\\color{DarkGreen}${matrix[1][1]}}, {\\color{Blue}${matrix[1][2]}}) = (${normalizeSigns(system.coefficients[0][0], '*{\\color{Red}' + matrix[1][0] + '}', true)} ${normalizeSigns(system.coefficients[0][1], '*{\\color{DarkGreen}' + matrix[1][1] + '}')} ${normalizeSigns(system.coefficients[0][2], '*{\\color{Blue}' + matrix[1][2] + '}')} \\:; \\:
                                ${normalizeSigns(system.coefficients[1][0], '*{\\color{Red}' + matrix[1][0] + '}', true)} ${normalizeSigns(system.coefficients[1][1], '*{\\color{DarkGreen}' + matrix[1][1] + '}')} ${normalizeSigns(system.coefficients[1][2], '*{\\color{Blue}' + matrix[1][2] + '}')} \\:; \\:
                                ${normalizeSigns(system.coefficients[2][0], '*{\\color{Red}' + matrix[1][0] + '}', true)} ${normalizeSigns(system.coefficients[2][1], '*{\\color{DarkGreen}' + matrix[1][1] + '}')} ${normalizeSigns(system.coefficients[2][2], '*{\\color{Blue}' + matrix[1][2] + '}')}) \\:
                    = (${e21}\\:;\\:${e22}\\:;\\:${e23}) \\\\

        f(e3) = f({\\color{Red}${matrix[2][0]}}, {\\color{DarkGreen}${matrix[2][1]}}, {\\color{Blue}${matrix[2][2]}}) = (${normalizeSigns(system.coefficients[0][0], '*{\\color{Red}' + matrix[2][0] + '}', true)} ${normalizeSigns(system.coefficients[0][1], '*{\\color{DarkGreen}' + matrix[2][1] + '}')} ${normalizeSigns(system.coefficients[0][2], '*{\\color{Blue}' + matrix[2][2] + '}')} \\:; \\:
                                ${normalizeSigns(system.coefficients[1][0], '*{\\color{Red}' + matrix[2][0] + '}', true)} ${normalizeSigns(system.coefficients[1][1], '*{\\color{DarkGreen}' + matrix[2][1] + '}')} ${normalizeSigns(system.coefficients[1][2], '*{\\color{Blue}' + matrix[2][2] + '}')} \\:; \\:
                                ${normalizeSigns(system.coefficients[2][0], '*{\\color{Red}' + matrix[2][0] + '}', true)} ${normalizeSigns(system.coefficients[2][1], '*{\\color{DarkGreen}' + matrix[2][1] + '}')} ${normalizeSigns(system.coefficients[2][2], '*{\\color{Blue}' + matrix[2][2] + '}')}) \\:
                    = (${e31}\\:;\\:${e32}\\:;\\:${e33}) \\\\\\\\

        \\textbf{La matrice de l'application lineaire f en fonction de la base S est :} \\\\

        M(f,S) = ${matrixToLatex(applicationLineaire)} \\\\\\\\

        \\text{-} \\\\        

        \\end{array}`;

        // Génération des images
        const attachmentStatement = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;\\begin{align}S&space;=&space;${matrixToLatex(matrix)}\\end{align}\\text{ et }\\begin{align}${applicationLineaireToLatex(system)}\\end{align}`, { name: 'application_lineaire.png' });
        const attachmentResult = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;${encodeURIComponent(explanation)}`, { name: 'SPOILER_result.png' });

        // Envoi de l'énoncé et de la solution à l'utilisateur
        await interaction.user.send({ content: statement, files: [attachmentStatement] });
        await interaction.user.send({ content: `**Solution détaillée :**`, files: [attachmentResult] });    
    }
};