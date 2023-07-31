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


class Product {
    constructor(title, code, price, stock, description, thumbnail, id=undefined) {
        this.title = title
        this.code = code
        this.price = price
        this.stock = stock
        this.description = description
        this.thumbnail = thumbnail
        if (this.#validateAttributes()) {
            throw new MissingPropertyError("None of Product properties can be null or undefined")
        }
        this.id = id ? id : Product.generateId()
    }
    #validateAttributes() {
        return Object.values(this).includes(undefined) || Object.values(this).includes(null) || Object.values(this).includes(false)
    }
    static generateId(){
        if(!this._id){
            this._id = 1
        }
        const id = this._id
        this._id++
        return id
        
    }
}


class ProductManager {
    #products = []
    constructor(path) {
        this.path = path
    }
    get products() {
        return this.#products
    }

    set products(value) {
        let newProducts = []
        for (let product of this.#validateProductList(value)) {
            newProducts.push(product)
        }
        this.#products = newProducts
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
        const prods =  await fs.promises.readFile(this.path, "utf-8")
            .then(elem => JSON.parse(elem))
            .then(res => res.map(item => {
                let product = new Product(...Object.values(item))
                return product
                })
            )
        return prods
            
    }

    getProductById = async (id) => {
        const found = await this.getProducts().then((res) => res.find(item => item.id == id))

        if (!found) {
            throw new ProductNotFoundError(`Product with id: ${id} not found in Manager`)
        }
        return found
    }
    getProductByCode = async (prods, code) => {
        return prods.find(item => item.code == code)
    }
    addProduct = async (product) => {
        //If not product, return
        if (!(product instanceof Product)) {
            throw new TypeError("Can only add Product-like objects")
        }
        const products = await this.getProducts()
        //If no products in file override
        if (products.length === 0) {
            this.products.push(product)
            await this.saveToFile()
            return
        }
        //IF code is repeated return
        if (await this.getProductByCode(products, product.code)) {
            throw new ProductAlreadyExistsError("Can not add a product whose code is already in Manager")
        }
        this.products = products
        this.products.push(product)
        await this.saveToFile()
        return
    }

    updateProduct = async (id, ...values) => {
        const products = await this.getProducts()
        this.products = await products.map((product) => {
            if (product.id === id) {
                Object.entries(...values).forEach(([key, value]) => {
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
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"))
            .then(res => console.log(`File saved in ${this.path}`))
            .catch(rej => console.log(`Failed to save file in ${this.path}`))
    }
}

// //Products
// const mate = new Product("Mate", 0, 100, 10, "Un mate normal", "photoUrl")
// const yerba = new Product("Yerba", 1, 60, 1000, "Yerba", "photoUrl")
// const vela = new Product("Vela", 2, 10, 100, "Una vela para el corte de luz", "photoUrl")
// const televisor = new Product("Televisor", 3, 10, 120000, "Televisor 4K", "photoUrl")
// const bombilla = new Product("Bombilla", 4, 100, 10, "Bombilla", "photoUrl")
// const escritorio = new Product("Escritorio", 5, 60, 1000, "Escritorio", "photoUrl")
// const computadora = new Product("Computadora", 6, 10, 100, "Intel i5", "photoUrl")
// const mouse = new Product("Mouse", 7, 10, 120000, "Mouse", "photoUrl")
// const auriculares = new Product("Auriculares", 8, 10, 120000, "Auriculares", "photoUrl")
// const cargador = new Product("Cargador", 9, 10, 120000, "Cargador 5V ", "photoUrl") 

// const prods = [mate, yerba, vela, televisor, bombilla, escritorio, computadora, mouse, auriculares, cargador]


// //Product Manager
// const productManager = new ProductManager("/home/matias/Documents/misRepos/backend_32115/2023/desafio_3/database/products.js");

// (async () => {
//     try {
//         await productManager.getProducts().then(r => console.log(r))

//         for await (let prod of prods) {
//             await productManager.addProduct(prod)
//         }

//         await productManager.getProducts().then(r => console.log(r))
//         await productManager.updateProduct(4, { description: "La tele para ver al campeon" }).then(r => console.log(r))
//     }
//     catch (e) {
//         console.log(e)
//     }

// })();


export {
    MissingPropertyError,
    ProductAlreadyExistsError,
    ProductNotFoundError,
    Product,
    ProductManager
}