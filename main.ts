import { Analyseur } from "./analyseur";
import { Regle } from "./regles";
import { syntaxePrioritaire, generer } from "./grammaire";

const text = `
$P = $P1[$abspré] + $P2 + $P3[$varia]
$P = $P1[$abspré + lieu]
$varia = nom
$varia = pron
$abspré = vie
$abspré = lieu
$P1 = On dit que Maelen'Arkaï est mort et enterré
$P1[_X] = On dit que Maelen'Arkaï + $absence[_X]
$P1[_X] = On dit que Maelen'Arkaï + $présence[_X] + quelque part
$P1[_X + _Y] = On dit à la fois que Maelen'Arkaï + $présence[_X] + et qu'il + $absence[_Y]
$présence[vie] = est vivant
$présence[lieu] = est là
$absence[vie] = est mort
$absence[lieu] = a disparu
$P2 = On dit qu'il a ouvert les portes de l'Enfer
$P2 = On dit qu'il complote pour faire sombrer l'Univers dans le Néant
$P3[nom] = On dit aussi de Maelen'Arkaï qu'il est le seul rempart face au Chaos
$P3[nom] = On dit aussi de Maelen'Arkaï que sans lui, rien ne serait plus
$P3[pron] = On dit aussi qu'il est le seul rempart face au Chaos
$P3[pron] = On dit aussi que sans lui, rien ne serait plus
`

const requete = ''

const contenu = text.trim().split('\n');
const analyseur = new Analyseur();
const errors = analyseur.verifierSyntaxe(contenu);

const regles: Regle[] = [];

for(let sym of contenu) {
  const nvl = new Regle(sym)
  const memeRegle = regles.find(
    r => r.racine === nvl.racine && r.nbVariables === nvl.nbVariables
  )

  if (memeRegle) {
    memeRegle.fusionner(nvl)
    continue;
  }

  regles.push(nvl);
}

console.log(regles.length + ' règles ');
regles.forEach(r => r.afficher());

for (let r of regles) {
  for (let s of r.produits) {
    const symbol = syntaxePrioritaire(s);
    console.log(`${r.source} = ${s} : ${symbol}`);
  }
}

console.log('\n\n -_-_-_- Tests génération -_-_-_-\n');

//

const nbGen = 100;
Array.from({ length: nbGen }).forEach(async (_, i) => {
  console.log(i + ' : ' + await generer(regles, '$P'));
});

document.querySelector('#racine')!.innerHTML = generer(regles, '$P');

(window as any).aller = function (form: HTMLFormElement) {
    const input = form.querySelector('input[type="text"]') as HTMLInputElement
    alert(input.value)
    return false
}