//---------------------------------------******************** Partie gestion des produits panier ********************** ---------------------------------------

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction qui ajoute dans la page le nombre total d'article dans le panier et le prix total du panier
// Elle prend en paramètre la quantité totale et le prix total des produits du panier.
// Elle récupère l’emplacement du Dom qui doit afficher le prix total et la quantité totale.
// Elle affiche le prix totale et la quantité totale sur la page panier

// Besoin précis → afficher la quantité totale et le prix totale des produits du panier

function numberAndPriceProducts(theQuantity, price){  

    //ajout du la quantité totale
    const quantityTotal = document.querySelector('#totalQuantity')
    quantityTotal.innerText = theQuantity;

    //ajout du prix totale
    const priceTotal = document.querySelector('#totalPrice')
    priceTotal.innerText = price;

}
// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction qui met à jour le local storage.
// Elle prend en paramètre au minimum un id et une couleur d’un produit.
// Elle peut prendre aussi une quantité et type d’événement.
// Si le type d’événement est “quantity” elle ajuste la quantité du produit.
// Elle crée une nouvelle liste avec la nouvelle quantité.
// Sinon elle crée une nouvelle liste sans le produit.
// Elle remplace la liste du localStorage par la nouvelle liste.

// Besoin Précis → mettre à jour le local Storage.

function replace(id, color, quantity, typeOfEvent){

    //création d'une nouvelle liste avec la nouvelle quantité du produit 
    let newList = [];

    let storage = JSON.parse(localStorage.getItem('basket'));
    storage.forEach(ele => {
        
        if (ele.id ===  id && ele.color === color){

            if (typeOfEvent == 'quantity'){
                const newElement = newObjetc(id, color, quantity)
                newList.push(newElement)
            }

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

// ------------------------------------- ************************************************************* ---------------------------------------
// --------- Fonction pour supprimer un produit de la page panier 
// Elle prend en paramètre l’emplacement dans le DOM d’un input (bouton supprimer).
// Elle récupère l’id et la couleur du produit avec closest()
// Elle récupère la liste des produits du panier dans le storage.
// Elle affiche un message d’alerte pour demander à l’utilisateur s' il veut réellement supprimer ce produit.
// Si oui, elle crée une nouvelle liste de produit du panier mais sans l’élément à supprimer.
// Elle appelle la fonction replace() pour mettre à jour le panier.
// (avec en paramètre l’id et la couleur du produit à supprimer)
// Elle supprime le produit de la page.

// Besoin précis → supprimer un produit de la liste des commandes.


async function eventDelete(placeInput, placeRemove){
    
    placeInput.addEventListener('click', e => {

        //récupération de l'id et de la couleur du produit 
        let donneesArticle = placeInput.closest("#cart__items > article");
        let dataId = donneesArticle.dataset.id;
        let dataColor = donneesArticle.dataset.color;

        //demande de confirmation
        const alert = window.confirm("Voulez-vous réellement supprimer cet article ?");
        
        if (alert){

            //création d'une nouvelle liste sans l'élément supprimer 
            replace(dataId, dataColor)

            //suppréssionl'affichage de l'article
            placeRemove.remove()

        }
        //mise a jours du totale des produits et des prix
        totalAndfindElementToShow(false)
    });   
}

// ------------------------------------- ************************************************************* ---------------------------------------
// ----------- fonction pour construire un objet 
// Elle prend en paramètre un id, une couleur et un quantité
// Elle contient une classe pour construire un objet selon un modèle de construction.
// Elle construit un objet avec les informations placées en paramètre.
// Elle retourne cet objet.

// Besoin Précis → construire un objet qui contient l’id, la couleur et la quantité d’un produit.

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
// Elle prend en paramètre l’emplacement d’un input dans le DOM et la valeur de base de cet input.
// Elle récupère les données du produit dans les data de la balise article.
// Elle vérifie que la valeur des données des inputs quantité n’est pas trop basse ou trop haute et envoie un message d’erreur si c’est le cas
// Si c’est le cas, elle construit une nouvelle liste de produits du panier avec la quantité de l’input ajusté.
// Elle fait appel à la fonction replace() pour mettre à jour le local Storage.
// Sinon elle remet la valeur de base dans l’input 
// Elle appelle la fonction totalAndFindElementToShow(false) pour mettre à jour les totaux.
// (le paramètre false permet de ne pas faire appel à la fonction constructor()).

// Besoin précis → vérifier et modifie les valeurs des inputs quantité.

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
            replace(dataId, dataColor, quantityChange, 'quantity')
            valueBase = quantityChange

        }

        //mise a jours du totale des produits et des prix
        totalAndfindElementToShow(false)

    });
}

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction pour construire les éléments html de la page 
// Elle prend en paramètre les éléments pour afficher un produit (image, nom, couleur, prix quantité, texte alternatif, id).
// Elle récupère l’emplacement dans le DOM ou les éléments doivent être affichés.
// Elle crée les éléments HTML pour afficher le produit 

