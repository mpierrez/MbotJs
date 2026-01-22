const { AttachmentBuilder } = require("discord.js");
const { generatePrimProblem } = require("../../utils/logic");
const { compile } = require("../../utils/typst");

module.exports = {
  name: "prim",
  description: "Générer un exercice sur l'algorithme de Prim",
  category: "recherche_operationnelle",

  async run(bot, interaction) {
    await interaction.editReply("Génération de l'exercice en cours...");

    const problem = generatePrimProblem();

    // 1. Generate Statement Image
    const statementPath = compile(
      `prim_stmt_${interaction.id}`,
      problem.typst.statement,
    );

    if (!statementPath) {
      await interaction.followUp("Erreur lors de la génération de l'énoncé.");
      return;
    }

    const statementFile = new AttachmentBuilder(statementPath, {
      name: "exercice_prim.png",
    });

    await interaction.user.send({
      content: `## Exercice : Algorithme de Prim\n${problem.scenario}`,
      files: [statementFile],
    });

    // 2. Generate Solution Image
    const solutionPath = compile(
      `prim_sol_${interaction.id}`,
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
