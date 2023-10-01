import 'dotenv/config'
import express from 'express'
import path from 'path';
import morgan from 'morgan'
import handlebars from 'express-handlebars'
import {fileURLToPath} from 'url';
import {productModel,productsRouter} from './routes/products.router.js'
import {cartModel,cartRouter} from './routes/cart.router.js'
import { userModel,userRouter } from './routes/user.router.js'
import { sessionRouter } from './routes/session.router.js'
import { initPassport, passport } from './config/passport.js'

import {socketServer, handlers, reemiters} from './utils/websocket.js'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import session from 'express-session'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080

const app = express()

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Connected to DB'))
.catch((e) => console.log(e))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 60
        }),
        secret: process.env.SESSION_SECRET,
        resave: false, 
        saveUninitialized: false
    }

))
initPassport()
app.use(passport.initialize())
app.use(passport.session())
app.use('/products', productsRouter)
app.use('/carts', cartRouter)
app.use('/users', userRouter)
app.use('/sessions', sessionRouter)


app.get('/',(req, res) =>{
    res.status(200).render("index.handlebars")
})

app.get('/productActions',(req, res) =>{
    res.status(200).render("productActions",
    {
        layout: 'main',
        title: 'Product actions',
        socketHandler: "createProduct"
    })
})

app.get('/currentProducts', async (req, res) =>{
    const prods = await productModel.find().lean()
    res.status(200).render("currentProducts",
    {
        layout: 'main',
        title: 'Current products',
        initialProducts: prods,
        socketHandler: "realtimeProducts"
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
        addProductHandler: 'addProductToCart',
        carts: carts
    })
})


const httpServer = app.listen(PORT,()=>{
    console.log(`Connected to port ${PORT}`)
})

app.get('/login',(req, res) =>{
    res.status(200).render("userLogin",
    {
        layout: 'main',
        title: 'Login'
    })
})

socketServer(httpServer, handlers, reemiters)