const socket = io()
socket.emit('greeting','Bienvenido al websocket')
const cartForm = document.querySelector("#cartForm")
const addProductBtn = document.querySelector("#addProduct")
const updateCartForm = document.querySelector("#updateCartForm")
const currentCarts = document.querySelector("#currentCarts")
const currentProducts = document.querySelector("#currentProducts")
const confirmPurchaseBtn = document.querySelector("#confirmPurchase")
const ticketContainer = document.querySelector("#currentTickets")
let productIds = []
let currentCart = {products:[]}
let currentTickets = []
let ticketTemplates = []


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




const renderCarts =  (cart) =>{  
  let template = `<div class="cart" id="cart_${cart._id}">`
  let prods=``
  for (const prod of cart.products) {
    prods += `<h3>${prod.prod_id.title}: ${prod.quantity}</h3>`
  }
  template += prods
  const price = cart.products.reduce((accumulator, product) => {
    return accumulator + (product.prod_id.price * product.quantity) 
    }, 0)
  template += `<h4>Price:${price}</h4></div>`
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
const renderTickets =  (tickets) =>{  
  for(let ticket of tickets){
    let template = `<div class="tickets" id="ticket_${ticket._id}">`
    let prods=``
    for (const prod of ticket.products) {
      prods += `<h3>${prod.prod_id.title}: ${prod.quantity}</h3>`
    }
    template += prods
    template += `<h4>Price:${ticket.amount}</h4></div>`
    ticketTemplates.push(template)

  }
  ticketContainer.innerHTML = ticketTemplates.join('\n')
}

const confirmPurchase = async (e) =>{
  e.preventDefault()
  currentTickets = await fetchData([], '/carts/purchase', "POST").then(tickets => tickets.tickets)
  socket.emit('purchaseCart')
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

socket.on('createCart', () => renderCarts(currentCart))
socket.on('purchaseCart', () => renderTickets(currentTickets))
socket.on('renderProduct', renderProducts)
