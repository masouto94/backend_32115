const socket = io()
socket.emit('greeting','Bienvenido al websocket')
const cartForm = document.querySelector("#cartForm")
const addProductBtn = document.querySelector("#addProduct")
const updateCartForm = document.querySelector("#updateCartForm")
const currentCarts = document.querySelector("#currentCarts")
const currentProducts = document.querySelector("#currentProducts")
const confirmPurchaseBtn = document.querySelector("#confirmPurchase")

let productIds = []
let currentCart = {products:[]}

const togglePurchaseButton = () => {
  currentCart.products.length === 0 ? confirmPurchaseBtn.setAttribute('disabled',"") : confirmPurchaseBtn.removeAttribute('disabled',"")
}

const fetchData = async (data, url, method="GET", contentType="application/json") => {
  return await fetch(url,
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
    const res = await fetchData(JSON.stringify({selectedProducts:productIds}), '/carts/create', "POST")
    currentCart = res.carts
    productIds = []
    currentProducts.innerHTML = null
    return res
}

const updateCart =  async (e) =>{
  e.preventDefault()
  // const productToAdd = document.querySelector("#productIdToAdd").value
  // const cartToUpdate = document.querySelector("#cartToUpdate").value
  // const quantity = document.querySelector("#prodQuantity").value
  // console.log(cartToUpdate,productToAdd)
  // if(quantity){
  //   await fetchData({quantity:parseInt(quantity)},`/carts/${cartToUpdate}/product/${productToAdd}`, "PUT")
  // }
  // else{
  //   await fetch(`/carts/${cartToUpdate}/product/${productToAdd}`, {method:"PUT"})
  // }
  alert(`Somehow it doesn't work. Please use postman`)
}

const renderCarts =  (cart) =>{  
  let template = `<div class="cart" id="cart_${cart._id}">`
  let prods=``
  for (const prod of cart.products) {
    prods += `<h3>${prod.prod_id.title}: ${prod.quantity}</h3>`
  }
  template += prods
  template += `<h4>Price:${cart.price}</h4></div>`
  currentCarts.innerHTML = template
  togglePurchaseButton()
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

const confirmPurchase = async (e) =>{
  e.preventDefault()
  await fetchData([], '/carts/purchase', "POST")
}

addProductBtn.addEventListener('click', async (e) =>{
  await addProduct(e)
  socket.emit('renderProduct',productIds)
})

confirmPurchaseBtn.addEventListener('click', async(e) =>{
  await confirmPurchase(e)
})

cartForm.addEventListener('submit', async(e) => {
  const res = await createCart(e)
  if(res.error){
    console.error(res.error)
    return
  }
  socket.emit('createCart')

})

updateCartForm.addEventListener('submit', async (e) => await updateCart(e))
socket.on('createCart', () => renderCarts(currentCart))
socket.on('renderProduct', renderProducts)
