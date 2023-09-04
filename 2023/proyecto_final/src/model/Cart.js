import { Product, productSchema } from "./Product.js"
import {Schema, model} from 'mongoose'

class Cart {
    constructor(products, price = undefined, id = undefined) {
        this.products = this.retrieveProducts(products)
        this.price = price ? price : this.calculatePrice()
        this.id = id ? id : Cart.generateId()
    }

    get codes() {
        return this.products.map((prod) => prod.code)
    }
    calculatePrice = () => {
        this.price = this.products.reduce((accumulator, product) => { return accumulator + (product.price * product.quantity) }, 0)
        return this.price
    }
    retrieveProducts(products) {
        const productList = []
        for (let product of products) {
            if (!(product instanceof Product)) {
                try {
                    let { title, code, price, stock, description, thumbnail, id } = product
                    let toAdd = new Product(title, code, price, stock, description, thumbnail, id)
                    if (product.quantity) {
                        toAdd.quantity = product.quantity
                    }
                    productList.push(toAdd)
                    continue

                } catch (e) {
                    throw new TypeError("Products attribute must be composed of Product-like objects")
                }
            }
            else {
                productList.push(product)
            }

        }
        return productList
    }

    addProduct = (product) => {
        if (this.codes.includes(product.code)) {
            this.products = this.products.map((prod) => {
                if (prod.code === product.code) {
                    prod.quantity++
                    return prod
                }
                return prod
            })
        } else {
            product.quantity = 1
            this.products.push(product)
        }
        this.calculatePrice()
        return this.products
    }
    static generateId() {
        if (!this._id) {
            this._id = 1
        }
        const id = this._id
        this._id++
        return id

    }

    static setBaseId(id) {
        this._id = id
        return
    }

}

const cartSchema = new Schema({
    products: [productSchema],
    price:{
        type: Number,
        required: true
    }
})

cartSchema.loadClass(Cart)
const cartModel = model('Cart', cartSchema)
export {
    Cart,
    cartModel
}