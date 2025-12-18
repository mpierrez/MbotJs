const { AttachmentBuilder } = require("discord.js");
const { matrixToLatex } = require("../../utils/latex");
const { addMatrices, generateMatrix } = require("../../utils/matrix");

module.exports = {
  name: "addmat",
  description: "Résoudre une addition de matrices 3x3",
  category: "algebre",

  async run(bot, interaction) {
    // Génération des matrices A et B
    const matrixA = generateMatrix();
    const matrixB = generateMatrix();

    // Addition des matrices A et B
    const resultMatrix = addMatrices(matrixA, matrixB);

    // Génération des images
    const attachmentStatement = new AttachmentBuilder(
      `https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;A=${encodeURIComponent(
        matrixToLatex(matrixA)
      )}&space;B=${encodeURIComponent(matrixToLatex(matrixB))}`,
      { name: "matrices.png" }
    );
    const attachmentResult = new AttachmentBuilder(
      `https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;A&space;+&space;B&space;=&space;${encodeURIComponent(
        matrixToLatex(resultMatrix)
      )}`,
      { name: "SPOILER_result.png" }
    );

    // Envoi de l'énoncé et du résultat à l'utilisateur
    await interaction.user.send({
      content:
        `**Addition de matrices 3x3**\n\n` +
        `Résolvez l'addition des deux matrices suivantes (A + B) :\n`,
      files: [attachmentStatement],
    });
    await interaction.user.send({
      content: `**Solution détaillée :**`,
      files: [attachmentResult],
    });
  },
};
