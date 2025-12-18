const fs = require('fs');
const path = require('path');

const loadDir = (bot, dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.lstatSync(fullPath);

        if (stat.isDirectory()) {
            loadDir(bot, fullPath);
        } else if (file.endsWith('.js')) {
            const command = require(path.resolve(fullPath));
            if (!command.name || typeof command.name !== "string") {
                 console.warn(`La commande ${file} n'a pas de nom ou malformée !`);
                 continue;
            }
            bot.commands.set(command.name, command);
            console.log(`Commande ${file} chargée avec succès !`);
        }
    }
};

module.exports = async bot => {
    loadDir(bot, './commands');
}