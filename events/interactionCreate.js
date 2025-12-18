const Discord = require("discord.js");

module.exports = async (bot, interaction) => {
  if (interaction.type === Discord.InteractionType.ApplicationCommand) {
    if (
      interaction.channelId !== "1302682242157383762" &&
      interaction.channelId !== "1451143867905740831"
    ) {
      return interaction.reply({
        content:
          "Vous ne pouvez utiliser cette commande que dans les threads suivants :\n- **Algèbre** : <#1302682242157383762>\n- **Recherche opérationnelle** : <#1451143867905740831>.",
        ephemeral: true,
      });
    }

    try {
      await interaction.deferReply();

      let command = bot.commands.get(interaction.commandName);
      if (command && typeof command.run === "function") {
        try {
          await command.run(bot, interaction, command.options);
          if (interaction.commandName !== "help")
            await interaction.editReply("Exercice envoyé en MP.");
        } catch (error) {
          console.error(error);
          if (error instanceof Discord.DiscordAPIError) {
            await interaction.editReply(
              `Impossible d'envoyer un message privé, vérifiez que vous avez bien activé ce paramètre.`
            );
          } else {
            await interaction.editReply(
              "Une erreur s'est produite lors de l'exécution de cette commande : " +
                error
            );
          }
        }
      } else {
        await interaction.editReply("La commande est invalide.");
      }
    } catch (error) {
      console.error(
        `Erreur lors de l'exécution de la commande ${interaction.commandName}:`,
        error
      );
      if (!interaction.replied) {
        await interaction.followUp({
          content:
            "Une erreur s'est produite lors de l'exécution de cette commande.",
        });
      } else {
        await interaction.editReply(
          "Une erreur supplémentaire s'est produite."
        );
      }
    }
  }
};
