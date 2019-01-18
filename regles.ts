import { racine, nbVariables, nbTransmissibles } from "./grammaire";

//

export class Regle {
  source: string;
  racine: string;
  nbVariables: number;
  nbTransmissions: number;
  produits: string[];

  //

  constructor(ligne: string) {
    const [source, produit] = ligne.split(' = ');
    this.source = source;
    this.racine = racine(source);
    this.nbVariables = nbVariables(source);
    this.nbTransmissions = nbTransmissibles(source);
    this.produits = [produit];
  }

  // pour affichage ou log
  regleAffichable() {
    const prefix = `${this.source}(${this.racine}, ${this.nbTransmissions}/${
      this.nbVariables
    }) = `;
    const regle = this.produits.reduce(
      (resultat, produit) => resultat + produit + ' || ',
      prefix
    );
    return regle.substring(0, regle.length - 4);
  }

  afficher() {
    console.log(this.regleAffichable());
  }

  fusionner(r: Regle) {
    this.produits = this.produits.concat(r.produits);
    return this;
  }

  generer() {
    return this.produits[Math.floor(Math.random() * this.produits.length)];
  }
}
