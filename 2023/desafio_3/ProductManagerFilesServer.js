import fs from 'fs'
class MissingPropertyError extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
    }
}
class ProductAlreadyExistsError extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
    }
}
class ProductNotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
    }
}
class InvalidInteger extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
    }
}

class Product {
    constructor(title, code, price, stock, description, thumbnail) {
        this.title = title
        this.code = code
        this.price = price
        this.stock = stock
        this.description = description
        this.thumbnail = thumbnail
        if (this.#validateAttributes()) {
            throw new MissingPropertyError("None of Product properties can be null or undefined")
        }
    }
    #validateAttributes() {
        return Object.values(this).includes(undefined) || Object.values(this).includes(null) || Object.values(this).includes(false)
    }
}

class ProductManager {
    #products = []
    #uid  = this.#validateUid(0)
    constructor(path) {
        this.path = path


    }
    get uid() {
        return this.#uid
    }
    set uid(value) {
        this.#uid = value
    }
    get products() {
        return this.#products
    }

    set products(value) {
        let newUid = 0
        let newProducts = []
        for (let product of this.#validateProductList(value)) {
            product.id = newUid
            newProducts.push(product)
            newUid++
        }
        this.uid = newUid
        this.#products = newProducts
    }
    #validateUid(uid) {
        if (!Number.isInteger(uid)) {
            throw TypeError("UID must be integer")
        }
        if (uid < 0) {
            throw InvalidInteger("UID must be equal or greater than 0")
        }
        return parseInt(uid)
    }
    #validateProductList(productList) {
        if (productList.length === 0) {
            return []
        }
        for (let product of productList) {
            if (!(product instanceof Product)) {
                throw new TypeError("Can only add Product-like objects")
            }
        }
        return productList
    }
    getProducts = async () => {
        this.products = await fs.promises.readFile(this.path, "utf-8")
            .then(elem => JSON.parse(elem))
            .then(res => res.map(item => {
                let { id, ...rest } = item
                let product = new Product(...Object.values(rest))
                product.id = id
                return product
                }
            )
        )
        this.uid = Math.max(...Object.values(this.products.map(prod => prod.id)))
        return this.products
    }

    getProductById = async (id) => {
        const found = await this.getProducts().then((res)=>res.find(item => item.id == id))
        
        if (!found) {
            throw new ProductNotFoundError(`Product with id: ${id} not found in Manager`)
        }
        return found
    }
    getProductByCode = async (code) => {
        const prods = await this.getProducts() 
        return prods.find(item => item.code == code)
    }
    addProduct = async (product) => {
        if (!(product instanceof Product)) {
            throw new TypeError("Can only add Product-like objects")
        }
        if (await this.getProductByCode(product.code)) {
            throw new ProductAlreadyExistsError("Can not add a product whose code is already in Manager")
        }
        product.id = this.uid
        this.products.push(product)
        this.uid++
    }
    updateProduct = async (id, ...values) =>{
        const products = await this.getProducts() 
        this.products = products.map(product =>{
             if(product.id === id){
                Object.entries(...values).forEach( ([key,value]) =>{
                    product[key] = value
                })
            }
            return product
            })
        this.saveToFile()
        return this.products
    }
    deleteProduct = async (id) => {
        await this.getProducts() 
        this.products = this.products.filter(prod => prod.id !== id)
        this.saveToFile()
        return this.products
    }
    saveToFile = async () => {
        fs.promises.writeFile(this.path, JSON.stringify(this.products,null,"\t"))
            .then(res => console.log(`File saved in ${this.path}`))
            .catch(rej => console.log(`Failed to save file in ${this.path}`))
    }
}

//Products
// const mateRepeated = new Product("Mate que no se podria agregar",0,100,10,"Un mate normal", "photoUrl")
// const termo = new Product("Termo",1,200,10,"Un termo normal", "photoUrl")
// const termoStanley = new Product("Termo stanley",2,500,5,"Un termo genial", "photoUrl")

//Product Manager
const productManager = new ProductManager("/home/matias/Documents/misRepos/backend_32115/2023/desafio_3/products.js")
// //Validate that productList can be mutated if a list of Product items is provided
const mate = new Product("Mate",10,100,10,"Un mate normal", "photoUrl")
const yerba = new Product("Yerba",0,60,1000,"Yerba", "photoUrl")
const vela = new Product("Vela",1,10,100,"Una vela para el corte de luz", "photoUrl")
const televisor = new Product("Televisor",2,10,120000,"Televisor 4K", "photoUrl")


let prods = [mate,yerba,vela,televisor]
let a = productManager.uid
console.log(a++)
for(let prod of prods){
    await productManager.addProduct(prod).then(r => console.log(productManager.products))
}

export {
    MissingPropertyError,
    ProductAlreadyExistsError,
    ProductNotFoundError,
    InvalidInteger,
    Product,
    ProductManager
}