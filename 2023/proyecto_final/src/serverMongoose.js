import express from 'express'
import path from 'path';
import morgan from 'morgan'
import handlebars from 'express-handlebars'
import {fileURLToPath} from 'url';
import {productModel,productsRouterMongoose} from './routes/productsMongoose.router.js'
import {cartModel,cartRouterMongoose} from './routes/cartMongoose.router.js'
import {socketServer, handlers, reemiters} from './utils/websocket.js'
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080

const app = express()

mongoose.connect("mongodb+srv://masouto94:<password>@cluster0.gld3sot.mongodb.net/?retryWrites=true&w=majority")
.then(() => console.log('Connected to DB'))
.catch((e) => console.log(e))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))
app.use('/products', productsRouterMongoose)
app.use('/carts', cartRouterMongoose)


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

app.get('/currentProducts',(req, res) =>{
    res.status(200).render("currentProducts",
    {
        layout: 'main',
        title: 'Current products',
        socketHandler: "websocket"
    })
})

app.get('/cartActions', async (req, res) =>{
    const prods = await productModel.find().lean()
    const carts = await cartModel.find().lean()
    res.status(200).render("cartActions",
    {
        layout: 'main',
        title: 'Cart actions',
        products: prods,
        addProductHandler: 'addProduct',
        carts: carts
    })
})


const httpServer = app.listen(PORT,()=>{
    console.log(`Connected to port ${PORT}`)
})

socketServer(httpServer, handlers, reemiters)