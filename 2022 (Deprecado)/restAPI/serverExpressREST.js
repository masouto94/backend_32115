const express = require('express')
const productRoutes = require('./routes/products.js')

const morgan = require('morgan')

const app= express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))
app.use(express.static(__dirname +"/public"));
app.use('/api/products', productRoutes)


const PORT = process.env.PORT || 8081
const server = app.listen(PORT, () => {
    console.log('Levantado server en express', `Puerto: ${PORT}`)
})
server.on("error", (error) => console.log(error))