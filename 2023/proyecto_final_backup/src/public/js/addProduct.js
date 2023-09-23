const socket = io()
socket.emit('greeting','Bienvenido al websocket')
const selectedQuantity = document.querySelector("#selectedProductsQuantity")
const cartForm = document.querySelector("#cartForm")
const addProductBtn = document.querySelector("#addProduct")
const updateCartForm = document.querySelector("#updateCartForm")
const currentCarts = document.querySelector("#currentCarts")

let productIds = []

const fetchData = async (data, url, method="GET", contentType="application/json") => {
  await fetch(url,
  {
      method: method,  
      mode: "cors",  
      cache: "no-cache", 
      credentials: "same-origin", 
      headers: {
        "Content-Type": contentType 
      },
      redirect: "follow",
      referrerPolicy: "no-referrer", 
      body: data,  
    }).then(r=>r.json())
}

const addProduct =  (e) =>{
    const products = document.querySelector("#products")
    let productId = parseInt(products.options[products.selectedIndex].value)
    // socket.emit('addProduct', productId)
    productIds.push(products.options[products.selectedIndex].value)
    selectedQuantity.textContent = parseInt(selectedQuantity.textContent) + 1
}

const createCart =  async (e) =>{
    e.preventDefault()
    if(productIds.length === 0){
        alert('No products selected')
        return
    }
    await fetchData(JSON.stringify({selectedProducts:productIds}), '/carts/create', "POST")
    productIds = []
    selectedQuantity.textContent = 0
    
    // alert('Successfully created cart')
}

const updateCart =  async (e) =>{
  e.preventDefault()
  const productToAdd = document.querySelector("#productIdToAdd").value
  const cartToUpdate = document.querySelector("#cartToUpdate").value
  await fetchData(JSON.stringify({"cid": cartToUpdate,"pid": productToAdd}), '/carts/:cid/product/:pid', "POST")
  alert(`Successfully added product ${productToAdd} to cart: ${cartToUpdate}`)
}

const renderCarts = async (carts) =>{  
  const templates = carts.map((cart)=>{
    let template = `<div class="cart" id="cart_${cart._id}">`
    let prods=``
    for (const prod of cart.products) {
      prods += `<h3>${prod.prod_id.title}: ${prod.quantity}</h3>`
    }
    template += prods
    template += `<h4>Price:${cart.price}</h4></div>`
    return template
  })
  currentCarts.innerHTML = templates.join('\n')
}

const renderProduct =  (prod) =>{
  return  
  // const templates = carts.map((cart)=>{
  //   let template = `<div class="cart" id="cart_${cart.id}">`
  //   let prods=``
  //   for (const prod of cart.products) {
  //     prods += `<h3>${prod.title}: ${prod.quantity}</h3>`
  //   }
  //   template += prods
  //   template += `<h4>Price:${cart.price}</h4></div>`
  //   return template
  // })
  // currentCarts.innerHTML = templates.join('\n')
}

addProductBtn.addEventListener('click', addProduct)
cartForm.addEventListener('submit', async(e) => {
  await createCart(e)
  socket.emit('createCart')
  

})
updateCartForm.addEventListener('submit', updateCart)
// socket.on('reRenderCarts', renderCarts)
socket.on('createCart', renderCarts)
