class ProductAlreadyExistsError extends Error{
}
class ProductNotFoundError extends Error{
}

class Product{
    constructor(title, code, price, stock, description, thumbnail){
        this.title = title
        this.code = code
        this.price = price
        this.stock = stock
        this.description = description
        this.thumbnail = thumbnail
    }
}

class ProductManager{
    constructor(products=[]){
        this.products = this.validateProductList(products)
        this._uid = 0
    }
    validateProductList(productList){
        if(productList.length === 0){
            return productList
        }
        for(let product of productList){
            if(!(product instanceof Product)){
                throw new TypeError("Can only add Product-like objects") 
            }
        }
        return productList
    }
    getProducts(){
        return this.products
    }
    getProductById(id){
        let found = this.products.find(item => item.id == id)
        if (!found){
            throw new ProductNotFoundError(`Product with id: ${id} not found in Manager`)
        }
        return found
    }
    getProductByCode(code){
        return this.products.find(item => item.code == code)
    }
    addProduct(product){
        if(!(product instanceof Product)){
            throw new TypeError("Can only add Product-like objects")
        }
        if(this.getProductByCode(product.code)){
            throw new ProductAlreadyExistsError("Can not add a product whose code is already in Manager")
        }
        product.id = this._uid
        this.products.push(product)
        this._uid++
    }
}

//Products
let mate = new Product("Mate",0,100,10,"Un mate normal", "photoUrl")
let mateRepeated = new Product("Mate que no se podria agregar",0,100,10,"Un mate normal", "photoUrl")
let termo = new Product("Termo",1,200,10,"Un termo normal", "photoUrl")
let termoStanley = new Product("Termo stanley",2,500,5,"Un termo genial", "photoUrl")

//Product Manager
let productManager = new ProductManager()

//Validate only instances of Product can be added. Also check function getProducts()
try{
    productManager.addProduct({name: "this cannot be added as product"})
} catch(e) {
    console.error(`Did not add product due to =>${e.name} ${e.message}`)
    console.log("Current products: ", productManager.getProducts())
    console.log("------------")
}

//Add valid products and test ID is autoincremental
productManager.addProduct(mate)
productManager.addProduct(termo)
productManager.addProduct(termoStanley)
console.log("Product with id 0 =>", productManager.getProductById(0))
console.log("Product with id 1 =>", productManager.getProductById(1))
console.log("Product with id 2 =>", productManager.getProductById(2))
console.log("------------")

//Validate that products with repeated code cannot be added
try{
    productManager.addProduct(mateRepeated)
} catch(e) {
    console.error(`Did not add product due to =>${e.name} ${e.message}`)
    console.log("Products with code 0:", productManager.getProductByCode(0))
    console.log("------------")
}