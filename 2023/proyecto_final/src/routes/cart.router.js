import {Router} from 'express'
import {  CartManager } from '../model/CartManager.js' 
import { ProductManager } from '../model/ProductManager.js'

const cartManager = new CartManager("./src/database/carts.json")
const productManager = new ProductManager("./src/database/products.json")

const cartRouter = Router()

cartRouter.get('/',  async (req, res) =>{
    const carts = await cartManager.getCarts()
     return await res.status(200).send(carts)
})

cartRouter.post('/create',  async (req, res) =>{
     const {selectedProducts} = req.body
     for(let prod of selectedProducts){
          cartManager.addProduct(await productManager.getProductById(parseInt(prod)))
     }
     const newCart = await cartManager.createCart()
     await cartManager.saveCarts()
     return res.status(200).send({message:'Successfully created cart',cart:newCart})
})
export default cartRouter