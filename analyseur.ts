//

//

export class Analyseur {
  verifierSyntaxe(contenu: string[] = []) {
    if (!contenu.length) {
      return ['Le text est vide !'];
    }

    return contenu.reduce((erreurs, ligne, i) => {
      if (!ligne.includes(' = ')) {
        return [...erreurs, `Ligne ${i + 1} : "=" manquant`];
      }

      //test + sans suite ou sans début

      //test [ sans ], sans variable avant, ou sans variable entre

      //test _ sans variable dans la source, ou sans nom de variable

      //test $ sans être au début ou après un +, $ sans nom

      //test complexes/"sémantiques" ? variables non-instanciables ou valeurs inexistantes (collisions ??); nb variables == nb valeurs...

      return erreurs
    }, [] as string[]);
  }
}
