const { AttachmentBuilder } = require("discord.js");
const { gaussSystemToLatex, systemToLatex } = require("../utils/latex");
const { pivotGauss, generateEasySystem } = require("../utils/system");

module.exports = {
    name: "syst_gauss_easy",
    description: "Résoudre un système d'équations à 3 inconnues avec la méthode du pivot de Gauss (matrice facile)",

    async run(bot, interaction) {
        let system;
        let det;
        
        let step1, step2, step3, step4, step5, step6;

        let x, y, z;

        system = generateEasySystem(3);
        const { coefficients } = system;

        // Calculer le déterminant
        const coeffMatrix = [
            [coefficients[0][0], coefficients[0][1], coefficients[0][2]],
            [coefficients[1][0], coefficients[1][1], coefficients[1][2]],
            [coefficients[2][0], coefficients[2][1], coefficients[2][2]]
        ];

        const gauss = pivotGauss(system);

        // Exécuter les étapes du pivot de Gauss, chaque appel renverra la prochaine matrice
        step1 = gauss(); // Étape 0 (normalisation)
        step2 = gauss(); // Étape 0 (élimination)
        step3 = gauss(); // Étape 1 (normalisation)
        step4 = gauss(); // Étape 1 (élimination)
        step5 = gauss(); // Étape 2 (normalisation)
        step6 = gauss(); // Étape 2 (élimination)

        // Récupérer les valeurs de x, y et z
        x = step6[0][3];
        y = step6[1][3];
        z = step6[2][3];

        // Enoncé de l'exercice
        const statement = `**Déterminant d'une matrice 3x3 avec la méthode du pivot de Gauss**\n\n` +
                          `Résolvez le système suivant en utilisant la méthode du pivot de Gauss (il se peut que la matrice soit genre, giga simple où les réponses sont évidentes, mais tentez de le faire avec le pivot de Gauss pour vous entraîner :smile:) :\n`;

        // Résultat de l'exercice
        const resultExplanation = `\\begin{array}{c}
        \\text{-} \\\\\\\\
        \\text{Tout d'abord, nous allons r\\'{e}\\'{e}crire notre syst\\\`{e}me sous forme de matrice augment\\'{e}e.} \\\\
        
        ${gaussSystemToLatex(system.coefficients, system.results, [{i: 0, j: 0}])} \\\\\\\\

        \\text{Ensuite, nous allons effectuer les \\'{e}tapes du pivot de Gauss pour r\\'{e}soudre le syst\\\`{e}me.} \\\\

        \\textbf{Normalisation}
        ${gaussSystemToLatex(step1.map(row => row.slice(0, 3)), step1.map(row => row[3]), [], [{i: 1, j: 0}], [{i: 2, j: 0}])} \\\\\\\\
        \\text{Ce que j ai fait ici, c'est diviser toute la premi\\\`{e}re ligne par } {\\color{Red}a_{11} = ${system.coefficients[0][0]}} \\text{ pour que le } \\textbf{pivot soit \\'{e}gal \\\`{a} 1}. \\\\\\\\
        \\text{==============================================}\\\\\\\\

        \\textbf{Elimination}
        ${gaussSystemToLatex(step2.map(row => row.slice(0, 3)), step2.map(row => row[3]), [{i: 1, j: 1}])} \\\\\\\\
        \\text{Pour que la colonne du pivot soit \\'{e}gale \\\`{a} 0, il faut qu on fasse les op\\'{e}rations suivantes : } \\\\
        \\text{L2 = L2 - } {\\color{DarkGreen}${step1[1][0]}} * \\text{L1} \\\\
        \\text{L3 = L3 - } {\\color{Blue}${step1[2][0]}} * \\text{L1} \\\\\\\\
        \\text{==============================================}\\\\\\\\
    
        \\textbf{Normalisation}
        ${gaussSystemToLatex(step3.map(row => row.slice(0, 3)), step3.map(row => row[3]), [], [{i: 0, j: 1}], [{i: 2, j: 1}])} \\\\\\\\
        \\text{Ce que j ai fait ici, c'est diviser toute la deuxi\\\`{e}me ligne par } {\\color{Red}a_{22} = ${step2[1][1]}} \\text{ pour que le } \\textbf{pivot soit \\'{e}gal \\\`{a} 1}. \\\\\\\\
        \\text{==============================================}\\\\\\\\

        \\textbf{Elimination}
        ${gaussSystemToLatex(step4.map(row => row.slice(0, 3)), step4.map(row => row[3]), [{i: 2, j: 2}])} \\\\\\\\
        \\text{Pour que la colonne du pivot soit \\'{e}gale \\\`{a} 0, il faut qu on fasse les op\\'{e}rations suivantes : } \\\\
        \\text{L1 = L1 - } {\\color{DarkGreen}${step3[0][1]}} * \\text{L2} \\\\
        \\text{L3 = L3 - } {\\color{Blue}${step3[2][1]}} * \\text{L2} \\\\\\\\
        \\text{==============================================}\\\\\\\\

        \\textbf{Normalisation}
        ${gaussSystemToLatex(step5.map(row => row.slice(0, 3)), step5.map(row => row[3]), [], [{i: 0, j: 2}], [{i: 1, j: 2}])} \\\\\\\\
        \\text{Ce que j ai fait ici, c'est diviser toute la troisi\\\`{e}me ligne par } {\\color{Red}a_{33} = ${step4[2][2]}} \\text{ pour que le } \\textbf{pivot soit \\'{e}gal \\\`{a} 1}. \\\\\\\\
        \\text{==============================================}\\\\\\\\

        \\textbf{Elimination}
        ${gaussSystemToLatex(step6.map(row => row.slice(0, 3)), step6.map(row => row[3]))} \\\\\\\\
        \\text{Pour que la colonne du pivot soit \\'{e}gale \\\`{a} 0, il faut qu on fasse les op\\'{e}rations suivantes : } \\\\
        \\text{L1 = L1 - } {\\color{DarkGreen}${step5[0][2]}} * \\text{L3} \\\\
        \\text{L2 = L2 - } {\\color{Blue}${step5[1][2]}} * \\text{L3} \\\\\\\\
        \\text{==============================================}\\\\\\\\

        \\text{Enfin, nous obtenons les valeurs des inconnues en regardant la dernière colonne :} \\\\
        x = ${x}\\text{, } y = ${y}\\text{ et } z = ${z} \\\\\\\\
        
        \\text{-} \\\\
        \\end{array}`;

        // Génération des images
        const attachmentStatement = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;\\begin{align}${encodeURIComponent(systemToLatex(system.coefficients, system.results))}\\end{align}`, { name: 'equations.png' });
        const attachmentResult = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;${encodeURIComponent(resultExplanation)}`, { name: 'SPOILER_result.png' });
        
        // Envoi de l'énoncé et de la solution à l'utilisateur
        await interaction.user.send({ content: statement, files: [attachmentStatement] });
        await interaction.user.send({ content: `**Solution détaillée :**`, files: [attachmentResult] });
    }
};