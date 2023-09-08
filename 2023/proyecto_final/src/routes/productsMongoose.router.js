import {Router} from 'express'
import {  productModel, MissingPropertyError } from '../model/Product.js'


const productsRouterMongoose = Router()

productsRouterMongoose.get('/', async (req, res) =>{
    try{
        if(req.query.limit){
            const prods = await productModel.find().limit(req.query.limit)
            return res.status(200).send(prods)
            
        }
        const prods = await productModel.find()
        return res.status(200).send(prods)
    } catch (error){
        return res.status(400).send({error: error})
    }
})
    
productsRouterMongoose.get('/:id', async (req, res) =>{
    const {id} = req.params
    try {
        const prods = await productModel.findById(id)
        if (prods.length === 0){
            return res.status(404).send({error: "Product not found", description: `Product with ID: ${req.params.id} does not exist`})
        }
        return res.status(200).send(prods)
        
    } catch (error) {
        return res.status(400).send({error: error})
    }
})

productsRouterMongoose.post('/', async (req, res) =>{
    const {productId} = req.body
    try {
        const prods = await productModel.findById(productId)
        if (prods.length === 0){
            return res.status(404).send({error: "Product not found", description: `Product with ID: ${productId} does not exist`})
        }
        return res.status(200).send(prods)
        
    } catch (error) {
        return res.status(400).send({error: error})
    }
})

productsRouterMongoose.post('/create', async (req, res) =>{
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
        return res.status(400).send({error: error.name, message: error.message, description:`Failed to add product ${title} with code ${code}`})
    }
})

productsRouterMongoose.put('/:id', async (req, res) =>{
    const { id } = req.params
    try {
        const prod = await productModel.findByIdAndUpdate(id,req.body)
        if (prod)
            return res.status(200).send({ result:"Success", description: `Updated product ${id} with ${JSON.stringify(req.body)}` })
        else
            return res.status(404).send({error: "Product not found", description: `Failed to update product with ID: ${id}. Product does not exist`})
    } catch (error) {
        return res.status(400).send({error: error.name, message: error.message, description:`Failed to update product with ID: ${id}`})
    }
})

productsRouterMongoose.delete('/:id', async (req, res) =>{
    const { id } = req.params
    try {
        const prod = await productModel.findByIdAndDelete(id)
        if (prod)
            return res.status(200).send({ result:"Success", description: `Deleted product with ID: ${id} ` })
        else
            return res.status(404).send({error: "Product not found", description: `Failed to delete product with ID: ${id}. Product does not exist`})
    } catch (error) {
        return res.status(400).send({error: error.name, message: error.message, description:`Failed to delete product with ID: ${id}`})
    }
})

productsRouterMongoose.get('/currentProducts', async (req, res) =>{
    try{
        if(req.query.limit){
            const prods = await productModel.find().limit(req.query.limit)
            return res.status(200).send(prods)
            
        }
        const prods = await productModel.find()
        return res.status(200).send(prods)
    } catch (error){
        return res.status(400).send({error: error})
    }
})
export {
    productModel,
    productsRouterMongoose
    }