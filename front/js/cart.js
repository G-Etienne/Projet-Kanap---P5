//---------------------------------------******************** Partie gestion des produits panier ********************** ---------------------------------------

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction qui ajoute dans la page le nombre total d'article dans le panier et le prix total du panier

function numberAndPriceProducts(theQuantity, price){  

    //ajout du la quantité totale
    const quantityTotal = document.querySelector('#totalQuantity')
    quantityTotal.innerText = theQuantity;

    //ajout du prix totale
    const priceTotal = document.querySelector('#totalPrice')
    priceTotal.innerText = price;

}

// ------------------------------------- ************************************************************* ---------------------------------------
// --------- Fonction pour supprimer un produit de la page panier 
//Elle prend en argument la localisation html de l'input d'un bouton supprimer, un id et une couleur
//Au clique de la souris sur le bouton supprimer 
//Elle envoie une demande de confirmation de suppréssion de l'élément à l'utilisateur
//Si celle si et confirmée, elle crée une nouvelle liste sans l'élément qui doit être supprimer 
//Remplace les listes du locale storage par la nouvelle liste 
//Recharge la page pour enlever le produit supprimer de la page 

async function eventDelete(placeInput){
    
    placeInput.addEventListener('click', e => {

        //récupération de l'id et de la couleur du produit 
        let donneesArticle = placeInput.closest("#cart__items > article");
        let dataId = donneesArticle.dataset.id;
        let dataColor = donneesArticle.dataset.color;

        //récupération de la liste des produits
        let storage = JSON.parse(localStorage.getItem('basket'));

        //demande de confirmation
        const alert = window.confirm("Voulez-vous réellement supprimer cet article ?");

        const newList = [];
        
        if (alert){

            //création d'une nouvelle liste sans l'élément supprimer 
            storage.forEach(element => {
                
                if (element.color != dataColor || element.id != dataId){
                    
                    newList.push(element)
                    
                }
            });

            //remplacement de la liste dans le local Storage
            localStorage.removeItem('basket')
            localStorage.setItem('basket', JSON.stringify(newList))

            //rechargement de la page pour supprimer l'affichage de l'article
            location.reload()

        }
    });   
}

// ------------------------------------- ************************************************************* ---------------------------------------
// ----------- fonction pour construire un objet 
//Elle renvoie une objet contenant un id, une couleur et une quantitée

function newObjetc(idd, colorPro, quantityProd){

    //modèle de l'objet
    class ModelForOrder {

        constructor(id, color, quantity){

            this.id = id;
            this.color = color;
            this.quantity = quantity;

        }
    }

    //création de l'objet
    let objetcNew = new ModelForOrder(idd, colorPro, quantityProd)
    return objetcNew

}

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction pour controler la quantitié d'un produit 
//Elle prend la position dans le Dom des inputs quantités 
//Si les quantités ne sont pas trop basse ou trop haute elle les ajoute au panier 
//Elle recharge la page pour mettre a jour les totals quantité et prix 

async function eventQuantity(placeInput, valueBase){
    
    placeInput.addEventListener('change', e => {
        e.preventDefault()

        //récupération de l'id et de la couleur du produit 
        let donneesArticle = placeInput.closest("#cart__items > article");
        let dataId = donneesArticle.dataset.id;
        let dataColor = donneesArticle.dataset.color;

        //récupération de la nouvelle quantité
        let quantityChange = parseInt(placeInput.value);

        //vérification si la quatité n'est pas trop basse ou trop haute
        if (quantityChange > 100){

            window.alert("Vous avez dépasser le nombre d'articles autorisés pour ce modèle. Nombres autorisés maximum : 100")
            placeInput.value = valueBase;

        }else if (quantityChange <= 0){

            window.alert("Le nombre minimal requis pour commander ce modèle est de : 1. Si vous ne voulez plus commander ce produit, appuyer sur Supprimer.")
            placeInput.value = valueBase;

        }else if (quantityChange <= 100){

            //création d'une nouvelle liste avec la nouvelle quantité du produit 
            let newList = [];

            let storage = JSON.parse(localStorage.getItem('basket'));
            storage.forEach(ele => {
                
                if (ele.id ===  dataId && ele.color === dataColor){

                    const newElement = newObjetc(dataId, dataColor, quantityChange)
                    newList.push(newElement)

                }else{

                    const newElement = newObjetc(ele.id, ele.color, ele.quantity)
                    newList.push(newElement)

                }  
            }); 

            //remplacement des listes du local storage par la nouvelle liste 
            storage = [];
            storage.push(newList)

            localStorage.removeItem('basket')
            localStorage.setItem('basket', JSON.stringify(newList))

        }

        //mise a jours du totale des produits et des prix
        location.reload()

    });
}

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction pour construire les éléments html de la page 
//Elle prend en argument une image, un nom, une couleur, un prix, une quantité, un texte et une id
//Elle va construire les balise et ajouter le contenue nécéssaire pour construire une commande de la page panier 
//Elle fait aussi appel au fonction pour gérer les événements (quantité et suppréssion)

