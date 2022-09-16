const express = require('express')
const hbs = require('express-handlebars')
const app = express()

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

app.get('/', (req, res) => {
    res.render('index', {
        titulo_1: "Ahora si",
        titulo_2: "Esto se renderiza bien",
        nombre: "El",
        apellido: "mati",
        linkTo: "/after"
    })
})

app.get('/after', (req, res) => {
    res.render('content', {
        layout: "nextLayout",
        title: "Sopa de macaco",
        price: 245,
        thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrnrDwoPWnRHMiRd3S_1WBRhQZWpUd95nf_w&usqp=CAU",
        linkTo: "/",
        showImage:true
    })
})

const PORT = process.env.PORT || 8081


app.listen(PORT, () => {
    console.log(`Escuchando al puerto ${PORT} - plantillas`)
})