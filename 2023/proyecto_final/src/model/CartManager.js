import fs from 'fs'
import { Cart } from './Cart.js'
import { Product } from './Product.js'

class CartNotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
    }
}
class CartManager {
    #carts = []
    #currentProducts = []
    constructor(path) {
        this.path = path
    }
    get carts() {
        return this.#carts
    }
    set carts(value) {
        this.#carts = value
    }

    get currentProducts() {
        return this.#currentProducts
    }
    set currentProducts(value) {
        this.#currentProducts = value
    }

    getCarts = async () => {
        const carts = await fs.promises.readFile(this.path)
            .then(r => JSON.parse(r))
            .then(res => res.map(item => {
                const cart = new Cart(...Object.values(item))
                return cart
            })
            )
        if (carts.length !== 0) {
            Cart.setBaseId(Math.max(...carts.map(cart => cart.id)) + 1)
        }
        this.carts = carts
        return this.carts
    }

    getCartById = async (id) => {

        const found = await this.getCarts().then((res) => res.find(item => item.id === id))
        if (!found) {
            throw new CartNotFoundError(`Cart with ID ${id} does not exist`)
        }
        return found
    }

    getMaxId = async () => {
        const ids = await this.getCarts().then(r => r.map(cart => cart.id))
        return Math.max(...ids)
    }

    addProduct = (product) => {
        const toAdd = product
        if (this.currentProducts.length === 0) {
            toAdd.quantity = 1
            this.currentProducts.push(toAdd)
            return
        }
        const codes = this.currentProducts.map(prod => prod.code)
        if (codes.includes(product.code)) {
            this.currentProducts.map(prod => {
                if (prod.code === product.code) {
                    prod.quantity++
                    return prod
                }
            })
        } else {
            toAdd.quantity = 1
            this.currentProducts.push(toAdd)
        }
    }

    addProductToExistingCart = async (cartId, product) => {
    const cartToModify = await this.getCartById(cartId)
// Poner en la clase Cart un metodo para agregar un prod en si mismo
        try {
            const toAdd = produ
            await this.getCarts()
            for (let cart of this.carts) {
                if (cart.id === cartToModify.id) {
                    console.log(cart)
                    console.log('######')
                    console.log(cartToModify)
                    cart.products.push(toAdd)
                    
                }
            }
        } catch (e) {
        console.log(e)
            // throw new TypeError("Can only add Product-like objects")
    }
    return cartToModify

}

createCart = async () => {
    await this.getCarts()
    const cartToAdd = new Cart(this.currentProducts)
    this.carts.push(cartToAdd)
    this.currentProducts = []
    return cartToAdd
}

saveCarts = async () => {

    await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, "\t"))
}




}

const mate = new Product("Mate", 0, 100, 10, "Un mate normal", "photoUrl")
const yerba = new Product("Yerba", 1, 60, 1000, "Yerba", "photoUrl")
const mouse = new Product("Mouse", 7, 10, 120000, "Mouse", "photoUrl")
const auriculares = new Product("Auriculares", 8, 10, 120000, "Auriculares", "photoUrl")
const cargador = new Product("Cargador", 9, 10, 120000, "Cargador 5V ", "photoUrl")
const cartManager = new CartManager("src/database/carts.json")

// // cart 1
// cartManager.addProduct(mate)
// cartManager.addProduct(yerba)
// cartManager.addProduct(mate)
// cartManager.createCart()
// // cart 2
// cartManager.addProduct(mouse)
// cartManager.addProduct(auriculares)
// cartManager.addProduct(cargador)
// cartManager.createCart()
// await cartManager.saveCarts()
// await cartManager.getCarts()
// //cart 3
// cartManager.addProduct(cargador)
// cartManager.addProduct(cargador)
// cartManager.addProduct(cargador)
// cartManager.createCart()
// await cartManager.saveCarts()

export {
    CartManager,
    CartNotFoundError
}