import express from 'express'
import { ProductManager, Product } from './ProductManagerFilesServer.js' 

const productManager = new ProductManager("./products.js")
productManager.getProducts().then(r=>console.log(r))
const app = express()
app.use(express.urlencoded({extended:true}))

app.get('/bienvenida',(req, res) =>{
    res.send("<h1 style=color:blue>BIENVENIDO</h1>")
})
app.get('/usuario',(req, res) =>{
    res.send({name:"x"})
})

app.listen(8080,()=>{
    console.log("connected")
})