import express from 'express'
import path from 'path';
import {fileURLToPath} from 'url';
import productsRouter from './routes/products.router.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))
app.use('/products', productsRouter)

app.get('/',(req, res) =>{
    res.status(200).sendFile("public/views/index.html",{root: __dirname })
})

app.listen(PORT,()=>{
    console.log(`Connected to port ${PORT}`)
})