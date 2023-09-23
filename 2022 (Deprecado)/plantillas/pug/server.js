const express = require('express')
const app = express()
const products = []
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', (req,res) => {
    res.redirect('/index')
})

app.get('/index', (req, res) => {
    res.render('pages/index', {
        linkTo: "products"
    })
})

app.get('/products', (req, res) => {
    res.render('pages/productsView', {
        notEmpty: products.length > 0,
        productList: products,
        linkTo: "index"
    })
})
app.post('/products',(req,res)=>{
    const {body} = req
    products.push(body)

    res.render('pages/index', {
        linkTo: "products"
    })
})

const PORT = process.env.PORT || 8081


app.listen(PORT, () => {
    console.log(`Escuchando al puerto ${PORT} - plantillas`)
})