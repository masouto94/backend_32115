import {Router} from 'express'
import {  CartManager } from '../model/CartManager.js' 
import { ProductManager } from '../model/ProductManager.js'

const cartManager = new CartManager("./src/database/carts.json")
const productManager = new ProductManager("./src/database/products.json")
const cartRouter = Router()

cartRouter.get('/',  async (req, res) =>{
    const carts = await cartManager.getCarts()
     return res.status(200).send(carts)
})

cartRouter.get('/:cid',  async (req, res) =>{
     const carts = await cartManager.getCartById(parseInt(req.params.cid))
      return res.status(200).send({products:carts.products})
 })

 cartRouter.post('/:cid/product/:pid',  async (req, res) =>{
     try{
          const toAdd = await productManager.getProductById(parseInt(req.body.pid))
          const cartToUpdate = await cartManager.getCartById(parseInt(req.body.cid))
          await cartManager.addProductToExistingCart(parseInt(req.body.cid), toAdd)
          return res.status(200).send({
               message:`Added product with ID: ${req.body.pid} to cart ${req.body.cid}`
          })
     }catch(e){
          return res.status(400).send({message:`Failed to update cart ${req.body.cid}`, error: e.name})
     }
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
export {
     cartRouter,
     cartManager
} 