function contructor(image, nameProduct, color, price, theQuantity, textAlt, theIdd){

    //récupération de la section affichage 
    const section = document.querySelector('#cart__items');

    //création des éléments 
    const article = document.createElement('article');
    article.setAttribute('class', 'cart__item')
    article.setAttribute('data-id', theIdd)
    article.setAttribute('data-color', color)
    section.append(article)

    //div image
    const divImage = document.createElement('div');
    divImage.setAttribute('class', 'cart__item__img')
    article.append(divImage)

    const theImage = document.createElement('img');
    theImage.setAttribute('src', image)
    theImage.setAttribute('alt', textAlt)
    divImage.append(theImage)

    // div global pour infos /quantitté / supprimer
    const divGlobale = document.createElement('div');
    divGlobale.setAttribute('class', 'cart__item__content')
    article.append(divGlobale)

    // div contenant les infos
    const divInfos = document.createElement('div');
    divInfos.setAttribute('class', 'cart__item__content__description')
    divGlobale.append(divInfos)

    // nom du produit 
    const theName = document.createElement('h2');
    theName.innerText = nameProduct;
    divInfos.append(theName)

    // couleur du produit  
    const theColor = document.createElement('p');
    theColor.innerText = color;
    divInfos.append(theColor)

    // prix du produit
    const thePrice = document.createElement('p');
    thePrice.innerText = price + ' €';
    divInfos.append(thePrice)

    // division qui englobe les choix
    const divInputs = document.createElement('div');
    divInputs.setAttribute('class', 'cart__item__content__settings')
    divGlobale.append(divInputs)

    //div pour la quantité
    const divQuantity = document.createElement('div');
    divQuantity.setAttribute('class', 'cart__item__content__settings__quantity')
    divInputs.append(divQuantity)

    //quantité
    const quantityTxt = document.createElement('p');
    quantityTxt.innerText = 'Qté : ';
    divQuantity.append(quantityTxt)
    
    const quantityInput = document.createElement('input');
    quantityInput.setAttribute('type', 'number')
    quantityInput.setAttribute('class', 'itemQuantity')
    quantityInput.setAttribute('name', 'itemQuantity')
    quantityInput.setAttribute('min', '1')
    quantityInput.setAttribute('max', '100')
    quantityInput.setAttribute('value', theQuantity)
    divQuantity.append(quantityInput)

    //Fonction evenement quantité
    eventQuantity(quantityInput , quantityInput.value)

    //partie suppréssion 
    const deletItem = document.createElement('div');
    deletItem.setAttribute('class', 'cart__item__content__settings__delete')
    divInputs.append(deletItem)

    const btnDelete = document.createElement('p');
    btnDelete.setAttribute('class', 'deleteItem')
    btnDelete.innerText = 'Supprimer';
    divInputs.append(btnDelete)

    //Fonction evenement suppression 
    eventDelete(btnDelete)

}

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction pour afficher les porduits du panier en fonction du modèle et calculer le totale quantité et prix
//Elle récupére la liste des produits disponible du site
//la liste des produits demander par l'utilisateur
//Elle compare ensuite chaque élément de la commande avec chaque éléments de la liste de l'API
//Si elle trouve un id similaire appel la fonction pour construire un élément sur la page 
//Elle appel ensuite une fonction pour afficher le prix et la quantité totale

async function findElementToShow(){

    //récupération des produits en vente 
    const listProducts = await fetch('http://127.0.0.1:3000/api/products').then(r => r.json()); 

    //récupération des commandes 
    const ListOrders = JSON.parse(localStorage.getItem('basket'));

    let quantityTotal = 0;
    let priceTotal = 0;

    //création d'une boucle qui va comparer chaque commande 
    //avec les produits à la vente dans l'API
    //et les afficher si un produit si trouve
    listProducts.forEach(element => {
        
        ListOrders.forEach(e => {
                
            if(element._id === e.id){

                //calcul du prix et de la quantité totale
                priceTotal += element.price * e.quantity;
                quantityTotal += e.quantity;

                //appel de la fonction pour construire un élément dans la page html
                contructor(element.imageUrl, element.name, e.color, element.price, e.quantity, element.altTxt , element._id)

            }
        });
    });
  
    //appel de la fonction pour construir le prix et la quantité totale sur la page
    numberAndPriceProducts(quantityTotal, priceTotal)

}


// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction Principale pour l'affichage et la gestion du panier 
//Elle récupére les liste 'order' et 'basket' du local storage 
//Si la liste 'order' n'est pas présente mais que la liste 'basket est présente, elle recharge la page afin de créer la liste 'order
//Si le storage n'est pas vide elle appelle les fonctions pour l'affichage du panier et la gestion du formulaire
//et du bouton commande
//Si le storage est vide elle envoie une alerte pour signaler un panier vide
//Elle n'étoie le local storage pour éviter les liste vide 

async function basket(){
    
    //récupération des liste du local storage
    const storage = JSON.parse(localStorage.getItem('basket'));

    //Appel des fonctions pour le panier si le panier n'est pas vide 
    if (storage && storage.length > 0){

        findElementToShow()
        eventFormulary()

    }else {

        //affichage d'une alerte et notoyage du locale storage
        window.alert('Votre panier est vide.')
        localStorage.removeItem('basket')

    }
}



//---------------------------------------******************** Partie Formulaire ********************** ----------------------------------------------------

// ------------------------------------- ************************************************************* ---------------------------------------
//Fonctions de vérifivation de donnée par regex

//regex pour nom et prénom
const regexNames = (value) => { return  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\ \-]{0,50}$/i.test(value) };
//regex pour une adresse française, code postal et nom de rue 
const regexAddress = (value) => { return  /^[0-9]{5} [A-Za-zÀ-ÖØ-öø-ÿ0-9 ]+$/.test(value) };
//regex pour une ville 
const regexCity = (value) => { return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\ \-]{0,60}$/i.test(value) };
//regex pour un email
const regexEmail = (value) => { return  /^[a-zA-Z0-9_.+-]+@[\w]+\.[\w]{2,4}$/i.test(value) };

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction qui ajoute un id à l'url de la page confirmation et redirige l'utilisateur sur cette page
//Elle prend en argument les données retourner par l'API aprés l'envoie des données du formulaire

function idReturn(resp){
    
    //ajout de l'id de commande à l'url
    let idToSend = "/front/html/confirmation.html?id=" +JSON.stringify(resp.orderId);

    //redirection vers la page confirmation 
    document.location.href=idToSend;

}

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction qui envoie les données du formulaire et la liste d'id 
//Elle prend en argument les objets à envoyer
//Elle récupére les données de la réponse la réponse
//Elle utilise la fonction idReturn en lui placant les données retourner en paramètre

async function post(thingToSend){

    //envoie des données à l'API
    await fetch('http://localhost:3000/api/products/order', {

        method: 'POST',
        headers: {

            "Accept" : "application/json",
            "Content-Type" : "application/json"

        },
        body: JSON.stringify(thingToSend),

    })

    //récupération de la réponse 
    .then(res => res.json())
    
    //Utilisation d'idReturn avec les données de la réponse 
    .then(data => idReturn(data))
}

// ------------------------------------- ************************************************************* ---------------------------------------
// ----------- Fonction qui récupére la liste des id de la commande
//Elle récupére la liste des commandes dans le local storage 
//Elle crée une liste contenant uniquement les ids différents présent dans la commande
//Elle retourne la liste d'ids

function idOrders(){

    //liste des id de la commande
    let listOfId = [];

    //Récupération du LocalStorage
    const storage = JSON.parse(localStorage.getItem('basket'));

    //ajout des ids dans la liste
    storage.forEach(element => {
            
        let findId = listOfId.find(e => e === element.id);

        if (!findId){

            if (typeof element.id == "string"){
                listOfId.push(element.id)
            }

        }
    });

    return listOfId

}
// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction qui écoute les input
//Elle prend en paramétre le noeud de l'input, le format de donnée à analyser, le neud pour afficher l'erreur et un message d'alerte
//Elle vérfie la donnée de l'input avec le bon regex
//indique à l'utilisateur si la donnée n'est pas valide

