module.exports = {
  name: "help",
  description: "Lister tous les exercices",

  async run(bot, interaction) {
    const data = [];
    data.push("Voici la liste de tous les exercices:");

    // Algèbre
    if (interaction.channelId === "1302682242157383762") {
      bot.commands.forEach((command) => {
        if (command.name === "help") return;
        if (command.category !== "algebre") return;
        data.push(`- \`/${command.name}\` : ${command.description}`);
      });

      // Recherche opérationnelle
    } else if (interaction.channelId === "1451143867905740831") {
      bot.commands.forEach((command) => {
        if (command.name === "help") return;
        if (command.category !== "recherche_operationnelle") return;
        data.push(`- \`/${command.name}\` : ${command.description}`);
      });
    }

    const responseMessage = data.join("\n");

    if (responseMessage) {
      await interaction.editReply(responseMessage);
    } else {
      await interaction.editReply("Aucune commande disponible.");
    }
  },
};
