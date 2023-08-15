let currentProducts = []
const addProduct =  (e) =>{
    const products = document.querySelector("#products")
    currentProducts.push(products.options[products.selectedIndex].value)


}
const createCart =  (e) =>{
    e.preventDefault()
    if(currentProducts.length === 0){
        alert('No products selected')
        return
    }
    fetch('/carts/create',
    {
        method: "POST",  
        mode: "cors",  
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {
          "Content-Type": "application/json" 
        },
        redirect: "follow",
        referrerPolicy: "no-referrer", 
        body: JSON.stringify({selectedProducts:currentProducts}),  
      }).then(r=>r.json())
      currentProducts = []
      alert('Successfully created cart')
}
const cartFormBtn = document.querySelector("#cartForm")
const addProductBtn = document.querySelector("#addProduct")
addProductBtn.addEventListener('click', addProduct)
cartFormBtn.addEventListener('submit', createCart)

