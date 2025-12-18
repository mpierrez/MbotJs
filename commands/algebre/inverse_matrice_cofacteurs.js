const { AttachmentBuilder } = require("discord.js");
const {
  getCofactor,
  generateMatrix,
  determinantSarrus,
  generateEasyMatrix,
} = require("../../utils/matrix");
const { matrixToLatex } = require("../../utils/latex");

module.exports = {
  name: "inverse_matrice_cofacteurs",
  description:
    "Trouver l'inverse d'une matrice 3x3 avec la méthode des cofacteurs",
  category: "algebre",

  async run(bot, interaction) {
    const matrix = generateEasyMatrix(3);
    const c11 = getCofactor(matrix, 1, 1);
    const c12 = getCofactor(matrix, 1, 2);
    const c13 = getCofactor(matrix, 1, 3);

    const c21 = getCofactor(matrix, 2, 1);
    const c22 = getCofactor(matrix, 2, 2);
    const c23 = getCofactor(matrix, 2, 3);

    const c31 = getCofactor(matrix, 3, 1);
    const c32 = getCofactor(matrix, 3, 2);
    const c33 = getCofactor(matrix, 3, 3);

    const det = determinantSarrus(matrix);

    const comatrix = [
      [c11, c12, c13],
      [c21, c22, c23],
      [c31, c32, c33],
    ];

    const transposedComatrix = [
      [c11, c21, c31],
      [c12, c22, c32],
      [c13, c23, c33],
    ];

    const inverseMatrix = [
      [c11 / det, c21 / det, c31 / det],
      [c12 / det, c22 / det, c32 / det],
      [c13 / det, c23 / det, c33 / det],
    ];

    // Enoncé de l'exercice
    const statement =
      `**Inverse d'une matrice 3x3 avec la méthode des cofacteurs**\n\n` +
      `Trouvez l'inverse de la matrice M en utilisant la méthode des cofacteurs :\n`;

    // Résultat de l'exercice
    const explanation = `\\begin{array}{c}
        \\text{-} \\\\\\\\
        \\text{Nous avons la matrice suivante :} \\\\
        M = ${matrixToLatex(matrix)} \\\\\\\\
        
        \\text{Pour rappel, la formule pour calculer l'inverse d'une matrice 3x3 est la suivante :} \\\\
        M^{-1} = \\frac{1}{\\text{det}} * Com(M)^T \\\\\\\\
        \\text{Avec det le determinant de M} \\\\\\\\
        \\text{et } Com(M)^T \\text{ la transposee de la comatrice de M} \\\\
        \\text{(beaucoup de mots compliques, vous inquietez pas on va y revenir)} \\\\\\\\

        \\text{Commencons par calculer le determinant de la matrice M} \\\\
        \\text{Je vais pas detailler mais normalement, vous devriez trouver un determinant de : } ${det} \\\\\\\\

        \\text{Une comatrice c'est ca :} \\\\
        Com(M) = \\begin{pmatrix}
            C_{1,1} & C_{1,2} & C_{1,3} \\\\
            C_{2,1} & C_{2,2} & C_{2,3} \\\\
            C_{3,1} & C_{3,2} & C_{3,3} \\\\
        \\end{pmatrix} \\\\\\\\

        \\text{Pour calculer la comatrice de M, nous allons donc calculer les cofacteurs de chaque element de la matrice : } \\\\\\\\

        C_{1,1} = (${matrix[1][1]} * ${matrix[2][2]}) - (${matrix[1][2]} * ${
      matrix[2][1]
    }) = ${c11} \\qquad\\qquad\\qquad C_{1,2} = {\\color{Red}-1} * [(${
      matrix[1][0]
    } * ${matrix[2][2]}) - (${matrix[1][2]} * ${
      matrix[2][0]
    })] = ${c12} \\qquad\\qquad\\qquad C_{1,3} = (${matrix[1][0]} * ${
      matrix[2][1]
    }) - (${matrix[1][1]} * ${matrix[2][0]}) = ${c13} \\\\\\\
        C_{2,1} = {\\color{Red}-1} * [(${matrix[0][1]} * ${matrix[2][2]}) - (${
      matrix[0][2]
    } * ${matrix[2][1]})] = ${c21} \\qquad\\qquad\\qquad C_{2,2} = (${
      matrix[0][0]
    } * ${matrix[2][2]}) - (${matrix[0][2]} * ${
      matrix[2][0]
    }) = ${c22} \\qquad\\qquad\\qquad C_{2,3} = {\\color{Red}-1} * [(${
      matrix[0][0]
    } * ${matrix[2][1]}) - (${matrix[0][1]} * ${matrix[2][0]})] = ${c23} \\\\\\\
        C_{3,1} = (${matrix[0][1]} * ${matrix[1][2]}) - (${matrix[0][2]} * ${
      matrix[1][1]
    }) = ${c31} \\qquad\\qquad\\qquad C_{3,2} = {\\color{Red}-1} * [(${
      matrix[0][0]
    } * ${matrix[1][2]}) - (${matrix[0][2]} * ${
      matrix[1][0]
    })] = ${c32} \\qquad\\qquad\\qquad C_{3,3} = (${matrix[0][0]} * ${
      matrix[1][1]
    }) - (${matrix[0][1]} * ${matrix[1][0]}) = ${c33} \\\\\\\\\\\
        
        \\textbf{Quand la somme des indices de l'element est impaire, il faut inverser le signe du resultat (car on multiplie par -1)} \\\\\\\\

        \\text{Ce qui nous donne la comatrice suivante :} \\\\
        Com(M) = ${matrixToLatex(comatrix)} \\\\\\\\

        \\text{Il ne reste plus qu'a transposer cette matrice, c'est a dire que les lignes deviennent les colonnes soit :} \\\\
        Com(M)^T = ${matrixToLatex(transposedComatrix)} \\\\\\\\

        \\text{On a donc notre equation finale : }

        M^{-1} = \\frac{1}{${det}} * ${matrixToLatex(
      transposedComatrix
    )} \\\\\\\\

        \\textbf{L'inverse de la matrice M est donc :} \\\\
        M^{-1} = ${matrixToLatex(inverseMatrix)} \\\\\\\\
        \\text{-} \\\\
        \\end{array}`;

    // Génération des images
    const attachmentStatement = new AttachmentBuilder(
      `https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;\\begin{align}M=${encodeURIComponent(
        matrixToLatex(matrix)
      )}\\end{align}`,
      { name: "matrix.png" }
    );
    const attachmentResult = new AttachmentBuilder(
      `https://latex.codecogs.com/png.latex?\\dpi{300}&space;\\bg_white&space;${encodeURIComponent(
        explanation
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
