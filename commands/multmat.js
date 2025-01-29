const { AttachmentBuilder } = require('discord.js');
const { generateMatrix, multiplyMatrices } = require('../utils/matrix');
const { matrixToLatex } = require('../utils/latex');

module.exports = {
    name: "multmat",
    description: "Résoudre une multiplication de matrices 3x3",

    async run(bot, interaction) {
        // Génération des matrices A et B
        const matrixA = generateMatrix();
        const matrixB = generateMatrix();
        
        // Multiplication des matrices A et B
        const resultMatrix = multiplyMatrices(matrixA, matrixB);

        // Génération des images
        const attachment1 = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;A=${encodeURIComponent(matrixToLatex(matrixA))}&space;B=${encodeURIComponent(matrixToLatex(matrixB))}`, { name: 'matrices.png' });
        const attachment2 = new AttachmentBuilder(`https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;A&space;*&space;B&space;=&space;${encodeURIComponent(matrixToLatex(resultMatrix))}`, { name: 'SPOILER_result.png' });

        // Envoi de l'énoncé et du résultat à l'utilisateur
        await interaction.user.send({ content: `**Multiplication de matrices 3x3**\n\n` + `Résolvez la multiplication des deux matrices suivantes (A × B) :\n`, files: [attachment1] });
        await interaction.user.send({ content: `**Solution détaillée :**`, files: [attachment2] });    
    }
};
