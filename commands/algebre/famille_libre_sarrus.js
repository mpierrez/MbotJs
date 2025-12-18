const { AttachmentBuilder } = require("discord.js");
const { familyToLatex } = require("../../utils/latex");
const {
  generateFamilyNotLinearlyDependent,
  generateFamilyLinearlyDependent,
} = require("../../utils/family");

module.exports = {
  name: "famille_libre_sarrus",
  description: "Déterminer si une famille est libre avec la méthode de Sarrus",
  category: "algebre",

  async run(bot, interaction) {
    const { family } =
      Math.random() < 0.5
        ? generateFamilyLinearlyDependent()
        : generateFamilyNotLinearlyDependent();

    const sumRed = family[0][0] * family[1][1] * family[2][2];
    const sumGreen = family[1][0] * family[2][1] * family[0][2];
    const sumBlue = family[2][0] * family[0][1] * family[1][2];

    const sumRed2 = family[2][0] * family[1][1] * family[0][2];
    const sumGreen2 = family[0][0] * family[2][1] * family[1][2];
    const sumBlue2 = family[1][0] * family[0][1] * family[2][2];

    const sum = sumRed + sumGreen + sumBlue;
    const sum2 = sumRed2 + sumGreen2 + sumBlue2;

    // Enoncé de l'exercice
    const statement =
      `**Détermination de la liberté d'une famille avec Sarrus**\n\n` +
      `Déterminez si la famille suivante est libre en utilisant la méthode de Sarrus :\n`;

    // Résultat de l'exercice
    const latexResult = `\\begin{array}{c}
        \\text{-} \\\\\\\\

        \\text{Une mani\\\`{e}re simple de d\\'{e}terminer si une famille de vecteurs est libre est de v\\'{e}rifier si le d\\'{e}terminant des vecteurs est non nul.} \\\\

        \\textbf{V\\'{e}rification :} \\\\
        \\text{Calculons le d\\'{e}terminant de la famille de vecteurs suivante :} \\\\
        \\begin{vmatrix}
            ${family[0][0]} & ${family[0][1]} & ${family[0][2]} \\\\
            ${family[1][0]} & ${family[1][1]} & ${family[1][2]} \\\\
            ${family[2][0]} & ${family[2][1]} & ${family[2][2]} \\\\
        \\textbf{${family[0][0]}} & \\textbf{{${family[0][1]}}} & \\textbf{{${
      family[0][2]
    }}} \\\\
        \\textbf{${family[1][0]}} & \\textbf{${family[1][1]}} & \\textbf{{${
      family[1][2]
    }}} \\\\
        \\end{vmatrix} \\\\\\\\

        \\text{On va ensuite mettre en \\'{e}vidence les couleurs des \\textbf{diagonales de gauche à droite} de la matrice.} \\\\

        \\begin{vmatrix}
        {\\color{Red} ${family[0][0]}} & ${family[0][1]} & ${family[0][2]} \\\\
        {\\color{DarkGreen} ${family[1][0]}} & {\\color{Red} ${
      family[1][1]
    }} & ${family[1][2]} \\\\
        {\\color{Blue} ${family[2][0]}} & {\\color{DarkGreen} ${
      family[2][1]
    }} & {\\color{Red} ${family[2][2]}} \\\\
        ${family[0][0]} & {\\color{Blue} ${
      family[0][1]
    }} & {\\color{DarkGreen} ${family[0][2]}} \\\\
        ${family[1][0]} & ${family[1][1]} & {\\color{Blue} ${family[1][2]}} \\\\
        \\end{vmatrix} \\\\\\\\

        \\text{Nous allons commencer par les multiplications des \\'{e}l\\'{e}ments suivant les couleurs \\textbf{de gauche \\\`{a} droite} (suivez les couleurs).} \\\\
        \\text{On commence par la \\textbf{diagonale rouge} : (${
          family[0][0]
        } × ${family[1][1]} × ${family[2][2]} = ${sumRed})} \\\\
        \\text{On passe ensuite \\\`{a} la \\textbf{diagonale verte} : (${
          family[1][0]
        } × ${family[2][1]} × ${family[0][2]} = ${sumGreen})} \\\\
        \\text{Enfin, on passe \\\`{a} la \\textbf{diagonale bleue} : (${
          family[2][0]
        } × ${family[0][1]} × ${family[1][2]} = ${sumBlue})} \\\\
        \\text{Une fois les diagonales finies, nous allons additionner les trois r\\'{e}sultats obtenus : (${sumRed} + ${sumGreen} + ${sumBlue} = ${sum})} \\\\\\\\
    
        \\text{Ensuite, nous allons r\\'{e}p\\'{e}ter le processus, mais cette fois-ci, nous allons multiplier de \\textbf{droite \\\`{a} gauche}. Concentrons-nous \\\`{a} nouveau sur les couleurs :} \\\\
        
        \\begin{vmatrix}
        ${family[0][0]} & ${family[0][1]} & {\\color{Red} ${family[0][2]}} \\\\
        ${family[1][0]} & {\\color{Red} ${
      family[1][1]
    }} & {\\color{DarkGreen} ${family[1][2]}} \\\\
        {\\color{Red} ${family[2][0]}} & {\\color{DarkGreen} ${
      family[2][1]
    }} & {\\color{Blue} ${family[2][2]}} \\\\
        {\\color{DarkGreen} ${family[0][0]}} & {\\color{Blue} ${
      family[0][1]
    }} & ${family[0][2]} \\\\
        {\\color{Blue} ${family[1][0]}} & ${family[1][1]} & ${family[1][2]} \\\\
        \\end{vmatrix} \\\\\\\\
        
        \\text{On commence par la \\textbf{diagonale rouge} : (${
          family[0][2]
        } × ${family[1][1]} × ${family[2][0]} = ${sumRed2})} \\\\
        \\text{On passe ensuite \\\`{a} la \\textbf{diagonale verte} : (${
          family[1][2]
        } × ${family[2][1]} × ${family[0][0]} = ${sumGreen2})} \\\\
        \\text{Enfin, on passe \\\`{a} la \\textbf{diagonale bleue} : (${
          family[2][2]
        } × ${family[0][1]} × ${family[1][0]} = ${sumBlue2})} \\\\
        \\text{Une fois les diagonales finies, nous allons additionner \\'{e}galement les trois r\\'{e}sultats obtenus : (${sumRed2} + ${sumGreen2} + ${sumBlue2} = ${sum2})} \\\\\\\\
        \\text{Pour obtenir le d\\'{e}terminant de la matrice, il ne nous reste plus qu'\\\`{a} soustraire les deux sommes obtenues (de gauche \\\`{a} droite et de droite \\\`{a} gauche) : (${sum} - ${sum2} = ${
      sum - sum2
    })} \\\\\\\\
        \\textbf{Le d\\'{e}terminant de la matrice est donc : ${
          sum - sum2
        }.} \\\\\\\\

        ${
          sum - sum2 === 0
            ? `\\text{Le déterminant est nul, donc la famille n'est pas libre.}`
            : `\\text{Le déterminant est non nul, donc la famille est libre.}`
        } \\\\\\\\

        \\text{-} \\\\
        \\end{array}`;

    // Génération des images
    const attachmentStatement = new AttachmentBuilder(
      `https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;\\begin{align}${encodeURIComponent(
        familyToLatex(family)
      )}\\end{align}`,
      { name: "family.png" }
    );
    const attachmentResult = new AttachmentBuilder(
      `https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;${encodeURIComponent(
        latexResult
      )}`,
      { name: "SPOILER_result.png" }
    );

    // Envoi de l'énoncé et de la solution à l'utilisateur
    await interaction.user.send({
      content: statement,
      files: [attachmentStatement],
    });
    await interaction.user.send({
      content: `**Solution détaillée :**`,
      files: [attachmentResult],
    });
  },
};
