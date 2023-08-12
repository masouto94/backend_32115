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
        const carts = await fs.promises.readFile(this.path)
            .then(r => JSON.parse(r))
            .then(res => res.map(item => {
                const cart = new Cart(...Object.values(item))
                return cart
                })
            )
        Cart.setBaseId(Math.max(...carts.map(cart => cart.id)) + 1)
        this.carts = carts
        return this.carts
    }

    getMaxId = async () => {        
        const ids= await this.getCarts().then(r => r.map(cart => cart.id))
        return Math.max(...ids) 
    }

    addProduct = (product) => {
        const toAdd = product
        if(this.currentProducts.length === 0){
            toAdd.quantity = 1
            this.currentProducts.push(toAdd)
            return
        }
        const codes = this.currentProducts.map(prod => prod.code)
        if(codes.includes(product.code)){
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
        this.getMaxId()
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
const mouse = new Product("Mouse", 7, 10, 120000, "Mouse", "photoUrl")
const auriculares = new Product("Auriculares", 8, 10, 120000, "Auriculares", "photoUrl")
const cargador = new Product("Cargador", 9, 10, 120000, "Cargador 5V ", "photoUrl")
const cartManager = new CartManager("C:/Users/masou/Dev/backend_32115/2023/proyecto_final/src/database/carts.json")

// cart 1
cartManager.addProduct(mate)
cartManager.addProduct(yerba)
cartManager.addProduct(mate)
cartManager.createCart()
// cart 2
cartManager.addProduct(mouse)
cartManager.addProduct(auriculares)
cartManager.addProduct(cargador)
cartManager.createCart()
await cartManager.saveCarts()
await cartManager.getCarts()
//cart 3
cartManager.addProduct(cargador)
cartManager.addProduct(cargador)
cartManager.addProduct(cargador)
cartManager.createCart()
await cartManager.saveCarts()

export {
    CartManager
}