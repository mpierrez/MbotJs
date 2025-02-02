function generateObviousFamilyLinearlyDependent() {
    // Générer des coefficients aléatoires
    let a = Math.floor(Math.random() * 11) - 5;
    let b = Math.floor(Math.random() * 11) - 5;
    let c = Math.floor(Math.random() * 11) - 5;

    let d = Math.floor(Math.random() * 11) - 5;
    let e = Math.floor(Math.random() * 11) - 5;
    let f = Math.floor(Math.random() * 11) - 5;

    // Appliquer une relation entre les vecteurs
    // Choisir une relation aléatoire
    let relationType = Math.floor(Math.random() * 6); // 0: v1+v2=v3, 1: v1*v2=v3, 2: 2v1=v2+v3
    let g, h, i;

    if (relationType === 0) {
        // Relation v1 + v2 = v3
        g = a + d;
        h = b + e;
        i = c + f;
        explanation = `chaque composante du troisieme vecteur est la somme des composantes correspondantes des deux premiers vecteurs`
        explanation2 = `En d autres termes, v1 + v2 = v3 \\textit{(ou v3 - v2 = v1 ou v3 - v1 = v2)}:`;
        explanation3 = `({\\color{Red}${a}} + {\\color{DarkGreen}${d}}, {\\color{Red}${b}} + {\\color{DarkGreen}${e}}, {\\color{Red}${c}} + {\\color{DarkGreen}${f}}) = ({\\color{Blue}${g}}, {\\color{Blue}${h}}, {\\color{Blue}${i}}).`;

    } else if (relationType === 1) {
        // Relation v1 * v2 = v3
        g = a * d;
        h = b * e;
        i = c * f;
        explanation = `chaque composante du troisieme vecteur est le produit des composantes correspondantes des deux premiers vecteurs`
        explanation2 = `En d'autres termes, v1 * v2 = v3 \\textit{(ou v3 / v2 = v1 ou v3 / v1 = v2)}:`;
        explanation3 = `({\\color{Red}${a}} * {\\color{DarkGreen}${d}}, {\\color{Red}${b}} * {\\color{DarkGreen}${e}}, {\\color{Red}${c}} * {\\color{DarkGreen}${f}}) = ({\\color{Blue}${g}}, {\\color{Blue}${h}}, {\\color{Blue}${i}}).`;
    } else if (relationType === 2) {
        // Relation v1 * v3 = v2
        g = a * d;
        h = b * e;
        i = c * f;
        explanation = `chaque composante du deuxieme vecteur est le produit des composantes correspondantes du premier vecteur et du troisieme vecteur`
        explanation2 = `En d'autres termes, v1 * v3 = v2 \\textit{(ou v2 / v3 = v1 ou v2 / v1 = v3)}:`;
        explanation3 = `({\\color{Red}${a}} * {\\color{DarkGreen}${d}}, {\\color{Red}${b}} * {\\color{DarkGreen}${e}}, {\\color{Red}${c}} * {\\color{DarkGreen}${f}}) = ({\\color{Blue}${g}}, {\\color{Blue}${h}}, {\\color{Blue}${i}}).`;
    } else if (relationType === 3) {
        // Relation v1 - v2 = v3
        g = a - d;
        h = b - e;
        i = c - f;
        explanation = `chaque composante du troisieme vecteur est la difference des composantes correspondantes des deux premiers vecteurs`
        explanation2 = `En d'autres termes, v1 - v2 = v3 \\textit{(ou v3 + v2 = v1 ou v1 - v3 = v2)}:`
        explanation3 = `({\\color{Red}${a}} - {\\color{DarkGreen}${d}}, {\\color{Red}${b}} - {\\color{DarkGreen}${e}}, {\\color{Red}${c}} - {\\color{DarkGreen}${f}}) = ({\\color{Blue}${g}}, {\\color{Blue}${h}}, {\\color{Blue}${i}}).`;
    } else {
        // Relation v2 = v1 + v3
        g = a - d;
        h = b - e;
        i = c - f;
        explanation = `chaque composante du deuxieme vecteur est la difference des composantes correspondantes du premier vecteur et du troisieme vecteur`
        explanation2 = `En d'autres termes, v1 - v3 = v2 \\textit{(ou v2 + v3 = v1 ou v1 - v2 = v3)}:`
        explanation3 = `({\\color{Red}${a}} - {\\color{Blue}${g}}, {\\color{Red}${b}} - {\\color{Blue}${h}}, {\\color{Red}${c}} - {\\color{Blue}${i}}) = ({\\color{DarkGreen}${d}}, {\\color{DarkGreen}${e}}, {\\color{DarkGreen}${f}}).`;
    }

    // Créer et retourner la famille de vecteurs
    let family = [
        [a, b, c],
        [d, e, f],
        [g, h, i]
    ];

    return { family, explanation, explanation2, explanation3 };
}


function generateFamilyLinearlyDependent() {
    let family;
    let determinant = -1;
    let a, b, c, d, e, f, g, h, i;
    do {
            a = Math.floor(Math.random() * 11) - 5;
            b = Math.floor(Math.random() * 11) - 5;
            c = Math.floor(Math.random() * 11) - 5;
            d = Math.floor(Math.random() * 11) - 5;
            e = Math.floor(Math.random() * 11) - 5;
            f = Math.floor(Math.random() * 11) - 5;
            g = Math.floor(Math.random() * 11) - 5;
            h = Math.floor(Math.random() * 11) - 5;
            i = Math.floor(Math.random() * 11) - 5;

        determinant = a * e * i + b * f * g + c * d * h - c * e * g - b * d * i - a * f * h;
    } while (determinant != 0);

    family = [
        [a, b, c],
        [d, e, f],
        [g, h, i]
    ];
    return { family };
};

const generateFamilyNotLinearlyDependent = () => {
    let family;
    let determinant = -1;
    let a, b, c, d, e, f, g, h, i;
    do {
         a = Math.floor(Math.random() * 11) - 5;
         b = Math.floor(Math.random() * 11) - 5;
         c = Math.floor(Math.random() * 11) - 5;
         d = Math.floor(Math.random() * 11) - 5;
         e = Math.floor(Math.random() * 11) - 5;
         f = Math.floor(Math.random() * 11) - 5;
         g = Math.floor(Math.random() * 11) - 5;
         h = Math.floor(Math.random() * 11) - 5;
         i = Math.floor(Math.random() * 11) - 5;

        determinant = a * e * i + b * f * g + c * d * h - c * e * g - b * d * i - a * f * h;
    } while (determinant != 0);

    family = [
        [a, b, c],
        [d, e, f],
        [g, h, i]
    ];
    return { family };
};

const determinantSarrus = (family) => {
    const [[a, b, c], [d, e, f], [g, h, i]] = family.family;
    return a * e * i + b * f * g + c * d * h - c * e * g - b * d * i - a * f * h;
}

module.exports = {
    generateFamilyLinearlyDependent, generateFamilyNotLinearlyDependent, generateObviousFamilyLinearlyDependent, determinantSarrus
};