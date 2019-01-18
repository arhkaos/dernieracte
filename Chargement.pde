class Fichier {
  String nom;
  String[] contenu;
  ArrayList<String> erreurs;
  //méta ? syntaxe annoncée ? règles d'assemblage ? avec conditions d'accès ? 
  // !!! nb de règles qui pourrait théoriquement excéder les int qui les manient plus loin !!!
  
  Fichier(String nomFichier){
    nom = nomFichier;
    contenu = loadStrings(nomFichier);
    erreurs = new ArrayList<String>();
    verifierSyntaxe();
  }
  
  void afficher(){
    if(erreurs.size() == 0){
      for(int i = 0; i < contenu.length; i++){
        println(contenu[i]);
      }
    }
    else {
      println("!! " + erreurs.size() + " ERREURS dans " + nom + " !!");
      for(int i = 0; i < erreurs.size(); i++){
        println("   " + erreurs.get(i));
      }
    }
  }
  
  void verifierSyntaxe(){
    if(contenu.length < 1) { erreurs.add("FICHIER VIDE"); }
    
    for(int i = 0; i < contenu.length; i++){
      if(!contenu[i].contains(" = ")){
        erreurs.add("ligne " + (i + 1) + " : '=' manquant");
      }
      //test + sans suite ou sans début
      
      //test [ sans ], sans variable avant, ou sans variable entre
      
      //test _ sans variable dans la source, ou sans nom de variable
      
      //test $ sans être au début ou après un +, $ sans nom
      
      //test complexes/"sémantiques" ? variables non-instanciables ou valeurs inexistantes (collisions ??); nb variables == nb valeurs...
      
    }
  }
}
