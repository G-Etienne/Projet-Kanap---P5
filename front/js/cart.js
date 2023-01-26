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

async function eventDelete(placeInput, oneId, oneColor){
    

    placeInput.addEventListener('click', e => {

        //récupération de la liste des produits
        let storage = JSON.parse(localStorage.getItem('basket'));

        //demande de confirmation
        const alert = window.confirm("Voulez-vous réellement supprimer cet article ?");

        const newList = [];
        
        if (alert){

            //création d'une nouvelle liste sans l'élément supprimer 
            storage.forEach(element => {
                
                if (element.color != oneColor || element.id != oneId){
                    
                    newList.push(element)
                    
                }

            });

            //remplacement des listes du locale storage par la nouvelle liste
            storage = [];
            storage.push(newList)

            localStorage.removeItem('basket')
            localStorage.setItem('basket', JSON.stringify(newList))

            localStorage.removeItem('order')
            localStorage.setItem('order', JSON.stringify(storage))

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

    let objetcNew = new ModelForOrder(idd, colorPro, quantityProd)
    return objetcNew

}

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction pour controler la quantitié d'un produit 
//Elle prend en argument la position html d'un input, l'id d'un produit et la couleur d'un produit 
//Elle écoute le clique de la souris sur l'input pout la quantité 
//Au clique elle vérifie si la quantité n'est pas inférieur ou égale à 0 ou suppérieur à 100
//Si c'est le cas, elle affiche une alerte
//Sinon elle créé une nouvelle liste avec la nouvelle quantité assignés au produit 
//Elle remplace ensuite les listes 'order' et 'basket' du locale storage par cette nouvelle liste
//Elle recharge la page pour actualiser le totale du prix et des quantité

async function eventQuantity(placeInput, oneId, oneColor, valueBase){
    
    placeInput.addEventListener('click', e => {

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

            let storage = JSON.parse(localStorage.getItem('order'));
            storage.forEach(ele => {
                ele.forEach(element => {
                    
                    if (element.id ===  oneId && element.color === oneColor){

                        const newElement = newObjetc(oneId, oneColor, quantityChange)
                        newList.push(newElement)

                    }else{

                        const newElement = newObjetc(element.id, element.color, element.quantity)
                        newList.push(newElement)

                    }

                });  
            }); 

            //remplacement des listes du local storage par la nouvelle liste 
            storage = [];
            storage.push(newList)

            localStorage.removeItem('basket')
            localStorage.setItem('basket', JSON.stringify(newList))

            localStorage.removeItem('order')
            localStorage.setItem('order', JSON.stringify(storage))
            
            //rechargement de la page pour actualiser le tatale des prix et des quantitées
            location.reload()

        }
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
    eventQuantity(quantityInput ,theIdd, color, quantityInput.value)

    //partie suppréssion 
    const deletItem = document.createElement('div');
    deletItem.setAttribute('class', 'cart__item__content__settings__delete')
    divInputs.append(deletItem)

    const btnDelete = document.createElement('p');
    btnDelete.setAttribute('class', 'deleteItem')
    btnDelete.innerText = 'Supprimer';
    divInputs.append(btnDelete)

    //Fonction evenement suppression 
    eventDelete(btnDelete, theIdd, color)

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
    const ListOrders = JSON.parse(localStorage.getItem('order'));

    let quantityTotal = 0;
    let priceTotal = 0;

    //création d'une boucle qui va comparer chaque commande 
    //avec les produits à la vente dans l'API
    //et les afficher si un produit si trouve
    listProducts.forEach(element => {
        
        ListOrders.forEach(e => {
            
            e.forEach(ele => {
                
                if(element._id === ele.id){

                    //calcul du prix et de la quantité totale
                    priceTotal += element.price * ele.quantity;
                    quantityTotal += ele.quantity;

                    //appel de la fonction pour construire un élément dans la page html
                    contructor(element.imageUrl, element.name, ele.color, element.price, ele.quantity, element.altTxt , element._id)
    
    
                }
            });
        });
    });
  
    //appel de la fonction pour construir le prix et la quantité totale sur la page
    numberAndPriceProducts(quantityTotal, priceTotal)

}

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction qui retourne un objet avec les paire id/couleur du panier
//Elle prend les éléments commander dans la clé 'basket' du storage
//Elle compare chaque élément de 'basket' à un array
//Si l'élément id/couleur ne se trouve pas dans l'array elle l'ajoute
//Elle retourne un array contenant la liste des objets pour chaque différentes paire id/couleur

async function findColorModel(){ 
    
    //récupération du panier 
    const storage = JSON.parse(localStorage.getItem('basket'));
    
    //liste couleur à afficher 
    let listOfColors = [];

    storage.forEach(element => {

        //regarde si des éléments avec un id et une couleur simillaire sont déjà présent dans la liste 
        let findColor = listOfColors.find(e => element.color === e.color && element.id === e.id);

        //si ils ne sont pas présent, les met dans la liste 
        if (!findColor){

            let listIdColor = newObjetc(element.id, element.color, 0);
            listOfColors.push(listIdColor)

        }
        
    });

    //retourne une liste de d'objet pour chaque élément avec
    //une id et une couleur différentes
    return listOfColors
}

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction qui ajoute la quantité de produit pour chaque modele 
//Elle récupérer la liste avec la clé 'basket' dans le local storage 
//et la liste retourner par la fonction findColorModel()
//Elle compare la liste des paire id/couleur à la liste 'basket' et ajoute la quantité total de chaque modèle qui est commander 
//Elle retourne ensuite une liste contenant tout les modèles différents demander et leur quantités 

async function quantity(){

    //récupération du panier 
    const storage = JSON.parse(localStorage.getItem('basket'));

    //récupération de la liste de produit avec l'id et la couleur
    const listColorProduct = await findColorModel();

    //liste du storage trié 
    let lastListForBasket = [];

    //pour chaque élément de la liste id / color 
    //si la couleur et l'id sont le même dans le storage 
    //on additionne leur quantité
    listColorProduct.forEach(element => {

        let quantityOfThis = 0;
        
        storage.forEach(e => {

            if (element.id === e.id && element.color === e.color){

                quantityOfThis = quantityOfThis + e.quantity;

                if(quantityOfThis < 0 ){

                    quantityOfThis = 1;
    
                }else if(quantityOfThis > 100 ){
    
                    quantityOfThis = 100;
    
                }

            }

        });

        // création d'un objet avec la quantité ajouter 
        let lastObject = newObjetc(element.id, element.color, quantityOfThis);
        //placement de l'objet dans la liste 
        lastListForBasket.push(lastObject)

    });
    
    //retourne une liste d'élément avec un id et/ou une couleur différents 
    //des autres et un cumule des quantité.
    return lastListForBasket

}

// ------------------------------------- ************************************************************* ---------------------------------------
// --------- Fonction pour mettre la liste de produits du panier le local storage
//Elle récupérer une liste d'objets trié 
//(pas d'id avec la même couleur en double et la quantité de chaque types de produit est présente)
//Elle supprime la clé 'order' du panier et ajoute une nouvelle liste 'order' 
//Elle appelle ensuite une fonction pour afficher les modèles

async function putStorage(){

    const oneList =  await quantity();

    localStorage.removeItem('order')
    const listToPut = oneList;
    
    //récupération du localStorage
    let storage = JSON.parse(localStorage.getItem('order'));

    if (storage){

        localStorage.removeItem('order')
        storage = [];
        storage.push(listToPut)
        localStorage.setItem('order', JSON.stringify(storage))

    }else{

        storage = [];
        storage.push(listToPut)
        localStorage.setItem('order', JSON.stringify(storage))

    }

    findElementToShow()

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
    const ordering = JSON.parse(localStorage.getItem('order'));

    //création de la liste order (si elle n'existe pas)
    if (!ordering && storage){
        if (!ordering){
            window.location.reload()
        }
    }

    //Appel des fonctions pour le panier si le panier n'est pa vide 
    if (storage && storage.length > 0){

        putStorage()
        eventFormulary()

    }else {

        //affichage d'une alerte et notoyage du locale storage
        window.alert('Votre panier est vide.')
        localStorage.removeItem('order')
        localStorage.removeItem('basket')

    }
}

//---------------------------------------******************** Partie Formulaire ********************** ----------------------------------------------------

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

//créer une fonction de vérification avec oninput 

// ------------------------------------- ************************************************************* ---------------------------------------

// ------------------------------------- ************************************************************* ---------------------------------------
// ------------ Fonction pour vérifier le formats des données du formulaire 
//Elle récupére la localistation html des inputs du formulaire et des message d'erreurs
//Elle crée un objet contact avec les informations remplis dans le formulaire
//Elle compare ces informations avec les regexs de vérifications
//Si les données sont valide elle les ajoute dans l'objet contact
//Sinon elle envoie un message d'erreur
//Elle revérifie les formats de données 
//Si le format est valide elle retourne un objet contenant avec les infos 
//Sinon elle retourne false

function verifFormulary(){

    //Elements du formulaire 
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

    //regex pour nom et prénom
    const regexNames = (value) => {

        return  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\ \-]{0,50}$/i.test(value)

    };

    //regex pour une adresse française, code postal et nom de rue 
    const regexAddress = (value) => {

        return  /^[0-9]{5} [A-Za-zÀ-ÖØ-öø-ÿ ]+$/.test(value)

    };

    //regex pour une ville 
    const regexCity = (value) => {

        return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\ \-]+$/i.test(value)

    };

    //regex pour un email
    const regexEmail = (value) => {

        return  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)

    };

    //Objet contact qui seras retourné
    let contact = {

        firstName : firstName.value,
        lastName : lastName.value,
        address : address.value,
        city : city.value,
        email : email.value

    };
  
    //Vérification de chaque données du formulaire 
    if(regexNames(firstName.value) && firstName.value != ""){

        contact.firstName = firstName.value;
        firstNameError.innerHTML = "";

    }else{
        firstNameError.innerHTML = "Veuillez entrer un prénom valide. <br/>Ex : Anna, jean-jaques, raïssa, etc";
        
    }

    if(regexNames(lastName.value) && lastName.value != ""){

        contact.lastName = lastName.value;
        lastNameeError.innerHTML = "";

    }else{
        lastNameeError.innerHTML = "Veuillez entrer un nom valide. <br/>Ex : Chirac, Macron, Dali, etc...";
    }
    
    if(regexAddress(address.value)){

        contact.address = address.value;
        addressError.innerHTML = "";

    }else{
        addressError.innerHTML = "Veuillez entrer une adesse valide. <br/>Ex : 75000 rue du paradis";
    }
    
    if(regexCity(city.value)){

        contact.city = city.value;
        cityError.innerHTML = "";

    }else{
        cityError.innerHTML = "Veuillez entrer une ville valide. <br/>Ex : New-York, Paris, Barcelone, etc ...";
    }
    
    if(regexEmail(email.value)){

        contact.email = email.value;
        emailError.innerHTML = "";

    }else{
        emailError.innerHTML = "Veuillez entrer une adresse mail valide. <br/>Ex : mon-mail@email.com";
    }

    //revérification des données avant le retour et les retours
    if (regexNames(contact.firstName) && regexNames(contact.lastName) && regexAddress(contact.address) && regexCity(contact.city) && regexEmail(contact.email)){
        return contact

    }else{
        
        return false
        
    }
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
    const storage = JSON.parse(localStorage.getItem('order'));

    //ajout des ids dans la liste
    storage.forEach(element => {
        
        element.forEach(ele => {
            
            let findId = listOfId.find(e => e === ele.id);
            if (!findId){

                listOfId.push(ele.id)

            }
        });
    });

    return listOfId

}


// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction qui écoute l'événement d'envoie les données du formulaire, qui récupére les données vérifiées et les envoie
//Une fois les données vérifiés elle fait appel la fonction post pour envoyer les données à l'API

async function eventFormulary(){

    //récupération de la liste des id 
    const productsId = idOrders();
    
    //Bouton pour l'envoie du formulaire 
    const sendFormulary = document.querySelector('#order');
    

    sendFormulary.addEventListener('click', async e => {
        e.preventDefault();
        
        //récupération de l'objet contact à envoyer 
        const contactToSend = verifFormulary();

        if (contactToSend){

            //ajout de la liste des id et des infos formulaire dans un seule objet
            const objetToSend = {
                contact : contactToSend,
                products : productsId
            }

            //appel de la fonction post avec les données a envoyer en argument
            post(objetToSend)     

        }         
    });    
}

// ------------------------------------- ************************************************************* ---------------------------------------




basket()


