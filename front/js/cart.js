
//fonction qui renvoie les différents model de commande
async function whatOrder(){
    //récupération des produits en vente 
    const listProducts = await fetch('http://127.0.0.1:3000/api/products').then(r => r.json());

    //récupération du panier 
    const storage = JSON.parse(localStorage.getItem('basket'));

    //liste des models dans le panier 
    let listModel = [];

    listProducts.forEach(element => {
        
        let findId = storage.find(e => element._id === e.id);
        
        if (findId){

            listModel.push(findId)

        }
        

    });

    return listModel

}
// fonction qui crée un objet pour chaque model
async function models(){

    //création d'un model d'objet à stocker 
    class ModelForOrder {
        constructor(id, color, quantity){
            this.id = id;
            this.color = color;
            this.quantity = quantity;
        }

    }

    //liste d'objet 
    let listModels = [];

    //fonction qui renvoie les différents model de commande
    let modelsOfProducts = await whatOrder();

    //fonction qui contstruit un objet pour chaque models

    modelsOfProducts.forEach(mod => {
        
        let newOrder = new ModelForOrder (mod.id, '', 0);
        listModels.push(newOrder)
        

    });
    return listModels
}

//fonction qui  tri le storage par groupe

async function storageModels(){
    
    //récupération du panier 
    const storage = JSON.parse(localStorage.getItem('basket'));

    const listOfModels = await models();

    let groupOfModel = [];
    
    listOfModels.forEach(element => {
        
        let finfProduct = storage.filter(e => element.id === e.id)
        groupOfModel.push(finfProduct)

    });
    return groupOfModel


}
 //Fonction qui retourne une liste de paire model/couleur du panier 


async function colorFind(){ 
    
    //récupération du panier 
    const storage = JSON.parse(localStorage.getItem('basket'));
    
    const storeMod = await storageModels();

    //création d'un model d'objet à stocker 
    class ModelForOrder {
        constructor(id, color, quantity){
            this.id = id;
            this.color = color;
            this.quantity = quantity;
        }

    }

    //liste couleur à afficher 
    let listOfColors = [];

    storage.forEach(element => {

        let findColor = listOfColors.find(e => element.colorProduct === e.color);
        if (!findColor){

            let listIdColor = new ModelForOrder(element.id, element.colorProduct, 0);
            listOfColors.push(listIdColor)

        }
        
    });
    return listOfColors
}


// fonction qui construi la derniere liste d'objet avec la quantité ajuster 
async function quantity(){
    //récupération du panier 
    const storage = JSON.parse(localStorage.getItem('basket'));

    //récupération des produits en vente 
    const listProducts = await fetch('http://127.0.0.1:3000/api/products').then(r => r.json()); 

    //création d'un model d'objet à stocker 
    class ModelForOrder {
        constructor(id, color, quantity){
            this.id = id;
            this.color = color;
            this.quantity = quantity;
        }

    }

    const listColorProduct = await colorFind();

    let lastListForBasket = [];

    listColorProduct.forEach(element => {

        let quantityOfThis = 0;
        
        storage.forEach(e => {

            if (element.id === e.id && element.color === e.colorProduct){

                quantityOfThis = quantityOfThis + e.quantityProduct;

            }
            
        });

        let lastObject = new ModelForOrder(element.id, element.color, quantityOfThis);
        lastListForBasket.push(lastObject)

    });
    
    console.log(lastListForBasket)



}

quantity()