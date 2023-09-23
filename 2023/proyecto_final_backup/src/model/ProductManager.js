import fs from 'fs'
import { Product } from './Product.js'

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

class KeyError extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
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
        const newProducts = []
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
    getMaxId = async () => {
        const ids = await this.getProducts().then(r => r.map(prod => prod.id))
        return Math.max(...ids)
    }
    getProducts = async () => {
        const prods = await fs.promises.readFile(this.path, "utf-8")
            .then(elem => JSON.parse(elem))
            .then(res => res.map(item => {
                const product = new Product(...Object.values(item))
                return product
            })
            )
        return prods

    }

    getProductById = async (id) => {
        const found = await this.getProducts().then((res) => res.find(item => item.id === id))

        if (!found) {
            throw new ProductNotFoundError(`Product with id: ${id} not found in Manager`)
        }
        return found
    }
    getProductByCode = async (prods, code) => {
        return prods.find(item => item.code === code)
    }
    addProduct = async (product) => {
        if (!(product instanceof Product)) {
            throw new TypeError("Can only add Product-like objects")
        }
        const products = await this.getProducts()
        if (products.length === 0) {
            this.products.push(product)
            await this.saveToFile()
            return
        }
        if (await this.getProductByCode(products, product.code)) {
            throw new ProductAlreadyExistsError("Can not add a product whose code is already in Manager")
        }
        this.products = products
        this.products.push(product)
        await this.saveToFile()
        return
    }

    updateProduct = async (id, ...values) => {
        const keys = Object.keys(...values)
        const products = await this.getProducts()
        const newProducts = await products.map((product) => {
            if (product.id === id) {
                if (keys.some((key) => !Object.keys(product).includes(key))) {
                    const missing = []
                    keys.map((key) => {
                        if (!Object.keys(product).includes(key)) {
                            missing.push(key)
                        }
                    })
                    throw new KeyError(`Product does not include keys: ${missing}`)
                }
                Object.entries(...values).forEach(([key, value]) => {
                    if (key === 'id') {
                        throw new KeyError("Cannot update id property for Product")
                    }
                    else if (['code', 'stock'].includes(key)) {
                        product[key] = parseInt(value)
                    }
                    else if (key === 'price') {
                        product[key] = parseFloat(value)
                    }
                    else {
                        product[key] = value
                    }
                })
            }
            return product
        })
        this.products = newProducts
        await this.saveToFile()
        return this.getProductById(id)
    }
    deleteProduct = async (id) => {
        await this.getProductById(id)
        const products = await this.getProducts()
        this.products = products.filter(prod => prod.id !== id)
        this.saveToFile()
        return
    }
    saveToFile = async () => {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"))
            console.log(`File saved in ${this.path}`)
        } catch (e) {
            console.log(`Failed to save file in ${this.path} => ${e.name}`)
        }
    }
}

export {
    ProductAlreadyExistsError,
    ProductNotFoundError,
    KeyError,
    ProductManager
}