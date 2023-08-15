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
        const cartToModify = await this.getCarts()
        this.carts = this.carts.map((cart) => {
            if (cart.id === cartId) {
                cart.addProduct(product)
            }
            return cart
        })
        console.log(this.carts)
        await this.saveCarts()
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

export {
    CartManager,
    CartNotFoundError
}