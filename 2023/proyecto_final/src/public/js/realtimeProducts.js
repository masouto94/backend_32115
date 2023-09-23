import { productDetailGeneral } from "./templates/productTemplates.js"
const socket = io()
socket.emit('greeting','Conectado Realtime')

const productsContainer = document.querySelector("#currentProducts")
const createProductForm  = document.querySelector("#createProductForm")

const updateProducts = async (prods) =>{
  const templated = prods.map((product) => productDetailGeneral(product))
  productsContainer.innerHTML = '\n'.join(templated)
}
//Handlear el create product para enviar el evento ahi. Hay que crear eso
createProductForm.addEventListener('submit', (e) => socket.emit('productsModified'))
socket.on('productsModified', async (prods)=> await updateProducts(prods))