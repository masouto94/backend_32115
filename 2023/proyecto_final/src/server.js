import express from 'express'
import path from 'path';
import morgan from 'morgan'
import handlebars from 'express-handlebars'
import {fileURLToPath} from 'url';
import {productsRouter, productManager} from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080

const app = express()
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))
app.use('/products', productsRouter)
app.use('/carts', cartRouter)


app.get('/',(req, res) =>{
    res.status(200).render("index.handlebars")
})

app.get('/productActions',(req, res) =>{
    res.status(200).render("productActions",
    {
        layout: 'main',
        title: 'Product actions'
    })
})

app.get('/cartActions', async (req, res) =>{
    const prods = await productManager.getProducts()
    res.status(200).render("cartActions",
    {
        layout: 'main',
        title: 'Cart actions',
        products: prods
    })
})


app.listen(PORT,()=>{
    console.log(`Connected to port ${PORT}`)
})