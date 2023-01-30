
// ------------------------------------- ************************************************************* ---------------------------------------
// --------- Fonction qui envoie les données dans le localStorage
//Elle crée un objet à ajouter dans le local storage 
//récupére les données du local Storage
//regarde si l'objet à ajouter est dans le local storage 
//si il est présent elle met a jour la quantité du produit 
//elle créer une nouvelle liste d'objet avec la quantité mise a jour pour le modèle demander 
//si l'objet à ajouter n'est pas de le local Storage
//elle crée une nouvelle liste avec le nouvel objet en plus 
//si le local storage est vide elle ajoute l'objet à la nouvelle liste 
//elle remplace la liste du local storage par la nouvelle liste 

function storageItem(choicecol, choiceQtt, theIdd){

    //creation d'un objet à envoyer au localStorage
    let choiceOfUser = {

        id : theIdd,
        color : choicecol,
        quantity : parseInt(choiceQtt),

    };
    
    //récupération du localStorage
    let recuperation = JSON.parse(localStorage.getItem('basket'));   

    //nouvelle liste
    let listToPut = [];

    //vérification pour voir si le local storage est vide ou non
    if (recuperation && choiceOfUser.quantity != 0 && choiceOfUser.color != ""){

        let alreadyHere = recuperation.find(e => e.color === choicecol && e.id === theIdd);

        //vérification pour voir si l'objet est déjà présent
        if (alreadyHere){
            
            recuperation.forEach(element => {
                
                if (element.id === theIdd && element.color === choicecol){

                    //mise à jours de la quantité 
                    choiceOfUser.quantity = choiceOfUser.quantity + element.quantity
                    listToPut.push(choiceOfUser)

                }else{

                    listToPut.push(element)

                }
            });

        }else{

            listToPut.push(choiceOfUser)

            recuperation.forEach(ele => {
                
                listToPut.push(ele)

            });
        }

    }else{

        if (choiceOfUser.quantity != 0 && choiceOfUser.color != "") {
                   
            listToPut.push(choiceOfUser)
        
        }
    } 
    
    if (choiceOfUser.quantity != 0 && choiceOfUser.color != ""){
        //mise en place de la nouvelle liste dans le local Storage 
        localStorage.removeItem('basket')
        localStorage.setItem('basket', JSON.stringify(listToPut)) 
    }
    
}

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction qui retourne une quantité total pour un produit en demande d'ajout
//Elle regarde dans la liste du panier si le produit à ajouter est déjà présent
//Si le produit si trouve elle ajoute la quantité demander à la quantité existante dans le panier 
//Elle renvoie la quantité qui correspond à la quantité du produit aprés l'ajout 
//Si le produit n'est pas dans la liste du panier elle retourne la quantité présente dans l'input 

function totalQuanti(color, quanti, id){

    //récupération du storage 
    let storage = JSON.parse(localStorage.getItem('basket'));

    let quantity = 0;

    //vérfication pour voir si des élément sont dans le local Storage 
    if (storage){

        storage.forEach(element => {

            if (element.id === id && element.color === color){

                //cumul des quantité 
                quantity = parseInt(quantity) + parseInt(element.quantity)

            }
        });
        
        let totalQuantity = quantity + parseInt(quanti);

        return totalQuantity

    }else{

        return parseInt(quanti)

    }
}

// ------------------------------------- ************************************************************* ---------------------------------------
// --------- Fonction qui retourne la quantité et la couleur choisie
//Elle se déclanche au clique de la souris sur le bouton ajouter au panier 
//Elle récupére la quantité total de toutes les commande d'un produit demander 
//Elle vérifie si la couleur est choisie
//Elle vérifie que la quantité totale du produit ne dépasse pas ne nombre limite autorisé et ne soit pas négatif ou null
//Si toute les conditions sont bonne elle fait appelle à la fonction storageitem pour ajouter les données au panier

function choiceUser(colorValue, quantityValue, idUser){
    //emplacement du bouton commander dans le html
    const btnAddBasket = document.querySelector('#addToCart')

    //partie choix quantité et couleur 
    btnAddBasket.addEventListener('click', (e) => {
        
        let quantityOfThis = totalQuanti(colorValue.value, quantityValue.value, idUser);
        
        //vérification des conditions pour ajouter un produit 
        if (colorValue.value != ""){
            if (parseInt(quantityValue.value) <= 0){

                window.alert('Veuillez choisir une quantité valide à ajouter.')

            }else if (quantityOfThis > 100){

                window.alert("Vous avez dépasser le nombre d'article maximum pour ce modèle. Nombre d'article encore disponible pour ce modèle : " + (100 - (quantityOfThis - parseInt(quantityValue.value))))

            }else{

                //Ajout du produit 
                storageItem(colorValue.value, quantityValue.value, idUser)

            }
        }else{

            window.alert("Veuillez choisir une couleur.")

        }    
    });
}

// ------------------------------------- ************************************************************* ---------------------------------------
// --------- Fonction pour construir les blocs HTML
//Elle prend en argument les éléments à ajouter
//Elle construit l'affichage de la page avec ces éléments

function construction(ima, alt, nameProd, pri, desc, col, idd){

    //séléction de la position des éléments dans le html
    const titleOfPage = document.querySelector('title');
    const imagePlace = document.querySelector('.item__img');
    const namePlace = document.querySelector('#title');
    const pricePlace = document.querySelector('#price');
    const descriptionPlace = document.querySelector('#description');
    const colorsPlace = document.querySelector('#colors');
    const numberPlace = document.querySelector('#quantity');

    //création des options choix de la couleur couleurs
    col.forEach(color => {

        const option = document.createElement('option');  
        option.setAttribute('value', color)
        option.innerText = color; 
        colorsPlace.append(option)
        
    });

    // création des éléments de présentation
    titleOfPage.innerText = nameProd;
    
    const imagePart = document.createElement('img');
    imagePart.setAttribute('src', ima)
    imagePart.setAttribute('alt', alt)
    imagePlace.append(imagePart)

    namePlace.innerText = nameProd;

    pricePlace.innerHTML = pri;

    descriptionPlace.innerText = desc;
    
    choiceUser(colorsPlace, numberPlace, idd)

}

// ------------------------------------- ************************************************************* ---------------------------------------
// ------- Fonction pour récupérer l'id dans l'URL
//Elle récupére l'id du produit à afficher dans l'url de la page

function IdProduc(){

    const idInUrl = window.location.search;
    const whatPartOfUrl = new URLSearchParams(idInUrl);
    const myId = whatPartOfUrl.get('id');
    
    return myId

}

// ------------------------------------- ************************************************************* ---------------------------------------
// --------- Fonction principale pour afficher la page avec le bon produit 
//Elle récupére les informations du produit
//Fait appel à la fonction de construction avec les éléments du porduit

async function main(){

    const theId = IdProduc();
    let urlForProduct = 'http://127.0.0.1:3000/api/products/' + theId
    const theProduct = await fetch(urlForProduct).then(r => r.json());

    construction(theProduct.imageUrl, theProduct.altTxt, theProduct.name, theProduct.price, theProduct.description, theProduct.colors, theProduct._id)  

}
// ------------------------------------- ************************************************************* ---------------------------------------

main()
