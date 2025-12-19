const { AttachmentBuilder } = require("discord.js");
const { generateSetProblem } = require("../../utils/logic");
const { compile } = require("../../utils/typst");

module.exports = {
  name: "ensembles",
  description:
    "Génère un exercice de théorie des ensembles (Arbre, Karnaugh, Venn)",
  category: "recherche_operationnelle",

  async run(bot, interaction) {
    await interaction.editReply("Génération de l'exercice en cours...");

    const problem = generateSetProblem();

    const embedContent =
      `## Exercice : Théorie des ensembles\n` +
      `*Contexte : ${problem.scenario.name}*\n` +
      `Dans un groupe, nous avons les informations suivantes :\n` +
      problem.statement.map((s) => `- ${s}`).join("\n") +
      `\n\nRéalisez l'arbre de dénombrement, le tableau de Karnaugh et le diagramme de Venn correspondant aux informations de l'énoncé.`;
    await interaction.user.send({ content: embedContent });

    const combinedPath = compile(
      `combined_${interaction.id}`,
      problem.typst.combined
    );

    if (!combinedPath) {
      await interaction.followUp(
        "<@281413501485056000> Erreur lors de la génération de l'image de solution."
      );
      return;
    }

    const file = new AttachmentBuilder(combinedPath, {
      name: "SPOILER_solution.png",
    });

    await interaction.user.send({
      content: `**Correction**\nVoici la vue d'ensemble (Arbre, Karnaugh, Logique, Venn) :`,
      files: [file],
    });
  },
};
