# Kanap #
Site de vente de canapés en ligne.

La mission de ce projet était d'intégrer des éléments retournés par une API simple local qui était fournit (dossier back).

La grande partie de l'intégration avait également été fournit.

Les principales tâches de cette mission étaient de : 

  - Récupérer les données fournit par l'API (une liste de produit mis en ventes).
    
  - Les intégrés de manière dynamique à l'aide du JavaScript et de la manipulation du DOM.
    
  - De créer la possibilité pour les utilisateurs de faire une liste de produit à acheter.
    - Cette liste est stockée dans le local storage du navigateur.
    - C'est une liste simple avec un id de produit, une couleur et une quantité.
      
  - La liste peut être modifiée à tous moment sur la page panier du site.
    
  - Une fois que l'utilisateur a créé sa liste il est capable de passer commande en remplissant le formulaire.

 Pour plus d'info, voici une vidéo explicative : https://www.youtube.com/watch?v=co5qpvyblYY 

 ARCHITECTURE DU CODE JS DYNAMIQUE :

 - Dans : front > js :
   - Le fichier cart.js --> rassemble le code qui permet à l'utilisateur de gérer sa page panier et de passer sa commande à l'aide du formulaire.
     
   - Le fichier confirmation.js --> rassemble le code qui récupère l'id de commande (une fois la commande passée) pour l'afficher ensuite sur la page confirmation.
     
   - Le fichier products.js --> rassemble le code à afficher sur la page de détail d'un produit et qui permet également à l'utilisateur de choisir une quantité et une couleur pour le produit en question.
     
   - Le fichier script.js --> rassemble le code qui récupère les informations des produits pour les afficher sur la page d'accueil.
  

LE BACK : 

C'est une API fournit dans le projet, elle est construite à l'aide de Node.js et express.js.
