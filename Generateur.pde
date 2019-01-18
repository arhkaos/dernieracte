ArrayList<Regle> regles;

void setup(){
  size(200,200);
  
  println("\n\n -_-_-_- Tests fichier -_-_-_-\n");
  Fichier fichier = new Fichier("test initial.gen");
  fichier.afficher();
  if(fichier.erreurs.size() > 0) { 
    return; 
  }
  
  println("\n\n -_-_-_- Tests syntaxe -_-_-_-\n");
  for(int i = 0; i < fichier.contenu.length; i++){
    Regle test = new Regle(fichier.contenu[i]);
    test.afficher();
  }
  
  println("___");
  
  regles = new ArrayList<Regle>();
  for(String sym : fichier.contenu){
    Regle nvl = new Regle(sym);
    boolean fusion = false;
    for(Regle r : regles){
      if(r.racine.equals(nvl.racine) && r.nbVariables == nvl.nbVariables){
        r.fusionner(nvl); fusion = true;
      }
    }
    if(!fusion){
      regles.add(nvl);
    }
  }
  
  println(regles.size() + " règles ");
  for(Regle r : regles){
    r.afficher();
  }
  
  for(Regle r : regles){
    for(String s : r.produits){
      println(r.source + " = " + s + " : " + syntaxePrioritaire(s));
    }
  }
  
  println("\n\n -_-_-_- Tests génération -_-_-_-\n");
  int nbGen = 100;
  for(int i = 0; i < nbGen; i++) {
    String gen = generer("$P");
    println(i + " : " + gen);
  }
}
