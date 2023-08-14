import {Router} from 'express'
import {  CartManager } from '../model/CartManager.js' 

const cartManager = new CartManager("./src/database/carts.json")

const cartRouter = Router()

cartRouter.get('/',  async (req, res) =>{
    const carts = await cartManager.getCarts()
     return await res.status(200).send(carts)
})

cartRouter.post('/create',  async (req, res) =>{
     return await res.status(200).send(carts)
})
export default cartRouter