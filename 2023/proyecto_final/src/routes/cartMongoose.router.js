import {Router} from 'express'
import {  cartModel } from '../model/Cart.js'

const cartRouterMongoose = Router()

cartRouterMongoose.get('/',  async (req, res) =>{
    const carts = await cartModel.getCarts()
     return res.status(200).send(carts)
})

cartRouterMongoose.get('/:cid',  async (req, res) =>{
     const carts = await cartModel.getCartById(parseInt(req.params.cid))
      return res.status(200).send({products:carts.products})
 })

 cartRouterMongoose.post('/:cid/product/:pid',  async (req, res) =>{
     try{
          const toAdd = await productModel.getProductById(parseInt(req.body.pid))
          const cartToUpdate = await cartModel.getCartById(parseInt(req.body.cid))
          await cartModel.addProductToExistingCart(parseInt(req.body.cid), toAdd)
          return res.status(200).send({
               message:`Added product with ID: ${req.body.pid} to cart ${req.body.cid}`
          })
     }catch(e){
          return res.status(400).send({message:`Failed to update cart ${req.body.cid}`, error: e.name})
     }
 })

cartRouterMongoose.post('/create',  async (req, res) =>{
     const {selectedProducts} = req.body
     for(let prod of selectedProducts){
          cartModel.addProduct(await productModel.getProductById(parseInt(prod)))
     }
     const newCart = await cartModel.createCart()
     await cartModel.saveCarts()
     return res.status(200).send({message:'Successfully created cart',cart:newCart})
})
export {
     cartRouterMongoose,
     cartModel
} 