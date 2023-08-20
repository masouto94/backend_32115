const express = require('express')
const hbs = require('express-handlebars')
const app = express()
const products = []

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))

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
        linkTo: "products"
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

const PORT = process.env.PORT || 8082


app.listen(PORT, () => {
    console.log(`Escuchando al puerto ${PORT} - plantillas`)
})