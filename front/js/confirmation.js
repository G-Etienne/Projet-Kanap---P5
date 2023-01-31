// ------------------------------------- ************************************************************* ---------------------------------------
// ----------- Fonction qui affiche l'id de commande sur la page et néttoie le local storage
// Elle prend en paramètre l’id de commande.
// Elle récupère le nœud du DOM pour afficher l’id de commande.
// Elle affiche ce numéro sur la page.
// Elle supprime la liste des produits du panier.

// Besoin Précis → afficher l’id du panier et nettoyer le localStorage.

function creation(id){

    const numberOrder = document.querySelector('#orderId');
    numberOrder.innerHTML = id;
    
    localStorage.removeItem('basket')

}
// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction qui récupérer l'id de commande dans l'url de la page 
// Elle récupère l’id de commande dans l’url de la page.
// Appel la fonction creation() avec cet id en paramètre.

// Besoin Précis → récupérer l’id de commande dans l’url de la page.

function idRecuperation(){

    const idOrder = window.location.search;
    const whatPartOfUrl = new URLSearchParams(idOrder)
    const myIdOrder = whatPartOfUrl.get('id')

    creation(myIdOrder)

}

// ------------------------------------- ************************************************************* ---------------------------------------


idRecuperation()