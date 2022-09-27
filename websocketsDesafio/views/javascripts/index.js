const socketClient = io()

const form = document.getElementById("formulario")
const inputTitle = document.getElementById("title")
const inputPrice = document.getElementById("price")
const inputThumbnail = document.getElementById("thumbnail")




form.onsubmit = (event) => {
    event.preventDefault()
    const data = {
        title: inputTitle.value,
        price: inputPrice.value,
        thumbnail: inputThumbnail.value
    }
    if(Object.values(data).every(Boolean)){
        socketClient.emit('productLoaded', data)
        inputTitle.value=''
        inputPrice.value=''
        inputThumbnail.value=''
    }
}

socketClient.on('showAllProds', productList =>{
    console.log(productList)
    products=productList

})


