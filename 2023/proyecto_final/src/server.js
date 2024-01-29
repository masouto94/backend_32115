import express from 'express'
import path from 'path';
import handlebars from 'express-handlebars'
import {fileURLToPath} from 'url';
import {productModel,productsRouter} from './routes/products.router.js'
import {cartModel,cartRouter} from './routes/cart.router.js'
import { userModel,userRouter } from './routes/user.router.js'
import { sessionRouter } from './routes/session.router.js'
import { mockRouter } from './routes/mocks.router.js';
import { initPassport, passport } from './config/passport.js'
import { tasks } from './config/cron/cronTasks.js';

import {socketServer, handlers, reemiters} from './utils/websocket.js'
import {isAdmin,isUser,loggedIn} from './utils/middlewares.js'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import { specs } from './docs/autodoc.js';
import swaggerUiExpress from 'swagger-ui-express'
import { addLogger,logger } from './config/logger/logger.js';
import { ticketModel } from './model/Ticket.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 8080

const app = express()
mongoose.connect(process.env.MONGO_URL)
.then(() => logger.info('Connected to DB'))
.catch((e) => logger.error(e))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')

app.use(addLogger)
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
        ttl: 3600
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
app.use('/mocks', mockRouter)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.get('/', loggedIn, (req, res) =>{
    res.status(200).render("index.handlebars")
})

app.get('/productActions', loggedIn, (req, res) =>{
    res.status(200).render("productActions",
    {
        layout: 'main',
        title: 'Product actions',
        socketHandler: "createProduct"
    })
})

app.get('/currentProducts', loggedIn, async (req, res) =>{
    const prods = await productModel.find().lean()
    res.status(200).render("currentProducts",
    {
        layout: 'main',
        title: 'Current products',
        initialProducts: prods,
        socketHandler: "realtimeProducts"
    })
})

app.get('/cartActions', loggedIn, async (req, res) =>{
    const prods = await productModel.find().lean()
    const carts = await cartModel.findById(req.session.user_cart).lean()
    carts.price = carts.products.reduce((accumulator, product) => {
        return accumulator + (product.prod_id.price * product.quantity) 
        }, 0)
    const tickets = await ticketModel.find({"buyer": req.session.user.email}).lean()
    res.status(200).render("cartActions",
    {
        layout: 'main',
        title: 'Cart actions',
        products: prods,
        addProductHandler: 'addProductToCart',
        carts: [carts],
        tickets:tickets
        
    })
})


const httpServer = app.listen(PORT,()=>{
    logger.info(`Connected to port ${PORT}`)
})

app.get('/login',(req, res) =>{
    res.status(200).render("userLogin",
    {
        layout: 'main',
        title: 'Login'
    })
})

socketServer(httpServer, handlers, reemiters)