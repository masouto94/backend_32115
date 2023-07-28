import express from 'express'
import path from 'path';
import {fileURLToPath} from 'url';
import { ProductManager, Product } from './model/ProductManager.js' 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const productManager = new ProductManager("./database/products.js")
const app = express()
app.use(express.urlencoded({extended:true}))

app.get('/',(req, res) =>{
    res.status(200).sendFile("views/availableRoutes.html",{root: __dirname })
})

app.get('/products', async (req, res) =>{
    if(req.query.limit){
        const prods = await productManager.getProducts().then(r => r.slice(0,req.query.limit))
        return res.status(200).send(prods)
        
    }
    const prods = await productManager.getProducts()
    return res.status(200).send(prods)
})

app.get('/products/:id', async (req, res) =>{
    const prods = await productManager.getProducts().then(r => r.filter(prod => prod.id === parseInt(req.params.id)))
    if(prods.length === 0){
        return res.status(404).send({error: "Product not found", description: `ID:${req.params.id} does not exist`})
    }
    return res.status(200).send(prods)
})

app.post('/products', async (req, res) =>{
    const prods = await productManager.getProducts().then(r => r.filter(prod => prod.id === parseInt(req.body.productId)))
    if(prods.length === 0){
        return res.status(404).send({error: "Product not found", description: `ID:${req.body.productId} does not exist`})
    }
    return res.status(200).send(prods)
})

app.listen(8080,()=>{
    console.log("Connected to port 8080")
})