function inputchange(locHtml, typeOfData, locError, saidAlert){

    //variable avec la réponse du regex 
    let regexBack;
 
    //ciblage du bon regex
    locHtml.addEventListener('input', e => {
        if (typeOfData == "firstName" || typeOfData == "lastName"){
        
            regexBack = regexNames(locHtml.value)
        
        }else if (typeOfData == "address"){
            
            regexBack = regexAddress(locHtml.value)
        
        }else if (typeOfData == "city"){
            
            regexBack = regexCity(locHtml.value)
        
        }else if (typeOfData == "email"){
            
            regexBack = regexEmail(locHtml.value)
        
        };
        
        //affichage des messages d'erreurs
        if (regexBack && locHtml.value != "" && typeof locHtml.value === "string"){

            locError.innerHTML = "";

        }else{

            locError.innerHTML = saidAlert;

        }
    });
}

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction qui écoute les événements des champs de formulaire, vérifie les données et si elle sont valide appel une fonction pour les envoyer
//Elle s'éléctionne les inputs et les paragraphe d'erreur du formulaire dans le html
//Elle contient des regex pour vérifier que le format de donnée de chaques champs correspond a ce que l'on attend
//Elle écoute les inputs quand l'utilisateur les remplis et indique un message d'erreur si nécéssaire
//Elle écoute le bouton commander
//Vérifie les formats de données (champs de formulaire et liste des ids à envoyer)
//Une fois les données validées, elle fait appelle à la fonction post() pour les envoyer à l'API

async function eventFormulary(){

    //Elements du formulaire dans le html
    const firstName = document.querySelector('#firstName');
    const firstNameError = document.querySelector('#firstNameErrorMsg')
    const lastName = document.querySelector('#lastName');
    const lastNameeError = document.querySelector('#lastNameErrorMsg')
    const address = document.querySelector('#address');
    const addressError = document.querySelector('#addressErrorMsg')
    const city = document.querySelector('#city');
    const cityError = document.querySelector('#cityErrorMsg')
    const email = document.querySelector('#email');
    const emailError = document.querySelector('#emailErrorMsg')
 
    //partie vérification des inputs 
    inputchange(firstName, "firstName", firstNameError, "Veuillez renseigner un prénom valide. <br/> Ex : Anna, Jean-jaque, Philipe, etc ...")
    inputchange(lastName, "lastName", lastNameeError, "Veuillez renseigner un nom valide. <br/> Ex : Chirac, Macron, Dali, etc ...")
    inputchange(address, "address", addressError, "Veuillez renseigner une adresse valide. <br/> Ex :75000 rue du paradis ...")
    inputchange(city, "city", cityError, "Veuillez renseigner une ville valide. <br/> Ex : Chicago, Paris, Bordeaux, etc ...")
    inputchange(email, "email", emailError, "Veuillez renseigner un email valide. <br/> Ex : mon-mail@email.com")

    //envoie des données du formulaire 
    //bouton commander 
    const sendFormulary = document.querySelector('#order');
            
    sendFormulary.addEventListener('click', async e => {
        e.preventDefault();

        //première vérification des données des champs 
        if (regexNames(firstName.value) && typeof firstName.value === "string" && regexNames(lastName.value) && typeof lastName.value === "string" && regexAddress(address.value) && typeof address.value === "string" && regexCity(city.value) && typeof city.value === "string" && regexEmail(email.value) && typeof email.value === "string"){
            
            //récupération de la liste des ids
            const idToSend = idOrders();
            let realString = true;
            
            //vérification pour que les is soit bien de type string
            idToSend.forEach(e => {

                if (typeof e != "string"){

                    realString = false;

                }else if (realString != false){

                    realString = true;

                }
            });

            //seconde vérification des données des champs du formulaire 
            if (realString && regexNames(firstName.value) && typeof firstName.value === "string" && regexNames(lastName.value) && typeof lastName.value === "string" && regexAddress(address.value) && typeof address.value === "string" && regexCity(city.value) && typeof city.value === "string" && regexEmail(email.value) && typeof email.value === "string"){

                //création d'un objet contact avec des données valides
                let thingsToSend =  {

                        firstName : firstName.value,
                        lastName : lastName.value,
                        address : address.value,
                        city : city.value,
                        email : email.value

                    };

                    //ajout de la liste des id et des infos formulaire dans un seule objet
                    const objetToSend = {

                        contact : thingsToSend,
                        products : idToSend
                        
                    }
                    //appel de la fonction post avec les données a envoyer en argument
                    post(objetToSend) 
                
            }else{

                //renvoie une erreur si les données ne sont pas valide
                throw new Error ("les type de données ne sont pas tous de type string")

            }      
        }
    });    
}

// ------------------------------------- ************************************************************* ---------------------------------------




basket()

