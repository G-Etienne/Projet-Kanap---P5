// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction qui récupérer l'id de commande dans l'url de la page 
//Elle fait ensuite appelle à la fonction création pour l'afficher sur la page

function idRecuperation(){

    const idOrder = window.location.search;
    const whatPartOfUrl = new URLSearchParams(idOrder)
    const myIdOrder = whatPartOfUrl.get('id')

    creation(myIdOrder)

}

// ------------------------------------- ************************************************************* ---------------------------------------
// ----------- Fonction qui affiche l'id de commande sur la page et néttoie le local storage

function creation(id){

    const numberOrder = document.querySelector('#orderId');
    numberOrder.innerHTML = id;
    
    localStorage.removeItem('basket')

}
// ------------------------------------- ************************************************************* ---------------------------------------


idRecuperation()