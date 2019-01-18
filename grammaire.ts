import { Regle } from './regles';

//

export function racine(symbole: string) {
  return symbole.includes('[')
    ? symbole.substring(0, symbole.indexOf('['))
    : symbole;
}

export function variables(symbole: string) {
  return symbole.includes('[')
    ? symbole.substring(symbole.indexOf('[') + 1, symbole.indexOf(']'))
    : 'NULL';
}

export function nbTransmissibles(symbole: string) {
  if (!symbole.includes('[')) {
    return 0;
  }

  return variables(symbole)
    .split(' + ')
    .reduce((acc, s) => (s.charAt(0) === '_' ? acc + 1 : acc), 0);
}

export function nbVariables(symbole: string) {
  if (!symbole.includes('[')) {
    return 0;
  }

  return variables(symbole).split(' + ').length;
}

/* vers SyntaxeZ */

/* Grammaire =
  '_' = variables à transmettre  -> pas dans le symbole à traiter mais dans la règle à appliquer
  '+' = séquence à diviser
  '[' = variables à remplir
  '$' = résultat à choisir
  'A' = texte plein
*/

export function syntaxePrioritaire(symbole: string) {
  let inter = 0;
  for (let i = 0; i < symbole.length; i++) {
    switch (symbole.charAt(i)) {
      case '[':
        inter++;
        break;
      case ']':
        inter--;
        break;
      case '+':
        if (inter == 0) return '+';
    }
  }

  if (variableAGenerer(symbole)) return '[';

  if (symbole.startsWith('$')) return '$';

  return 'A';
}

export function variableAGenerer(symbole: string) {
  if (!symbole.includes('[') || !symbole.includes('$')) {
    return false;
  }
  let inter = 0;
  for (let i = 0; i < symbole.length; i++) {
    switch (symbole.charAt(i)) {
      case '[':
        inter++;
        break;
      case ']':
        inter--;
        break;
      case '$':
        if (inter > 0) return true;
    }
  }
  return false;
}

export function generer(regles: Regle[], symbole: string): string {
  switch (syntaxePrioritaire(symbole)) {
    case '+': {
      const casse = symbole.split(' + ');

      const reconstruction = casse.reduce(
        (r, c) => r + generer(regles, c) + ' ',
        ''
      ); // Gérer la ponctuation sur un passage final
      return reconstruction.substring(0, reconstruction.length);
    }
    case '[': {
      return generer(
        regles,
        racine(symbole) + '[' + generer(regles, variables(symbole)) + ']'
      );
    }
    case '$': {
      return generer(
        regles,
        choisir(regles, symbole)
      ); /*generer(transmettreVariables(choisir(symbole), variables(symbole));*/
    }
    default: {
      return symbole;
    }
  }
}

export function choisir(regles: Regle[], symbole: string) {
  const r = regleApplicable(regles, symbole);

  const product = r.produits[Math.floor(Math.random() * r.produits.length)];

  if (nbVariables(symbole) === 0) {
    return product;
  }
  return transmissionVariables(
    product,
    variables(r.source),
    variables(symbole)
  );
}

function transmissionVariables(
  symbole: string,
  variables: string,
  valeurs: string
) {
  const vars = variables.split(' + ');
  const vals = valeurs.split(' + ');
  //verifier vars.length == vals.length ??

  return vars.reduce(
    (resultat, uneVar, i) => resultat.replace(uneVar, vals[i]),
    symbole
  );
}

// Faut-il créer une règle NULL ?
export function regleApplicable(regles: Regle[], symbole: string) {
  const r = regles.find(
    r => r.racine === racine(symbole) && r.nbVariables == nbVariables(symbole)
  );

  return r || new Regle('BUGSource = BUGProduit');
}
