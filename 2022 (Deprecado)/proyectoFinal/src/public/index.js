console.log("Este es el proyecto")

const confirm_update = (event, msj) => {
    if(!confirm(msj)){
        event.preventDefault()
        return false
    }
    return true
}

let createCartButton = document.querySelector('#createCart')
createCartButton.addEventListener('submit', async (e) => {
    confirm_update(e, "Queres crear un carrito?")
})

let deleteAll = document.querySelector('#deleteAll')
deleteAll.addEventListener('click', async (e)=>{
    if(confirm_update(e, "Queres Borrar todo?")){
        await fetch('/api/products/deleteAll',{
            method:"DELETE"
        })
        alert("Se borro todo")
    }
})

let deleteById = document.querySelector('#deleteById')
deleteById.addEventListener('submit', async (e)=>{
    e.preventDefault()
    let idToDelete= document.querySelector('#idDelete')
    console.log(idToDelete)
    await fetch('/api/products/delete/'+idToDelete.value,{
        method:"DELETE",

    })
    e.target.reset()
})

let putRequestForm = document.querySelector('#modifyForm')
putRequestForm.addEventListener('submit', async (e) =>{
    e.preventDefault()
    let idToUpdate= document.querySelector('#modifyId')
    console.log(idToUpdate)

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let formEntries = new FormData(putRequestForm).entries()
    let formEntriesValues={}
    for (const value of formEntries) {
        if(value[0] !== 'id' && value[1] !== ''){
        formEntriesValues[value[0]]=value[1]
        }
    }
    let data = JSON.stringify({formEntriesValues});
    console.log(data)
    let requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: data,
    };

    await fetch("/api/products/update/"+idToUpdate.value, requestOptions)
    e.target.reset()
})

let addProductToCartForm = document.querySelector('#addProductToCart')
addProductToCartForm.addEventListener('submit', async (e) =>{
    e.preventDefault()
    let cartIdToUpdate= document.querySelector('#cartId').value
    let productIdToAdd= document.querySelector('#productId').value
    await fetch("/api/cart/"+cartIdToUpdate+"/products/"+productIdToAdd, {
        method:"POST"
    })
    e.target.reset()
})

let deleteByCartId = document.querySelector('#deleteByCartId')
deleteByCartId.addEventListener('submit', async (e)=>{
    e.preventDefault()
    let idToDelete= document.querySelector('#cartIdToDelete')
    console.log(idToDelete.value)
    await fetch('/api/cart/delete/'+idToDelete.value,{
        method:"DELETE",

    })
    e.target.reset()
})

let deleteProductFromCart = document.querySelector('#deleteProductFromCart')
deleteProductFromCart.addEventListener('submit', async (e)=>{
    e.preventDefault()
    let cartIdToDelete= document.querySelector('#deleteProductFromCartCartId')
    let productIdToDelete= document.querySelector('#deleteProductFromCartProductId')
    console.log(cartIdToDelete.value)
    console.log(productIdToDelete.value)
    await fetch('/api/cart/'+cartIdToDelete.value+'/products/'+productIdToDelete.value,{
        method:"DELETE",

    })
    e.target.reset()
})