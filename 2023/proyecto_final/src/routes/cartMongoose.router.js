import {Router} from 'express'
import {  cartModel } from '../model/Cart.js'
import {  productModel } from '../model/Product.js'
import mongoose from 'mongoose'

const cartRouterMongoose = Router()

cartRouterMongoose.get('/',  async (req, res) =>{
    const carts = await cartModel.find()
     return res.status(200).send(carts)
})

cartRouterMongoose.get('/:cid',  async (req, res) =>{
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

 cartRouterMongoose.post('/:cid/product/:pid',  async (req, res) =>{
     const { cid, pid } = req.params
     const { quantity } = req.body

     try {
          const cart = await cartModel.findById(cid)
          if (cart) {
              const prod = await productModel.findById(pid) 
  
              if (prod) {
                  const index = cart.products.findIndex(item => item._id == pid) 
                  if (index != -1) {
                      cart.products[index].quantity = quantity 
                  } else {
                      cart.products.push({ id_prod: pid, quantity: quantity })
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

cartRouterMongoose.post('/create',  async (req, res) =>{
     const {selectedProducts} = req.body
     const productSet = new Set(selectedProducts)
     const productAggregation = {}
     productSet.forEach(prod=>{
          let quantity = selectedProducts.reduce((total, product) => (product == prod ? total+1 : total), 0)
          productAggregation[prod]=quantity    
          return
     })
     const toAdd = []
     for (const [prod, quantity] of Object.entries(productAggregation)){
          toAdd.push({id_prod:prod,quantity:quantity})
     }
     const cart = await cartModel.create({
          products:toAdd
     })

     return res.status(200).send({message:'Successfully created cart',cart:cart})
})
export {
     cartRouterMongoose,
     cartModel
} 