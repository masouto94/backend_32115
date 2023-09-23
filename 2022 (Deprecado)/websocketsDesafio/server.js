const express = require('express')
const hbs = require('express-handlebars')
const http = require('http')
const {Server: SocketServer} = require('socket.io')
const app = express()
const httpServer = http.createServer(app)
const socketServer = new SocketServer(httpServer)

const products = []

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/views'))

app.engine('hbs',hbs.engine({
    partialsDir: __dirname+'/views/partials',
    layoutsDir: __dirname+'/views/layouts',
    extname:'.hbs',
    defaultLayout:'default.hbs'
    }))

app.set('views', './views')
app.set('view engine', 'hbs')

app.get('/', (req,res) => {
    res.redirect('/index')
})

app.get('/index', (req, res) => {
    res.render('index', {
        linkTo: "products",
        notEmpty: products.length > 0,
        productList: products

    })
})

app.get('/products', (req, res) => {

    res.render('productsTable', {
        notEmpty: products.length > 0,
        layout: "productsView",
        productList: products,
        linkTo: "index"
    })
})
app.post('/products',(req,res)=>{
    const {body} = req
    products.push(body)

    res.render('index', {
        linkTo: "products",
        success: true
    })
})



socketServer.on('connection', (client)=>{
    console.log(`Usuario ${client.id} conectado al socket`)
    
    socketServer.sockets.emit('showAllProds', products)
    
    client.on('productLoaded', product=>{
        const obj = {
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail
        }
        products.push(obj)
        socketServer.sockets.emit('showAllProds', products)
    })
    
    client.on('disconnect', () => {
        console.log(`Cliente ${client.id} desconectado`)
    })
})

const PORT = process.env.PORT || 3000

httpServer.listen(PORT, ()=>{
    console.log(`Server levantado en ${PORT}`)
})



// app.listen(PORT, () => {
//     console.log(`Escuchando al puerto ${PORT} - plantillas`)
// })