// Besoin Précis → construire le html pour afficher un produit dans le panier 

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
    eventDelete(btnDelete, article)

}

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction pour afficher les porduits du panier en fonction du modèle et calculer le totale quantité et prix
// Elle récupère la liste des produits dans l’API
// Elle récupère la liste des produits dans le localStorage
// Déclare des variables pour stocker le total du prix des produits et de la quantité des produits.
// Pour chacun des éléments de la liste de l’API elle compare la liste du local storage.
// Si un id des deux liste est similaire 
// Elle ajoute le prix et la quantité au variable pour les totaux 
// Elle fait appelle à la fonction constructor() pour afficher l’élément dans la page.
// Elle appelle la fonction pour afficher le total des quantités et du prix.

// Besoin Précis → Afficher les produits par modèles et calculer les quantités et prix totaux.

async function totalAndfindElementToShow(build){

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
                if (build){
                
                    contructor(element.imageUrl, element.name, e.color, element.price, e.quantity, element.altTxt , element._id)
                
                }
            }
        });
    });
  
    //appel de la fonction pour construir le prix et la quantité totale sur la page
    numberAndPriceProducts(quantityTotal, priceTotal)

}

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction Principale pour l'affichage et la gestion du panier 
// C’est la fonction d’appel principal du panier.
// Elle regarde si le localStorage est vide ou non
// Si le panier est vide, elle le signale à l'utilisateur, elle vide le panier pour éviter d'avoir une liste vide.
// Si le panier contient des éléments, elle lance les fonctions de départ pour la page panier.

// Besoin précis → vérifier si le panier est vide et lancer le programme de la page si il ne l’est pas.


async function basket(){
    
    //récupération des liste du local storage
    const storage = JSON.parse(localStorage.getItem('basket'));

    //Appel des fonctions pour le panier si le panier n'est pas vide 
    if (storage && storage.length > 0){

        // la valeur true permet de faire appel à la fonction contructor()
        totalAndfindElementToShow(true) 
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

//Regex pour vérifier nom et prénom
const regexNames = (value) => { return  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\ \-]{0,50}$/i.test(value) };
//Regex pour vérifier une adresse française, code postal et nom de rue 
const regexAddress = (value) => { return  /^[0-9]{5} [A-Za-zÀ-ÖØ-öø-ÿ0-9 ]+$/.test(value) };
//Regex pour vérifier une ville 
const regexCity = (value) => { return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\ \-]{0,60}$/i.test(value) };
//Regex pour vérifier un email
const regexEmail = (value) => { return  /^[a-zA-Z0-9_.+-]+@[\w-]+\.[\w]{2,4}$/i.test(value) };

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction qui ajoute un id à l'url de la page confirmation et redirige l'utilisateur sur cette page
// Elle prend en argument des données retournées par l’API après l'envoi du formulaire.
// Elle ajoute l’id de commande retourner par l’API à l’url de la page confirmation.
// Elle redirige l’utilisateur vers cet url.

// Besoin Précis → Ajouter l’id de commande à l’url et rediriger l’utilisateur vers celui-ci.

function idReturn(resp){
    
    //ajout de l'id de commande à l'url
    let idToSend = "/front/html/confirmation.html?id=" +JSON.stringify(resp.orderId);

    //redirection vers la page confirmation 
    document.location.href=idToSend;

}

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction qui envoie les données du formulaire et la liste d'id 
// Elle prend en paramètre un objet à envoyer à l’API.
// Elle envoie une requête POST à l’API.
// Elle appelle la fonction idReturn avec les données de la réponse de l’API en paramètre.

// Besoin Précis → Envoyer un objet à l’API et récupérer sa réponse.


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
// Elle récupère les données des produits du panier dans le localStorage.
// Elle regarde si les ids de chaque élément est présent ou non dans une liste d’ids.
// Si il n’y est pas, elle l’ajoute à la liste.
// Sinon elle vérifie si le type de données de l’id est de type string
// Si oui elle l’ajoute à la liste 
// Sinon elle l’ajoute en le transformant en type “string”.
// Elle retourne la liste des ids des produits présents dans le panier .

// Besoin Précis → récupérer les ids des produits du paniers sous forme de données de types “string”.

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
            
            }else{

                listOfId.push((stringify(element.id)))

            }
        }
    });

    return listOfId

}
// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction qui écoute les input
// Elle prend en paramètre un nœud du DOM qui correspond à un input.
// Un type de format à analyser.
// Un nœud du DOM qui correspond à l'emplacement du message d’erreur.
// Elle vérifie qu’elle regex appliquer en fonction du type de format à analyser.
// Si le regex ne valide pas la donnée ou si la donnée n’est pas du type string.
// Elle affiche un message d’erreur.

// Besoin Précis → vérifier les données entrer dans le formulaire pour afficher un message d’erreur si les données ne sont pas valides.

function inputchange(locHtml, typeOfData, locError, saidAlert){

    //variable avec la réponse du regex 
    let regexBack;
 
    //ciblage du bon regex
    locHtml.addEventListener('change', e => {
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
// Elle récupère l’emplacement dans le DOM des messages d’erreur et des inputs du formulaire.
// Elle vérifie que les formats de données sont valides et que les données sont de type “string”.
// Si elle ne sont pas valide elle renvoie une erreur.
// Sinon elle crée un objet à envoyer à l’API.
// Et elle fait appel à la fonction post()

// Besoin Précis → construire un objet à envoyer à l’API avec des données vérifiées.

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
        }else{

            window.alert('Des données invalide sont présentes dans les champs du formulaire.')

        }
    });    
}

// ------------------------------------- ************************************************************* ---------------------------------------

basket()
