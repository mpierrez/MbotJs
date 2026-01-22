const { AttachmentBuilder } = require("discord.js");
const { generateKruskalProblem } = require("../../utils/logic");
const { compile } = require("../../utils/typst");

module.exports = {
  name: "kruskal",
  description: "Générer un exercice sur l'algorithme de Kruskal",
  category: "recherche_operationnelle",

  async run(bot, interaction) {
    await interaction.editReply("Génération de l'exercice en cours...");

    const problem = generateKruskalProblem();

    // 1. Generate Statement Image
    const statementPath = compile(
      `kruskal_stmt_${interaction.id}`,
      problem.typst.statement,
    );

    if (!statementPath) {
      await interaction.followUp("Erreur lors de la génération de l'énoncé.");
      return;
    }

    const statementFile = new AttachmentBuilder(statementPath, {
      name: "exercice_kruskal.png",
    });

    await interaction.user.send({
      content: `## Exercice : Algorithme de Kruskal\n${problem.scenario}`,
      files: [statementFile],
    });

    // 2. Generate Solution Image
    const solutionPath = compile(
      `kruskal_sol_${interaction.id}`,
      problem.typst.solution,
    );

    if (!solutionPath) {
      await interaction.followUp(
        "Erreur lors de la génération de la solution.",
      );
      return;
    }

    const solutionFile = new AttachmentBuilder(solutionPath, {
      name: "SPOILER_solution.png",
    });

    await interaction.user.send({
      content: `**Correction**`,
      files: [solutionFile],
    });
  },
};
