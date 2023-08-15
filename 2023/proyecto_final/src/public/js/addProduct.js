const selectedQuantity = document.querySelector("#selectedProductsQuantity")
const cartForm = document.querySelector("#cartForm")
const addProductBtn = document.querySelector("#addProduct")
const updateCartForm = document.querySelector("#updateCartForm")

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
      alert('Successfully created cart')
}

const updateCart =  async (e) =>{
  e.preventDefault()
  const productToAdd = document.querySelector("#productIdToAdd").value
  const cartToUpdate = document.querySelector("#cartToUpdate").value
  await fetchData(JSON.stringify({"cid": cartToUpdate,"pid": productToAdd}), '/carts/:cid/product/:pid', "POST")
  alert(`Successfully added product ${productToAdd} to cart: ${cartToUpdate}`)
}

addProductBtn.addEventListener('click', addProduct)
cartForm.addEventListener('submit', createCart)
updateCartForm.addEventListener('submit', updateCart)


