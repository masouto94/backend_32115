import {Router} from 'express'
import {  productModel } from '../model/Product.js'
import { isAdmin,loggedIn } from '../utils/middlewares.js'
import { logger } from '../config/logger/logger.js'

const productsRouter = Router()
productsRouter.use(loggedIn)
productsRouter.get('/', async (req, res) =>{
    try{
        let limit = 10
        let page = 1
        let query = req.query.query ? JSON.parse(req.query.query) : {}
        let sort = {'_id': 'asc'}

        if(req.query.sort){
            sort = {'price': req.query.sort}
        }
        const prods = await productModel.paginate( query,{
            page: req.query.page ?? page, 
            limit:req.query.limit ?? limit,
            sort:sort
        })
        return res.status(200).send(prods)
        
    } catch (error){
        logger.error(error.message)
        return res.status(400).send({error: error.message})
    }
})
    
productsRouter.get('/:id', async (req, res) =>{
    const {id} = req.params
    try {
        const prods = await productModel.findById(id)
        if (prods.length === 0){
            return res.status(404).send({error: "Product not found", description: `Product with ID: ${req.params.id} does not exist`})
        }
        return res.status(200).send(prods)
        
    } catch (error) {
        logger.error(error.message)
        return res.status(400).send({error: error})
    }
})

productsRouter.post('/', async (req, res) =>{
    const {productId} = req.body
    try {
        const prods = await productModel.findById(productId)
        if (prods.length === 0){
            return res.status(404).send({error: "Product not found", description: `Product with ID: ${productId} does not exist`})
        }
        return res.status(200).send(prods)
        
    } catch (error) {
        logger.error(error.message)
        return res.status(400).send({error: error})
    }
})

productsRouter.post('/create', isAdmin, async (req, res) =>{
    const {title,code,price,stock,description,thumbnail} = req.body
    try {
        const toAdd = await productModel.create({
            title,
            code,
            price,
            stock,
            description,
            thumbnail
        })
        return res.status(200).send({result:"Success", description:`Added product ${title} with code ${code}`})
    } catch (error) {
        logger.error(error.message)
        return res.status(400).send({error: error.name, message: error.message, description:`Failed to add product ${title} with code ${code}`})
    }
})

productsRouter.put('/:id', isAdmin, async (req, res) =>{
    const { id } = req.params
    try {
        const prod = await productModel.findByIdAndUpdate(id,req.body)
        if (prod)
            return res.status(200).send({ result:"Success", description: `Updated product ${id} with ${JSON.stringify(req.body)}` })
        else
            return res.status(404).send({error: "Product not found", description: `Failed to update product with ID: ${id}. Product does not exist`})
    } catch (error) {
        logger.error(error.message)
        return res.status(400).send({error: error.name, message: error.message, description:`Failed to update product with ID: ${id}`})
    }
})

productsRouter.delete('/:id', isAdmin, async (req, res) =>{
    const { id } = req.params
    try {
        const prod = await productModel.findByIdAndDelete(id)
        if (prod)
            return res.status(200).send({ result:"Success", description: `Deleted product with ID: ${id} ` })
        else
            return res.status(404).send({error: "Product not found", description: `Failed to delete product with ID: ${id}. Product does not exist`})
    } catch (error) {
        logger.error(error.message)
        return res.status(400).send({error: error.name, message: error.message, description:`Failed to delete product with ID: ${id}`})
    }
})

productsRouter.get('/currentProducts', async (req, res) =>{
    try{
        if(req.query.limit){
            const prods = await productModel.find().limit(req.query.limit)
            return res.status(200).send(prods)
            
        }
        const prods = await productModel.find()
        return res.status(200).send(prods)
    } catch (error){
        logger.error(error.message)
        return res.status(400).send({error: error.message})
    }
})
export {
    productModel,
    productsRouter
    }