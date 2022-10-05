console.log("Este es el proyecto")

const confirm_update = (event) => {
    if(!confirm("Queres crear un carrito?")){
        event.preventDefault()
    }
    return
}

let createCartButton = document.querySelector('#createCart')
createCartButton.addEventListener('submit', confirm_update)

let deleteAll = document.querySelector('#deleteAll')
deleteAll.addEventListener('click', async ()=>{
    await fetch('/api/products/deleteAll',{
        method:"DELETE"
    })
    alert("Se borro todo")
})

let deleteByID = document.querySelector('#deleteByID')
deleteByID.addEventListener('submit', async (e)=>{
    e.preventDefault()
    console.log("#################################")
    let idToDelete= document.querySelector('#idDelete').value
    console.log(idToDelete)
    await fetch('/api/products/delete/'+idToDelete,{
        method:"DELETE",

    })
    alert(`Se borro elemento con id ${idToDelete}`)
})

let putRequestInputs = ["modifyCode", "modifyTitle", "modifyPrice", "modifyThumbnail"]
let putRequestForm = document.querySelector('#modifyForm')
putRequestForm.addEventListener('submit', async (req) =>{
    console.log(req)
})