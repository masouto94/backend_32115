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