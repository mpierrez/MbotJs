const { AttachmentBuilder } = require("discord.js");
const { combinaisonLineaireToLatex, systemToLatex } = require("../utils/latex");
const { generateSystem, formatTerm } = require("../utils/system");
const { determinantSarrus } = require("../utils/matrix");

module.exports = {
    name: "combinaison_lineaire",
    description: "Vérifier si un vecteur est une combinaison linéaire de trois autres vecteurs",

    async run(bot, interaction) {
        const isResolvable = Math.random() < 0.5; // 50% de chance que le système soit resolvable ou non
        const system = generateSystem(3, isResolvable);

        const v1 = { x: system.coefficients[0][0], y: system.coefficients[1][0], z: system.coefficients[2][0] };
        const v2 = { x: system.coefficients[0][1], y: system.coefficients[1][1], z: system.coefficients[2][1] };
        const v3 = { x: system.coefficients[0][2], y: system.coefficients[1][2], z: system.coefficients[2][2] };
        const w = { x: system.results[0], y: system.results[1], z: system.results[2] };

        const latexCombi = combinaisonLineaireToLatex(v1, v2, v3, w);

        const det = determinantSarrus([
            [system.coefficients[0][0], system.coefficients[0][1], system.coefficients[0][2]],
            [system.coefficients[1][0], system.coefficients[1][1], system.coefficients[1][2]],
            [system.coefficients[2][0], system.coefficients[2][1], system.coefficients[2][2]]
        ]);

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
        const statement = `**Détermination d'une combinaison linéaire**\n\n` +
                            `Déterminez si w est une combinaison linéaire des vecteurs v1, v2, v3 :\n`;

        // Résultat de l'exercice
        const latexResult = `\\begin{array}{c}
        \\text{-} \\\\\\\\

        \\text{Nous avons les vecteurs suivants :} \\\\\\\\     

        {\\color{Red}v1 = (${v1.x}, ${v1.y}, ${v1.z})} \\\\
        {\\color{DarkGreen}v2 = (${v2.x}, ${v2.y}, ${v2.z})} \\\\
        {\\color{Blue}v3 = (${v3.x}, ${v3.y}, ${v3.z}}) \\\\\\\\

        w = \\begin{pmatrix}
                ${w.x} \\\\
                ${w.y} \\\\
                ${w.z}
            \\end{pmatrix}
            
            =
            
            x * {\\color{Red}\\begin{pmatrix} 
                ${v1.x} \\\\ 
                ${v1.y} \\\\ 
                ${v1.z} 
            \\end{pmatrix}}
            
            + y * {\\color{DarkGreen}\\begin{pmatrix} 
                ${v2.x} \\\\ 
                ${v2.y} \\\\ 
                ${v2.z} 
            \\end{pmatrix}}
            
            + z * 
                {\\color{Blue}\\begin{pmatrix} 
                    ${v3.x} \\\\ 
                    ${v3.y} \\\\ 
                    ${v3.z} 
                \\end{pmatrix}} \\\\\\\\

        \\text{On peut ecrire ceci sous forme d un systeme d equations lineaires :} \\\\\\\\
        ${systemToLatex(system.coefficients, system.results, [{i: 0, j: 0}, {i: 1, j: 0}, {i: 2, j: 0}], [{i: 0, j: 1}, {i: 1, j: 1}, {i: 2, j: 1}], [{i: 0, j: 2}, {i: 1, j: 2}, {i: 2, j: 2}])} \\\\\\\\

        \\text{On peut resoudre ce systeme en utilisant la methode de Cramer par exemple.} \\\\
        \\text{Pour des raisons de simplicite, nous ne resoudrons pas ce systeme ici, cependant vous pouvez le calculer de votre cote.} \\\\\\\\

        \\text{Si le systeme est resolvable (c est a dire qu on trouve un x, un y et un z), alors w est une combinaison lineaire des vecteurs v1, v2, v3.} \\\\\\\\

        ${isResolvable ? `\\text{Dans notre cas, les valeurs de x, y et z sont :} \\\\
                            x = ${x} \\\\
                            y = ${y} \\\\
                            z = ${z}` : 
            `\\text{Dans notre cas, le systeme n etait pas resolvable.}`} \\\\\\\\
        

        ${isResolvable ? `\\text{Donc w est une combinaison lineaire des vecteurs v1, v2, v3.} \\\\\\\\` : `\\text{Donc w n est pas une combinaison lineaire des vecteurs v1, v2, v3.}`}
        
        ${isResolvable ? `w = ${formatTerm(x, v1, 'Red')} ${x !== 0 && y !== 0 ? '+' : ''} ${formatTerm(y, v2, 'DarkGreen')} ${((x !== 0 || y !== 0) && z !== 0) ? '+' : ''} ${formatTerm(z, v3, 'Blue')} \\\\\\\\` : ''}

        \\text{-} \\\\
        \\end{array}`;

        // Génération des images
        const attachmentStatement = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;\\begin{align}${encodeURIComponent(latexCombi)}\\end{align}`, { name: 'combi.png' })
        const attachmentResult = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;${encodeURIComponent(latexResult)}`, { name: 'SPOILER_result.png' });

        // Envoi de l'énoncé et de la solution à l'utilisateur
        await interaction.user.send({ content: statement, files: [attachmentStatement] });
        await interaction.user.send({ content: `**Solution détaillée :**`, files: [attachmentResult] });
    }
}