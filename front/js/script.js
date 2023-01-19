
// ------- Fonction pour récupérer les données de l'API
async function recup(){
    const listProducts = await fetch('http://127.0.0.1:3000/api/products').then(r => r.json());    
    return listProducts
}

// ------ Fonction pour crée les éléments html de la page d'acceuil.
// ------ La fonction va prendre chaques élément du tableau retourné par l'API
// ------ et créer un bloc de présentation pour chaques produit.
async function main(){
    //liste des produits
    const donneesApi = await recup();
    //recupération du noeud
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


main()