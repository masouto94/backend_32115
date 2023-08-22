import {Router} from 'express'
import {  ProductManager, ProductAlreadyExistsError, KeyError, ProductNotFoundError } from '../model/ProductManager.js' 
import {  Product } from '../model/Product.js' 

const productManager = new ProductManager("./src/database/products.json")

const productsRouter = Router()

productsRouter.get('/', async (req, res) =>{
    if(req.query.limit){
        const prods = await productManager.getProducts().then(r => r.slice(0,req.query.limit))
        return res.status(200).send(prods)
        
    }
    const prods = await productManager.getProducts()
    return res.status(200).send(prods)
})
    
productsRouter.get('/:id', async (req, res) =>{
    const prods = await productManager.getProducts().then(r => r.filter(prod => prod.id === parseInt(req.params.id)))
    if(prods.length === 0){
        return res.status(404).send({error: "Product not found", description: `Product with ID: ${req.params.id} does not exist`})
    }
    return res.status(200).send(prods)
})

productsRouter.post('/', async (req, res) =>{
    const prods = await productManager.getProducts().then(r => r.filter(prod => prod.id === parseInt(req.body.productId)))
    if(prods.length === 0){
        return res.status(404).send({error: "Product not found", description: `Product with ID: ${req.body.productId} does not exist`})
    }
    return res.status(200).send(prods)
})

productsRouter.post('/create', async (req, res) =>{
    const maxId = await productManager.getMaxId() 
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
        await productManager.addProduct(toAdd)
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

productsRouter.put('/:id', async (req, res) =>{
    try {
        const prod = await productManager.getProductById(parseInt(req.params.id))
        const newProd = await productManager.updateProduct(prod.id, req.body)
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

productsRouter.delete('/:id', async (req, res) =>{
    try {
        const prods = await productManager.deleteProduct(parseInt(req.params.id))
        return res.status(200).send({description: `Successfully deleted product with id: ${req.params.id}`})
        
    } catch (error) {
        return res.status(404).send({error: "Product not found", description: `Product with ID: ${req.params.id} does not exist`})
    }
})

productsRouter.get('/currentProducts', async (req, res) =>{
    if(req.query.limit){
        const prods = await productManager.getProducts().then(r => r.slice(0,req.query.limit))
        return res.status(200).send(prods)
        
    }
    const prods = await productManager.getProducts()
    return res.status(200).send(prods)
})
export {
    productManager,
    productsRouter
    }