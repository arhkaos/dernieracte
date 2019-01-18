void afficherTab(String[] strings){
  for(String s : strings){
    print("|" + s + "|");
  }
  print("\n");
}

class Regle{
  String source;
  String racine;
  int nbVariables;
  int nbTransmissions;
  ArrayList<String> produits;
  
  
  Regle(String ligne){
    String[] casse = ligne.split(" = ");
    source = casse[0];
    produits = new ArrayList<String>();
    produits.add(casse[1]);
    racine = racine(source);
    nbVariables = nbVariables(source);
    nbTransmissions = nbTransmissibles(source);
  }
  
  // pour affichage ou log
  String regleAffichable(){
    String regle = source + " (" + racine + ", " + nbTransmissions + "/" + nbVariables + ") = ";
    for(String s : produits){
      regle += s + " || ";
    }
    regle = regle.substring(0, regle.length() - 4) + "\n";
    return regle;
  }
  
  void afficher(){
    print(regleAffichable());
  }
  
  void fusionner(Regle r){
    produits.addAll(r.produits);
  }
  
  String generer(){
    return produits.get(floor(random(produits.size())));
  }
}

String racine(String symbole){
  if(symbole.contains("[")){
    return symbole.substring(0, symbole.indexOf('['));
  }
  return symbole;
}

String variables(String symbole){
  if(symbole.contains("[")){
    return symbole.substring(symbole.indexOf('[') + 1, symbole.indexOf(']')); // Encore fragile si variables imbriquées
  }
  return "NULL";
}

int nbTransmissibles(String symbole){
  if(!symbole.contains("[")) { return 0; }
  else {
    int nb = 0;
    String[] casse = variables(symbole).split(" \\+ ");
    for(String s : casse){
      if(s.charAt(0) == '_') { nb++; }
    }
    return nb;
  }
}

int nbVariables(String symbole){
  if(!symbole.contains("[")) { return 0; }
  else {
    String[] casse = variables(symbole).split(" \\+ ");
    return casse.length;
  }
}

/* Syntaxe */

/* Grammaire =
  '_' = variables à transmettre  -> pas dans le symbole à traiter mais dans la règle à appliquer
  '+' = séquence à diviser
  '[' = variables à remplir
  '$' = résultat à choisir
  'A' = texte plein
*/

char syntaxePrioritaire(String symbole){
  int inter = 0;
  for(int i = 0; i < symbole.length(); i++){
    switch(symbole.charAt(i)){
      case '[' : inter++; break;
      case ']' : inter--; break;
      case '+' : if(inter == 0) return '+';
    }
  }
  
  if(variableAGenerer(symbole))
    return '[';
  
  if(symbole.startsWith("$"))
    return '$';
  
  return 'A';
}

boolean variableAGenerer(String symbole){
  if(!symbole.contains("[") || !symbole.contains("$")) { return false; }
  int inter = 0;
  for(int i = 0; i < symbole.length(); i++){
    switch(symbole.charAt(i)){
      case '[' : inter++; break;
      case ']' : inter--; break;
      case '$' : if(inter > 0) return true;
    }
  }
  return false;
}

String generer(String symbole){  
  switch(syntaxePrioritaire(symbole)){
    case '+' : { 
      String[] casse = symbole.split(" \\+ ");
      String reconstruction = "";
      for(int i = 0; i < casse.length; i++){
        reconstruction += generer(casse[i]) + " ";         // Gérer la ponctuation sur un passage final
      }
      return reconstruction.substring(0, reconstruction.length() - 1); 
    }
    case '[' : { return generer(racine(symbole) + "[" + generer(variables(symbole)) + "]"); }
    case '$' : {
      String s = choisir(symbole);
      return generer(s);  /*generer(transmettreVariables(choisir(symbole), variables(symbole));*/ 
    }
    default : { return symbole; }
  }
}

String choisir(String symbole){
  Regle r = regleApplicable(symbole);
  if(nbVariables(symbole) == 0){
    return r.produits.get(floor(random(r.produits.size())));
  }
  return transmissionVariables(r.produits.get(floor(random(r.produits.size()))), variables(r.source), variables(symbole));
}

String transmissionVariables(String symbole, String variables, String valeurs){
  String resultat = symbole;
  String[] vars = variables.split(" \\+ ");
  String[] vals = valeurs.split(" \\+ ");
  //verifier vars.length == vals.length ??
  for(int i = 0; i < vars.length; i++){
    resultat = resultat.replaceAll(vars[i], vals[i]);
  }
  
  return resultat;
}

// Faut-il créer une règle NULL ?
Regle regleApplicable(String symbole){
  for(Regle r : regles){
    if(r.racine.equals(racine(symbole)) && r.nbVariables == nbVariables(symbole)){
      return r;
    }
  }
  return new Regle("BUGSource = BUGProduit");
}
