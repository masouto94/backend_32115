class MissingPropertyError extends Error{
    constructor(message){
        super(message)
        this.name = this.constructor.name
    }
}
class ProductAlreadyExistsError extends Error{
    constructor(message){
        super(message)
        this.name = this.constructor.name
    }
}
class ProductNotFoundError extends Error{
    constructor(message){
        super(message)
        this.name = this.constructor.name
    }
}


class Product{
    constructor(title, code, price, stock, description, thumbnail){
        this.title = title
        this.code = code
        this.price = price
        this.stock = stock
        this.description = description
        this.thumbnail = thumbnail
        if(this.validateAttributes()){
            throw new MissingPropertyError("None of Product properties can be null or undefined")
        }
    }
    validateAttributes(){
        return Object.values(this).includes(undefined) || Object.values(this).includes(null) || Object.values(this).includes(false)
    }
}

class ProductManager{
    constructor(products=[]){
        this._products = this.validateProductList(products)
        this._uid = 0
    }
    get products(){
        return this._products
    }
    set products(value){
        this._products = this.validateProductList(value)
    }
    validateProductList(productList){
        if(productList.length === 0){
            return []
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
        const found = this.products.find(item => item.id == id)
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
const mate = new Product("Mate",0,100,10,"Un mate normal", "photoUrl")
const mateRepeated = new Product("Mate que no se podria agregar",0,100,10,"Un mate normal", "photoUrl")
const termo = new Product("Termo",1,200,10,"Un termo normal", "photoUrl")
const termoStanley = new Product("Termo stanley",2,500,5,"Un termo genial", "photoUrl")

//Product Manager
const productManager = new ProductManager()

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

//Validate that missing id throws error
try{
    productManager.getProductById(999)
} catch(e) {
    console.error(`Failed due to =>${e.name} ${e.message}`)
    console.log("Existing ids:", productManager.getProducts().map(product => product.id))
    console.log("------------")
}

//Validate that products with repeated code cannot be added
try{
    productManager.addProduct(mateRepeated)
} catch(e) {
    console.error(`Did not add product due to =>${e.name} ${e.message}`)
    console.log("Products with code 0:", productManager.getProductByCode(0))
    console.log("------------")
}

//Validate that productList can't be mutated without checking type
try{
    productManager.products = ['lololo']

} catch(e){
    console.error(`Did not reassign productList due to =>${e.name} ${e.message}`)
    console.log("Current list: ", productManager.getProducts())
    console.log("------------")
}

//Validate that productList can be mutated if a list of Product items is provided
const yerba = new Product("Yerba",0,60,1000,"Yerba", "photoUrl")
const vela = new Product("Vela",1,10,100,"Una vela para el corte de luz", "photoUrl")
const televisor = new Product("Televisor",2,10,120000,"Televisor 4K", "photoUrl")

productManager.products = [yerba, vela, televisor]
console.log("New products",productManager.getProducts())