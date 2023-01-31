
// ------------------------------------- ************************************************************* ---------------------------------------
// --------- Fonction qui envoie les données dans le localStorage
// Crée un objet à envoyer avec la couleur, la quantité et l’id d’un élément que l’on veut ajouter au local storage
// Vérifie si cet élément n’est pas déjà dans le local storage 
// Crée un nouvelle liste d’objet qui contient le nouvel élément : 
// soit la quantité est mise à jour si l’élément est déjà présent dans le local Storage 
// soit elle ajoute l’objet comme un nouvel élément 
// Remplace la liste du localStorage par la nouvelle liste qui est créée.

// Besoin précis → ajouter un nouvel élément dans le local storage en évitant les doublons.

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
// Elle prend en paramètre l’id, la couleur et la 	quantité d'un produit que l’utilisateur souhaite ajouter.
// Récupére les commandes du panier dans le local storage 
// Vérifie si un même élément correspond au produit que l’on veut ajouter 
// Si un même élément si trouve elle renvoie le cumul de la quantité de cet élément avec l’élément que l’utilisateur souhaite ajouter
// Sinon elle retourne la quantité de base du produit que l’utilisateur souhaite ajouter 

// Besoin précis → retourner la quantité totale d’un produit que l’on souhaite ajouter pour vérifier que l’on ne dépasse pas le nombre d'articles autorisés.

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
// --------- Fonction qui  vérifie les formats de données des inputs 
// Elle récupère l’élément à écouter 
// Elle récupère la quantité total du produit avec le panier grace à la fonction totalQuanti()
// Si la couleur n’est pas renseignée elle affiche un message d’alerte
// Si la quantité est : 
// trop basse → message d’erreur qui demande une quantité valide
// trop haute → message d’erreur qui dit que le nombre d'articles autorisés est dépassé et qui indique le nombre restant d'ajout pour le produit.
// Si toutes les informations sont renseignées elle appelle la fonction storageItem() avec les infos du produits à ajouter en paramètre.

// Besoin précis → vérifie que les données des inputs sont bien renseignées et qu'elles correspondent aux exigences du site.

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
// Elle construit le html avec les informations du produits placer en paramètre 
// Elle récupère la position de chaque élément auquel on doit ajouter les informations du produit.
// Crée une option pour chaque couleur du produit 
// Ajoute le nom du produit en titre d’onglet de page 
// Crée et ajoute l’image du produit 
// Ajoute le reste des informations du produits
// Elle appelle la fonction choiceUser() qui vérifie la valeur des inputs.

// Besoin précis → Construire les éléments html de la page avec les informations placer en paramètre.

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
// Elle récupère l’id du produit dans l’url de la page.
// Elle retourne cet id.

// Besoin précis → récupérer l’id du produit dans l’url de la page.

function IdProduc(){

    const idInUrl = window.location.search;
    const whatPartOfUrl = new URLSearchParams(idInUrl);
    const myId = whatPartOfUrl.get('id');
    
    return myId

}

// ------------------------------------- ************************************************************* ---------------------------------------
// --------- Fonction principale pour afficher la page avec le bon produit 
// Elle envoie une requête fetch avec l’id d’un produit dans l’url pour récupérer les informations d’un produit précis .
// Elle fait appelle à la fonction construction() avec les information du produit placer en paramètre

// Besoin précis → récupérer les informations du produit cibler pour pouvoir l’afficher avec la fonction construction()

async function main(){

    const theId = IdProduc();
    let urlForProduct = 'http://127.0.0.1:3000/api/products/' + theId
    const theProduct = await fetch(urlForProduct).then(r => r.json());

    construction(theProduct.imageUrl, theProduct.altTxt, theProduct.name, theProduct.price, theProduct.description, theProduct.colors, theProduct._id)  

}
// ------------------------------------- ************************************************************* ---------------------------------------

main()
