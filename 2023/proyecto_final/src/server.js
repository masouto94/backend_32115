import express from 'express'
import path from 'path';
import morgan from 'morgan'
import {fileURLToPath} from 'url';
import productsRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))
app.use('/products', productsRouter)
app.use('/cart', cartRouter)


app.get('/',(req, res) =>{
    res.status(200).sendFile("public/index.html",{root: __dirname })
})

app.get('/productActions',(req, res) =>{
    res.status(200).sendFile("public/views/productActions.html",{root: __dirname })
})

app.get('/cartActions',(req, res) =>{
    res.status(200).sendFile("public/views/cartActions.html",{root: __dirname })
})


app.listen(PORT,()=>{
    console.log(`Connected to port ${PORT}`)
})