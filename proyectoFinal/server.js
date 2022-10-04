const express = require('express')
const morgan = require('morgan')
const app = express()
const productRoutes = require('./routes/products.js')
const cartRoutes = require('./routes/cart.js')
const contenedor = require('./src/model/contenedor.js').Contenedor
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use(express.json())
app.use(express.urlencoded({extended:true}))



app.use(morgan('dev'))
app.use(express.static(__dirname+'/src/public'))

app.get('/', (req,res) => {
    res.sendFile('index.html')
})


const PORT = process.env.PORT || 8081
const server= app.listen(PORT, () =>{
    console.log(`Listening to port: ${PORT}`)
})
server.on("error", (error) => console.log(error))