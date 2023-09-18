const socket = io()
socket.emit('greeting','Bienvenido al websocket')
const cartForm = document.querySelector("#cartForm")
const addProductBtn = document.querySelector("#addProduct")
const updateCartForm = document.querySelector("#updateCartForm")
const currentCarts = document.querySelector("#currentCarts")
const currentProducts = document.querySelector("#currentProducts")

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

const addProduct =  async (e) =>{
  const products = document.querySelector("#products")
  const prod_id = products.options[products.selectedIndex].value
  const index = productIds.findIndex(item => item.id === prod_id)
  if(index !== -1){
    productIds[index].quantity++
  }
  else{
    productIds.push({id:prod_id, quantity:1})
  }
  

}

const createCart =  async (e) =>{
    e.preventDefault()
    if(productIds.length === 0){
        alert('No products selected')
        return
    }
    const ids = productIds.map(item => item.id)
    await fetchData(JSON.stringify({selectedProducts:productIds}), '/carts/create', "POST")
    productIds = []
    currentProducts.innerHTML = null
    
}

const updateCart =  async (e) =>{
  e.preventDefault()
  // const productToAdd = document.querySelector("#productIdToAdd").value
  // const cartToUpdate = document.querySelector("#cartToUpdate").value
  // await fetchData(JSON.stringify({"cid": cartToUpdate,"pid": productToAdd}), '/carts/:cid/product/:pid', "POST")
  alert(`Not Implemented yet. Please use postman`)
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

const renderProducts =  (prods) =>{ 
  let box =  `<h3>Products</h3><div class="products">`
  templates = []
  prods.forEach(prod => {
    const productBox = `<div class="productBox" id=prod_${prod.prod_id}>
    <h3>${prod.title}: ${prod.quantity}</h3>
    </div>`
    templates.push(productBox)
  })
  currentProducts.innerHTML = `${box}${templates.join('\n')}</div>`
}

addProductBtn.addEventListener('click', async (e) =>{
  await addProduct(e)
  socket.emit('renderProduct',productIds)
})

cartForm.addEventListener('submit', async(e) => {
  await createCart(e)
  socket.emit('createCart')
})

updateCartForm.addEventListener('submit', updateCart)
socket.on('createCart', renderCarts)
socket.on('renderProduct', renderProducts)
