import {Router} from 'express'
import {  cartModel } from '../model/Cart.js'
import {  productModel } from '../model/Product.js'
import mongoose from 'mongoose'

const cartRouter = Router()

cartRouter.get('/',  async (req, res) =>{
    const carts = await cartModel.find()
     return res.status(200).send(carts)
})

cartRouter.get('/:cid',  async (req, res) =>{
     try {
          const cart = await cartModel.findById(req.params.cid)
          if(cart){
               return res.status(200).send({products:cart.products})
          }
          return res.status(404).send({error: `Cart with ID: ${req.params.cid} not found`})
          
     } catch (error) {
          return res.status(400).send({error: error.name, message: error.message, description:`Failed to fetch cart with ID: ${req.params.cid}`})
     }
 })

cartRouter.put('/:cid/product/:pid',  async (req, res) =>{
const { cid, pid } = req.params
const {quantity} = req.body

try {
     const cart = await cartModel.findById(cid)
     if (cart) {
          const prod = await productModel.findById(pid) 

          if (prod) {
               const index = cart.products.findIndex(item => item.prod_id._id == pid) 
               if (index != -1) {
                    quantity ? cart.products[index].quantity = quantity : cart.products[index].quantity++
               } else {
                    
                    cart.products.push({ prod_id: pid, quantity: quantity?? 1 })
               }
               await cartModel.findByIdAndUpdate(cid, cart) 
               res.status(200).send({ result: 'Success', message: `Added product with ID: ${pid} to cart ${cid}` })
          } else {
               res.status(404).send({ result: 'Failure', mensaje: `Product with id ${pid} not found`})
          }
     } else {
          res.status(404).send({error: error.name, message: error.message, description:`Failed to add product with ID: ${pid} to cart ${cid}. Product does not exist`})
     }

     } catch (error) {
     res.status(400).send({error: error.name, message: error.message, description:`Failed to add product with ID: ${pid} to cart ${cid}`})
     }
})

cartRouter.delete('/:cid/product/:pid',  async (req, res) =>{
     const { cid, pid } = req.params
     
     try {
          const cart = await cartModel.findById(cid)
          if (cart) {
               const prod = await productModel.findById(pid) 
     
               if (prod) {
                    const index = cart.products.findIndex(item => item.prod_id._id == pid) 
                    if (index != -1) {
                         if(cart.products[index].quantity > 1){
                              cart.products[index].quantity-- 
                         }
                         else{
                              cart.products = cart.products.filter(item => item.prod_id._id != pid)
                         }
                    } else {
                         res.status(404).send({ result: 'Failure', mensaje: `Product with id ${pid} not found in cart ${cid}`})
                    }
                    await cartModel.findByIdAndUpdate(cid, cart) 
                    res.status(200).send({ result: 'Success', message: `Deleted product with ID: ${pid} from cart ${cid}` })
               } 
          } else {
               res.status(404).send({error: error.name, message: error.message, description:`Cart with ID: ${cid} does not exist`})
          }
     
          } catch (error) {
          res.status(400).send({error: error.name, message: error.message, description:`Failed to delete product with ID: ${pid} from cart ${cid}`})
          }
     })

cartRouter.delete('/:cid',  async (req, res) =>{
     const { cid } = req.params
     try {
          const cart = await cartModel.findById(cid)
          if (cart) {
               cart.products = []
               await cartModel.findByIdAndUpdate(cid, cart) 
               res.status(200).send({ result: 'Success', message: `Deleted all products from cart ${cid}` })
          } else {
               res.status(404).send({error: error.name, message: error.message, description:`Cart with ID: ${cid} does not exist`})
          }
          } catch (error) {
          res.status(400).send({error: error.name, message: error.message, description:`Failed to delete products from cart ${cid}`})
          }
     })

cartRouter.post('/create',  async (req, res) =>{
     const {selectedProducts} = req.body
     // const productSet = new Set(selectedProducts)
     // const productAggregation = {}
     // productSet.forEach(prod=>{
     //      let quantity = selectedProducts.reduce((total, product) => (product == prod ? total+1 : total), 0)
     //      productAggregation[prod]=quantity    
     //      return
     // })
     const toAdd = selectedProducts.map((prod)=>{ return {prod_id:prod.id, quantity:prod.quantity}})
     // for (const [prod, quantity] of Object.entries(productAggregation)){
     //      toAdd.push({prod_id:prod,quantity:quantity})
     // }

     const cart = await cartModel.create({
          products:toAdd
     })

     return res.status(200).send({message:'Successfully created cart',cart:cart})
})
export {
     cartRouter,
     cartModel
} 