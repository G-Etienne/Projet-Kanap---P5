
//fonction qui renvoie une objet
function newObjetc(idd, colorPro, quantityProd){

    //model de l'objet
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

// fonction qui met la liste trié de produit du panier le local storage
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


 //Fonction qui retourne une liste de paire model/couleur du panier 
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



// fonction qui ajoute la quantité de produit pour chaque modele 
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
// constuction total produit 
function numberAndPriceProducts(theQuantity, price){
      

    const quantityTotal = document.querySelector('#totalQuantity')
    quantityTotal.innerText = theQuantity;

    const priceTotal = document.querySelector('#totalPrice')
    priceTotal.innerText = price;

}

//Fonction evenement quantité
async function eventQuantity(placeInput, oneId, oneColor){
    

    placeInput.addEventListener('click', e => {

        let quantityChange = parseInt(placeInput.value);

        if (quantityChange > 100){

            window.alert("Vous avez dépasser le nombre d'articles autorisés pour ce modèle. Nombres autorisés maximal : 100")

        }else if (quantityChange <= 0){

            window.alert("Le nombre minimal requis pour commander ce modèle est de : 1. Si vous ne voulez plus commander ce produit, appuyer sur Supprimer.")

        }else if (quantityChange <= 100){
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
            storage = [];
            storage.push(newList)

            localStorage.removeItem('basket')
            localStorage.setItem('basket', JSON.stringify(newList))

            localStorage.removeItem('order')
            localStorage.setItem('order', JSON.stringify(storage))
            
            location.reload()
        }
    
    });
    
}

//Fonction événement suppréssion
async function eventDelete(placeInput, oneId, oneColor){
    

    placeInput.addEventListener('click', e => {

        let storage = JSON.parse(localStorage.getItem('basket'));

        const alert = window.confirm("Voulez-vous réellement supprimer cet article ?");

        const newList = [];
        
        if (alert){

            storage.forEach(element => {
                
                if (element.color != oneColor || element.id != oneId){
                    
                    newList.push(element)
                    
                }

            });
            storage = [];
            storage.push(newList)

            localStorage.removeItem('basket')
            localStorage.setItem('basket', JSON.stringify(newList))

            localStorage.removeItem('order')
            localStorage.setItem('order', JSON.stringify(storage))

            location.reload()

        }
    
    });
    
}


//Fonction pour afficher chaque élément par model 
async function findElementToShow(){

    //récupération des produits en vente 
    const listProducts = await fetch('http://127.0.0.1:3000/api/products').then(r => r.json()); 

    //récupération des commandes 
    const ListOrders = JSON.parse(localStorage.getItem('order'));

    //création d'une boucle qui va comparer chaque commandes 
    //avec les produits à la vente 
    //et les afficher si un produit si trouve

    
    let quantityTotal = 0;
    let priceTotal = 0;

    listProducts.forEach(element => {
        
        ListOrders.forEach(e => {
            
            e.forEach(ele => {
                
                if(element._id === ele.id){

                    priceTotal += element.price * ele.quantity;
                    
                    quantityTotal += ele.quantity;

                    contructor(element.imageUrl, element.name, ele.color, element.price, ele.quantity, element.altTxt , element._id)
    
    
                }

            });
            
            

        });

    });
  
    numberAndPriceProducts(quantityTotal, priceTotal)

}


//Fonction pour construire les éléments de la page 
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
    eventQuantity(quantityInput ,theIdd, color)

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

async function basket(){
    
    const storage = JSON.parse(localStorage.getItem('basket'));
    
    if (storage && storage.length > 0){

        putStorage()
        eventFormulary()

    }else {

        window.alert('Votre panier est vide.')
        localStorage.removeItem('order')
        localStorage.removeItem('basket')

    }

   

}

//Fonction qui récupére la liste des id de la commande
function idOrders(){

    //liste des id de la commande
    let listOfId = [];

    //Récupération du LocalStorage
    const storage = JSON.parse(localStorage.getItem('order'));

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

   

        let contact = {

            firstName : firstName.value,
            lastName : lastName.value,
            address : address.value,
            city : city.value,
            email : email.value
    
        };

     
    
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
    if (regexNames(contact.firstName) && regexNames(contact.lastName) && regexAddress(contact.address) && regexCity(contact.city) && regexEmail(contact.email)){
        return contact

    }else{
        
        return false
        
    }
   
    

}

function idReturn(resp){
    
    let idToSend = "/front/html/confirmation.html?id=" +JSON.stringify(resp.orderId);
    document.location.href=idToSend;
    

}



async function post(thingToSend){

    await fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            "Accept" : "application/json",
            "Content-Type" : "application/json"

        },
        body: JSON.stringify(thingToSend),
    })
    .then(res => res.json())
    .then(data => idReturn(data))
}



async function eventFormulary(){

    //liste des id 
    const productsId = idOrders();
    
    //Bouton pour l'envoie du formulaire 
    const sendFormulary = document.querySelector('#order');
    

    sendFormulary.addEventListener('click', async e => {
        e.preventDefault();
        
        const contactToSend = verifFormulary();
        if (contactToSend){
            const objetToSend = {
                contact : contactToSend,
                products : productsId
            }
            post(objetToSend)       
        }  
        

        
        
    });    

}






basket()


