module.exports = {
    name: "help",
    description: "Lister tous les exercices",

    async run(bot, interaction) {
        const data = [];
        data.push('Voici la liste de tous les exercices:');
        bot.commands.forEach(command => {
            if (command.name === "help") return;
            data.push(`- \`/${command.name}\` : ${command.description}`);
        });

        const responseMessage = data.join('\n');

        if (responseMessage) {
            await interaction.editReply(responseMessage);
        } else {
            await interaction.editReply('Aucune commande disponible.');
        }
    }
};