// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction qui permet de récupérer les données de l'API
// Récupère la liste des produits dans l’API

// besoin précis → récupérer les données de l’API

async function recup(){

    const listProducts = await fetch('http://127.0.0.1:3000/api/products').then(r => r.json());    
    return listProducts

}

// ------------------------------------- ************************************************************* ---------------------------------------
// ---------- Fonction pour crée les éléments html de la page d'acceuil.
// Récupère les informations à ajouter 
// Récupère la position dans le html ou doivent être ajoutés les éléments.
// Pour chaque élément de la liste de l’API elle construit: 
// un lien
// un article 
// une image 
// le nom du produit 
// la description du produit 

// Besoin précis → construire le html pour avec les informations de l’API

async function main(){
    //liste des produits
    const donneesApi = await recup();

    //recupération de l'emplacement dans la page html
    //où ajouter les produits
    const ajoutElements = document.querySelector('.items');

    // création de bloc pour chaque élément
    donneesApi.forEach(element => {
        
        //liens
        const lien = document.createElement('a');
        lien.setAttribute('href', 'product.html?id=' + element._id)
        ajoutElements.prepend(lien)

        //articles
        const article = document.createElement('article');
        lien.append(article)

        //images
        const image = document.createElement('img');
        image.setAttribute('src', element.imageUrl)
        image.setAttribute('alt', element.altTxt)
        article.append(image)


        //noms des produits
        const nameProduct = document.createElement('h3');
        nameProduct.setAttribute('class', 'productName')
        nameProduct.innerText = element.name;
        article.append(nameProduct)


        //descriptions des produits
        const descriptionProduct = document.createElement('p');
        descriptionProduct.setAttribute('class', 'productDescription')
        descriptionProduct.innerText = element.description;
        article.append(descriptionProduct)

    });
} 
// ------------------------------------- ************************************************************* ---------------------------------------


main()