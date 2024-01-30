import {Router} from 'express'
import {  cartModel } from '../model/Cart.js'
import { ticketModel } from '../model/Ticket.js'
import {  productModel } from '../model/Product.js'
import { isUser, loggedIn } from '../utils/middlewares.js'
import { logger } from '../config/logger/logger.js'

const cartRouter = Router()
cartRouter.use(loggedIn)
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

cartRouter.put('/:cid/product/:pid',   async (req, res) =>{
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

cartRouter.post('/create', isUser, async (req, res) =>{
     const cart = await cartModel.findById(req.session.user_cart)
     const {selectedProducts} = req.body
     const toAdd = selectedProducts.map((prod)=>{ return {prod_id:prod.id, quantity:prod.quantity}})
     toAdd.forEach(prodToAdd => {
          const index = cart.products.findIndex(item => item.prod_id._id == prodToAdd.prod_id) 
          if (index != -1) {
               cart.products[index].quantity = cart.products[index].quantity + prodToAdd.quantity
          } else {
               
               cart.products.push({ prod_id: prodToAdd.prod_id, quantity: prodToAdd.quantity })
          }
          
     })
     await cartModel.findByIdAndUpdate(req.session.user_cart, cart)
     return res.send({carts : await cartModel.findById(req.session.user_cart)})

})

cartRouter.post('/purchase',  isUser, async (req, res) =>{
     const cart = await cartModel.findById(req.session.user_cart)
     const price = cart.products.reduce((accumulator, product) => {
          return accumulator + (product.prod_id.price * product.quantity) 
          }, 0)
     const now = Date.now()

     await ticketModel.create({
          purchase_datetime:now, 
          amount:price, 
          buyer: req.session.user.email,
          products:cart.products.map(prod =>{
               return {prod_id:prod.prod_id,
               quantity: prod.quantity}
          })
     }).then(async r =>{
          await cart.emptyCart()
     }).catch(error => {
          logger.error(error.message)
     })
     return res.send({
          tickets : await ticketModel.find({"buyer": req.session.user.email})
     })

})

export {
     cartRouter,
     cartModel
} 