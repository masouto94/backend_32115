const fs = require('fs')
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
    #uid
    constructor(path) {
        this.path = path
        this.#uid = this.#validateUid(0)

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
       return await fs.promises.readFile(this.path, "utf-8")
            .then(elem => JSON.parse(elem))
            .then(res => res.map(item => {
                let { id, ...rest } = item
                let product = new Product(...Object.values(rest))
                product.id = id
                return product
                }
            )
        )
    }

    getProductById = async (id) => {
        const found = await this.getProducts().then((res)=>res.find(item => item.id == id))
        
        if (!found) {
            throw new ProductNotFoundError(`Product with id: ${id} not found in Manager`)
        }
        return found
    }
    getProductByCode = async (prods,code) => {
        return prods.find(item => item.code == code)
    }
    addProduct = async (product) => {
        //If not product, return
        if (!(product instanceof Product)) {
            throw new TypeError("Can only add Product-like objects")
        }
        const products = await this.getProducts() 
        //If no products in file override
        if(products.length === 0){            
            product.id = this.uid
            this.products.push(product)
            await this.saveToFile()
            this.uid++
            return
        }
        //IF code is repeated return
        if (await this.getProductByCode(products, product.code)) {
            throw new ProductAlreadyExistsError("Can not add a product whose code is already in Manager")
        }
        this.products = products
        this.uid = Math.max(...Object.values(this.products.map(prod => prod.id))) + 1
        product.id = this.uid
        this.products.push(product)
        await this.saveToFile()
        this.uid++
        return
    }

    updateProduct = async (id, ...values) =>{
        const products = await this.getProducts() 
        this.products = await products.map((product) =>{
             if(product.id === id){
                Object.entries(...values).forEach( ([key,value]) =>{
                    product[key] = value
                })
            }
            return product
            })
        await this.saveToFile()
        return this.products
    }
    deleteProduct = async (id) => {
        const products = await this.getProducts() 
        this.products = products.filter(prod => prod.id !== id)
        this.saveToFile()
        return this.products
    }
    saveToFile = async () => {
        await fs.promises.writeFile(this.path, JSON.stringify(this.products,null,"\t"))
            .then(res => console.log(`File saved in ${this.path}`))
            .catch(rej => console.log(`Failed to save file in ${this.path}`))
    }
}

//Products
const mate = new Product("Mate",10,100,10,"Un mate normal", "photoUrl")
const yerba = new Product("Yerba",0,60,1000,"Yerba", "photoUrl")
const vela = new Product("Vela",1,10,100,"Una vela para el corte de luz", "photoUrl")
const televisor = new Product("Televisor",2,10,120000,"Televisor 4K", "photoUrl")
const prods = [mate,yerba,vela,televisor]

//Product Manager
const productManager = new ProductManager("/home/matias/Documents/misRepos/backend_32115/2023/desafio_2/products.js")
productManager.getProducts().then(r=>console.log(r))
.then(async ()=> {
    for await (let prod of prods){
        await productManager.addProduct(prod)
    }
})
.then(async () => productManager.getProducts())
.then(r=>console.log(r))

.then(async()=>{
    await productManager.updateProduct(3,{description: "La tele para ver al campeon"})
})
.then(r=>console.log(r))
.then(async()=> await productManager.deleteProduct(1))
.then(r=>{    
    console.log(r)
    console.log("Se acabó la yerba")
})