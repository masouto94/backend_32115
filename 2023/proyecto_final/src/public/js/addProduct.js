
const addProduct =  (e) =>{
    const prods = document.querySelector("#products")
    const value = prods.options[prods.selectedIndex].value
    console.log(value)
    return value
}
