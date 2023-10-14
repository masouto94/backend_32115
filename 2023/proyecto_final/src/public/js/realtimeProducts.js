import { productDetailGeneral } from "./templates/productTemplates.js"
const socket = io()
socket.emit('greeting','Conectado Realtime en Current')

const productsContainer = document.querySelector("#currentProducts")


const updateProducts = async (prods) =>{
  const templated = prods.map((product) => productDetailGeneral(product))
  productsContainer.innerHTML = templated.join('\n')
}

socket.on('productsModified', async (prods)=> await updateProducts(prods))