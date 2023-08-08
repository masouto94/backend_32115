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
        if(this.currentProducts.length === 0){
            this.currentProducts.push({
                ...product,
                quantity: 1
            })
        }
        this.currentProducts.map(prod => {
            if (prod.code !== product.code){
                return {
                    ...product,
                    quantity: 1
                }
            }else{
                return {
                    ...prod,
                    quantity: prod.quantity++
                }
            }
        })

    }
    createCart = (products) =>{
        for(let product of products){

        }
        const cartToAdd = new Cart(this.currentProducts)
        this.carts.push(cartToAdd)
    }

    saveCarts = async () =>{
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, "\t"))
    }




}

const mate = new Product("Mate", 0, 100, 10, "Un mate normal", "photoUrl")
const yerba = new Product("Yerba", 1, 60, 1000, "Yerba", "photoUrl")

const cartManager = new CartManager("/home/matias/Documents/misRepos/backend_32115/2023/proyecto_final/src/database/carts.json")

// console.log(await cartManager.getCarts())
// cartManager.createCart([mate,yerba])
// await cartManager.saveCarts()
cartManager.addProduct(mate)
cartManager.addProduct(mate)
console.log(cartManager.currentProducts)
export {
    CartManager
}