import fs from 'fs'
import { Cart } from './Cart.js'
import { Product } from './Product.js'

class CartManager {
    #carts = []
    #currentProducts = []
    constructor(path) {
        this.path = path
    }
    get carts() {
        return this.#carts
    }
    set carts(value){
        this.#carts = value
    }

    get currentProducts() {
        return this.#currentProducts
    }
    set currentProducts(value){
        this.#currentProducts = value
    }

    getCarts = async () =>{
        this.carts = await fs.promises.readFile(this.path)
            .then(r => JSON.parse(r))
            .then(res => res.map(item => {
                const cart = new Cart(...Object.values(item))
                return cart
                })
            )
        return this.carts
    }
    addProduct = (product) => {
        const toAdd = product
        if(this.currentProducts.length === 0){
            toAdd.quantity = 1
            this.currentProducts.push(toAdd)
            return
        }
        const codes = this.currentProducts.map(prod => prod.code)
        if(codes.includes(product.id)){
            this.currentProducts.map(prod => {
                if (prod.code === product.code){
                    prod.quantity++
                    return prod
                }
            })
        }else{
            toAdd.quantity = 1
            this.currentProducts.push(toAdd)   
        }

    }
    createCart = () =>{
        const cartToAdd = new Cart(this.currentProducts)
        this.carts.push(cartToAdd)
        this.currentProducts = []
    }

    saveCarts = async () =>{
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, "\t"))
    }




}

const mate = new Product("Mate", 0, 100, 10, "Un mate normal", "photoUrl")
const yerba = new Product("Yerba", 1, 60, 1000, "Yerba", "photoUrl")

const cartManager = new CartManager("C:/Users/masou/Dev/backend_32115/2023/proyecto_final/src/database/carts.json")

// cartManager.addProduct(mate)
// cartManager.addProduct(yerba)
// cartManager.addProduct(mate)
// cartManager.createCart()
// await cartManager.saveCarts()
// console.log(
//     cartManager.carts[0],"\n\n",
//     cartManager.carts[0].products[0],'Cantidad => ', cartManager.carts[0].products[0].quantity,"\n",
//     cartManager.carts[0].products[1], 'Cantidad => ', cartManager.carts[0].products[1].quantity
//     )

export {
    CartManager
}