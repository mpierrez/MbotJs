const { AttachmentBuilder } = require("discord.js");
const { generateGraphProblem } = require("../../utils/logic");
const { compile } = require("../../utils/typst");

module.exports = {
  name: "graphe_biparti",
  description: "Dessiner un graphe biparti à partir d'une situation donnée",
  category: "recherche_operationnelle",

  async run(bot, interaction) {
    await interaction.editReply("Génération de l'exercice en cours...");

    const problem = generateGraphProblem();

    const embedContent =
      `## Exercice : Graphe biparti\n` +
      `${problem.scenario}\n` +
      `\n**Questions :**\n` +
      `1. Comment représenter cette situation par un graphe ?\n` +
      `2. Combien faudra-t-il de plages horaires au minimum ?`;

    await interaction.user.send({ content: embedContent });

    const combinedPath = compile(
      `graph_${interaction.id}`,
      problem.typst.solution
    );

    if (!combinedPath) {
      await interaction.followUp(
        "Erreur lors de la génération de l'image de solution."
      );
      return;
    }

    const file = new AttachmentBuilder(combinedPath, {
      name: "SPOILER_solution.png",
    });

    await interaction.user.send({
      content: `**Correction**`,
      files: [file],
    });
  },
};
