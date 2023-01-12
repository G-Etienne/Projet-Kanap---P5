
// ------- Fonction pour récupérer les données de l'API
async function recup(){

    const listProducts = await fetch('/api/products').then(r => r.json());    
    return listProducts
}
// ------- Fonction pour récupérer l'id dans l'URL
function IdProduc(){

    const idInUrl = window.location.search;
    const whatPartOfUrl = new URLSearchParams(idInUrl);
    const myId = whatPartOfUrl.get('id');
    
    return myId

}

// ------- Fonction pour déterminer qu'elle produit afficher

async function whatProduct(){

    const listOfProduct = await recup();
    const theId = IdProduc();
    let theElem = [];

    listOfProduct.forEach(element => {

        if (theId == element._id){

            theElem.push(element)

        }
        
    });
    return theElem
}


// --------- Fonction pour afficher la page avec le bon produit 
async function productPage(){

    const theProduct = await whatProduct();
    const realProduct = [theProduct[0]];
    
    realProduct.forEach(elem => {
        
        const nameOfProducts = elem.name; 
        console.log(nameOfProducts)

    });
    


}

productPage()