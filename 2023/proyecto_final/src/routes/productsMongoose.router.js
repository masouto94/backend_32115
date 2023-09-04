import {Router} from 'express'
import {  productModel, ProductAlreadyExistsError, KeyError, ProductNotFoundError } from '../model/productModel.js' 
import {  productModel } from '../model/Product.js'

const productModel = new productModel("./src/database/products.json")

const productsRouterMongoose = Router()

productsRouterMongoose.get('/', async (req, res) =>{
    if(req.query.limit){
        const prods = await productModel.getProducts().then(r => r.slice(0,req.query.limit))
        return res.status(200).send(prods)
        
    }
    const prods = await productModel.getProducts()
    return res.status(200).send(prods)
})
    
productsRouterMongoose.get('/:id', async (req, res) =>{
    const prods = await productModel.getProducts().then(r => r.filter(prod => prod.id === parseInt(req.params.id)))
    if(prods.length === 0){
        return res.status(404).send({error: "Product not found", description: `Product with ID: ${req.params.id} does not exist`})
    }
    return res.status(200).send(prods)
})

productsRouterMongoose.post('/', async (req, res) =>{
    const prods = await productModel.getProducts().then(r => r.filter(prod => prod.id === parseInt(req.body.productId)))
    if(prods.length === 0){
        return res.status(404).send({error: "Product not found", description: `Product with ID: ${req.body.productId} does not exist`})
    }
    return res.status(200).send(prods)
})

productsRouterMongoose.post('/create', async (req, res) =>{
    const maxId = await productModel.getMaxId() 
    Product.setBaseId(maxId + 1)
    const toAdd = new Product(
        req.body.title,
        parseInt(req.body.code),
        parseInt(req.body.price),
        parseInt(req.body.stock),
        req.body.description,
        req.body.thumbnail
        )
    try{
        await productModel.addProduct(toAdd)
        return res.status(200).send({result:"Success", description:`Added product ${toAdd.title} with id ${toAdd.id}`})
    }catch(e) {
        if(e instanceof ProductAlreadyExistsError){
            res.status(409).send({error: e.name, description:`Failed to add product ${toAdd.title} with code ${toAdd.code}`})
        }
        else{
            res.status(400).send({error: e.name, description:`Failed to add product`})            
        }
    }
})

productsRouterMongoose.put('/:id', async (req, res) =>{
    try {
        const prod = await productModel.getProductById(parseInt(req.params.id))
        const newProd = await productModel.updateProduct(prod.id, req.body)
    } catch (error) {
        if(error instanceof KeyError){
            return res.status(400).send({error: error.name, description: error.message})
        }
        else if(error instanceof ProductNotFoundError){
            return res.status(404).send({error: "Product not found", description: `Product with ID: ${req.params.id} does not exist`})
        }
        else{
            return res.status(500).send({error: error.name, description: error.message})               
        }
    }
    return res.status(200).send({description: `Successfully updated product with id: ${req.params.id}` ,prod:newProd})
})

productsRouterMongoose.delete('/:id', async (req, res) =>{
    try {
        const prods = await productModel.deleteProduct(parseInt(req.params.id))
        return res.status(200).send({description: `Successfully deleted product with id: ${req.params.id}`})
        
    } catch (error) {
        return res.status(404).send({error: "Product not found", description: `Product with ID: ${req.params.id} does not exist`})
    }
})

productsRouterMongoose.get('/currentProducts', async (req, res) =>{
    if(req.query.limit){
        const prods = await productModel.getProducts().then(r => r.slice(0,req.query.limit))
        return res.status(200).send(prods)
        
    }
    const prods = await productModel.getProducts()
    return res.status(200).send(prods)
})
export {
    productModel,
    productsRouterMongoose
    }