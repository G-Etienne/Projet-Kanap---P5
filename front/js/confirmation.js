function idRecuperation(){

const idOrder = window.location.search;
const whatPartOfUrl = new URLSearchParams(idOrder)
const myIdOrder = whatPartOfUrl.get('id')
main(myIdOrder)

}

function main(id){

    const numberOrder = document.querySelector('#orderId');
    numberOrder.innerHTML = id;
    //localStorage.clear() (order et basket)

}

idRecuperation()