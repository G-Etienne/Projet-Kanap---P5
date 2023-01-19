
// ------- Fonction pour récupérer les données de l'API
async function recup(){

    const listProducts = await fetch('http://127.0.0.1:3000/api/products').then(r => r.json());    
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

// --------- Fonction qui envoie les données dans le localStorage
function storageItem(choicecol, choiceQtt, theIdd){


    //creation d'un objet à envoyer au localStorage
    let choiceOfUser = {
        id : theIdd,
        color : choicecol,
        quantity : parseInt(choiceQtt),
    };
    
    //récupération du localStorage
    let recuperation = JSON.parse(localStorage.getItem('basket'));   


    if (recuperation && choiceOfUser.quantity != 0 && choiceOfUser.color != ""){
        recuperation.push(choiceOfUser)
        localStorage.setItem('basket', JSON.stringify(recuperation))
    }else{
        if (choiceOfUser.quantity != 0 && choiceOfUser.color != "") {
        
            recuperation = [];
            recuperation.push(choiceOfUser)
            localStorage.setItem('basket', JSON.stringify(recuperation))}

    }
    
}

// --------- Fonction qui retourne la quantité et la couleur choisi
function choiceUser(colorValue, quantityValue, idUser){
    const btnAddBasket = document.querySelector('#addToCart')

    //partie choix quantité et couleur 
    btnAddBasket.addEventListener('click', (e) => {
        const choiceColor = colorValue.value;
        const choiceQuantity = quantityValue.value;
        
        storageItem(choiceColor, choiceQuantity, idUser)

    });

}


// --------- Fonction pour construir les blocs HTML

function construction(ima, alt, nameprod, pri, desc, col, idd){

    //element à afficher.
    const theImage = ima;
    const theName = nameprod;
    const thePrice = pri;
    const theDescription = desc;
    let theColors = col;
    let theAltTxt = alt;

    //séléction dess éléments html
    const titleOfPage = document.querySelector('title');
    const imagePlace = document.querySelector('.item__img');
    const namePlace = document.querySelector('#title');
    const pricePlace = document.querySelector('#price');
    const descriptionPlace = document.querySelector('#description');
    const colorsPlace = document.querySelector('#colors');
    const numberPlace = document.querySelector('#quantity');

    //création des options couleurs
    theColors.forEach(color => {

        const option = document.createElement('option');  
        option.setAttribute('value', color)
        option.innerText = color; 
        colorsPlace.append(option)
        
    });

    // création des élément de présentation
    titleOfPage.innerText = theName;
    
    const imagePart = document.createElement('img');
    imagePart.setAttribute('src', theImage)
    imagePart.setAttribute('alt', theAltTxt)
    imagePlace.append(imagePart)

    namePlace.innerText = theName;

    pricePlace.innerHTML = thePrice;

    descriptionPlace.innerText = theDescription;
    
    choiceUser(colorsPlace, numberPlace, idd)


}
// --------- Fonction pour afficher la page avec le bon produit 
async function main(){

    const theProduct = await whatProduct();
    const realProduct = [theProduct[0]];

    //récupération de chaque éléments
    let colorOfProduct;
    let idOfProduct;
    let nameOfProduct;
    let priceOfProduct;
    let imageUrlOfProduct;
    let descriptionOfProduct;
    let altTxtOfProducts;

    
    realProduct.forEach(elem => {

        colorOfProduct = elem.colors; 
        idOfProduct = elem._id; 
        nameOfProduct = elem.name; 
        priceOfProduct = elem.price; 
        imageUrlOfProduct = elem.imageUrl; 
        descriptionOfProduct = elem.description; 
        altTxtOfProducts = elem.altTxt;         

    });
    construction(imageUrlOfProduct, altTxtOfProducts, nameOfProduct, priceOfProduct, descriptionOfProduct, colorOfProduct, idOfProduct)

}

main()