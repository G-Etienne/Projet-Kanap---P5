// ------------------------------------- ************************************************************* ---------------------------------------
//Fonction pour récupérer les données de l'API
//Elle donne la liste des produits du site
async function recup(){

    const listProducts = await fetch('http://127.0.0.1:3000/api/products').then(r => r.json());    
    return listProducts

}

// ------------------------------------- ************************************************************* ---------------------------------------
// --------- Fonction qui envoie les données dans le localStorage
//Elle crée un objet à envoyer dans le local storage 
//Vérifie si la quantité et la couleur sont reseignées 
//Ajoute le choix au local storage 

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

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction qui vérifie si le nombre maximume est déja atteint 
//Elle prend la quantité totale de chaque éléments du local storage 
//Si la quantité plus la quantité choisi par l'utilisateur  est inférieure à 100
//Elle retourne un nombre à comparer pour savoir le nombre d'article qui peut encore être commandés

function maximum(color, id, quantity){ 

    //récupération du local Storage
    let storage =JSON.parse(localStorage.getItem('basket'));
    
    let quanti = 0; 

    if (storage){
        
        //Calcul de la quantité totale 
        storage.forEach(element => {
        
            if (element.color === color && element.id === id){
    
                quanti = quanti + element.quantity;
    
            }
    
        });

        //vérifie si le produit a pas déjà atteint le max autoriser 
        if (parseInt(quanti) + parseInt(quantity) > 100){

            let quantityToCompare = parseInt(quanti);
            return quantityToCompare

        }
    }
}

// ------------------------------------- ************************************************************* ---------------------------------------
// --------- Fonction qui retourne la quantité et la couleur choisie
//Elle se déclanche au clique de la souris sur le bouton ajouter au panier 
//Elle récupére le chois de l'utilisateur pour la couleur 
//Compare de la quantité choisie pour le produit avec la fonction maximum()
//Affiche un message d'erreur si le nombre d'article autorisés est dépassé
//Propose d'ajouter 1 produit si l'utilisateur en choisit 0
//Propose d'ajouter 100 produit si l'utilisateur en choisit plus de 100
//Affiche un message d'erreur si la couleur n'est pas choisie
//Si les choix sont valide renvoie a la fonction StorageItem les valeur à ajouté 

function choiceUser(colorValue, quantityValue, idUser){
    const btnAddBasket = document.querySelector('#addToCart')

    //partie choix quantité et couleur 
    btnAddBasket.addEventListener('click', (e) => {
        
        let choiceColor = colorValue.value;
        let isAlreadyMax = maximum(colorValue.value, idUser, quantityValue.value);
        let choiceQuantity;

        //Vérification de la quantité 
        if (isAlreadyMax + parseInt(quantityValue.value) > 100){

            let numberAwload =  100 - isAlreadyMax; 

            window.alert("Vous dépasser le nombre d'articles autorisés pour ce modèle. nombre d'article autorisé restant : " + numberAwload)

            if (window.confirm("Voulez-vous ajoutez " + numberAwload + " produits ?")){
                        
                if (choiceColor == ""){

                    window.alert('Veulliez sélectionner une couleur.')
        
                }else{

                    choiceQuantity = numberAwload;
                    storageItem(choiceColor, choiceQuantity, idUser)
                    
                }
            
            }

        }else{

            if (quantityValue.value <= 0){

                if (window.confirm("Vous n'avez pas sélectionné d'article. Voulez-vous ajouter 1 article ?")){
                    if (choiceColor == ""){

                        window.alert('Veulliez sélectionner une couleur.')
            
                    }else{

                        choiceQuantity = 1;
                        storageItem(choiceColor, choiceQuantity, idUser)
                    }
                    
                }

            }                
            //vérification de la couleur
            else if (choiceColor == ""){

                window.alert('Veulliez sélectionner une couleur.')

            }
            else{

                choiceColor = colorValue.value;
                choiceQuantity = quantityValue.value;

                storageItem(choiceColor, choiceQuantity, idUser)

            }
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
// ------- Fonction pour déterminer qu'elle produit afficher
//Elle compare l'id qui se trouve dans l'url aux ids des produits du site
//Si un id correspond elle retourne l'objet qui contient cet id 

async function whatProduct(){

    const listOfProduct = await recup();
    const theId = IdProduc();
    let theElem = [];

    //comparaison de l'id 
    listOfProduct.forEach(element => {

        if (theId == element._id){

            theElem.push(element)

        }
        
    });
    return theElem
}

// ------------------------------------- ************************************************************* ---------------------------------------
// --------- Fonction principale pour afficher la page avec le bon produit 
//Elle récupére les informations du produit
//Fait appel à la fonction de construction avec les éléments du porduit

async function main(){

    const theProduct = await whatProduct();
    const realProduct = [theProduct[0]];
    
    realProduct.forEach(elem => {

        construction(elem.imageUrl, elem.altTxt, elem.name, elem.price, elem.description, elem.colors, elem._id)  

    });
    

}
// ------------------------------------- ************************************************************* ---------------------------------------

main()

