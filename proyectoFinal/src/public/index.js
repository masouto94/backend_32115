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

let deleteByID = document.querySelector('#deleteByID')
deleteByID.addEventListener('submit', async (e)=>{
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
    let idToUpdate= document.querySelector('#modifyID')
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
    let cartIDToUpdate= document.querySelector('#cartID').value
    let productIDToAdd= document.querySelector('#productID').value
    await fetch("/api/cart/"+cartIDToUpdate+"/products/"+productIDToAdd, {
        method:"POST"
    })
    e.target.reset()
})