import {Router} from 'express'
import { Product, ProductManager, ProductAlreadyExistsError } from '../model/ProductManager.js' 

const productManager = new ProductManager("./src/database/products.js")

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
        return res.status(404).send({error: "Product not found", description: `ID:${req.params.id} does not exist`})
    }
    return res.status(200).send(prods)
})

productsRouter.post('/', async (req, res) =>{
    const prods = await productManager.getProducts().then(r => r.filter(prod => prod.id === parseInt(req.body.productId)))
    if(prods.length === 0){
        return res.status(404).send({error: "Product not found", description: `ID:${req.body.productId} does not exist`})
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
        return res.status(200).send({result:"Success", message:`Added product ${toAdd.title} with id ${toAdd.id}`})
    }catch(e) {
        if(e instanceof ProductAlreadyExistsError){
            res.status(409).send({result:"Failure", error: e.name, message:`Failed to add product ${toAdd.title} with code ${toAdd.code}`})
        }
        else{
            res.status(400).send({result:"Failure", error: e.name, message:`Failed to add product`})            
        }
    }
})
export default productsRouter