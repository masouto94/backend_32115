const express = require('express')
const morgan = require('morgan')
const app = express()
const contenedor = require('./src/model/contenedor.js').Contenedor
const manager = new contenedor('./src/products/products.txt')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))
app.use(express.static(__dirname+'/src/public'))

app.get('/', (req,res) => {
    res.sendFile('index.html')
})

app.get('/all', async (req,res) => {
    res.send(await manager.getAll())
})

const PORT = process.env.PORT || 8081
const server= app.listen(PORT, () =>{
    console.log(`Listening to port: ${PORT}`)
})
server.on("error", (error) => console.log(error))