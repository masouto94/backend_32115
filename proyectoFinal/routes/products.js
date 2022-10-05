const express = require('express')
const contenedor = require('../src/model/contenedor.js').Contenedor
const productRouter = express.Router()
const manager = new contenedor("./src/products/products.txt")
productRouter.use(express.json())
productRouter.use(express.urlencoded({extended:true}))

const dataPostingValidation = (req,res,next) => {
    const allKeys = ['code','title', 'price', 'thumbnail'] 
    const confirmation = allKeys.every(item => req.body[item] !== '');    
    if (confirmation){
        next()
        return
    }
    res.send("All fields must be completed")
}
const dataUpdatingValidation = (req,res,next) => {
    const anyKey = ['code','title', 'price', 'thumbnail'] 
    const confirmation = anyKey.some(item => req.body[item]);
    if (confirmation){
        next()
        return
    }
    res.send("All fields must be completed")
}

productRouter.get('/all', async (req,res) => {
    const prods = await manager.getAll()
    return res.status(200).json(prods)
})

productRouter.get('/:id', async (req,res) => {
    const {id} = req.params
    await manager.readContent()

    try {
        const product = await manager.getById(parseInt(id))
        res.status(200).json({product})
    } catch (e) {
        return res.status(404).json({error:e.message})
    }
})

productRouter.post('/add', dataPostingValidation, async (req,res) => {
    await manager.readContent()
    const newProductID = await manager.save(req.body)
    console.log({createdID: newProductID})
    return res.redirect('/')
})

productRouter.put('/update/:id', dataUpdatingValidation, async (req,res) => {
    const {id} = req.params
    await manager.readContent()
    
    try {
        const product = await manager.getById(parseInt(id))
        await manager.update(parseInt(id), req.body)
        res.status(200).json(
            {
                "before":product,
                "after":req.body 
            }
        )
    } catch (e) {
        return res.status(404).json({error:e.message})
    }
})

productRouter.delete('/delete/:id', async (req,res) => {
    const {id} = req.params
    console.log(id)
    await manager.readContent()

    try {
        const product = await manager.getById(parseInt(id))
        await manager.deleteByID(product.id)
        return res.status(200).send(`Deleted product with id ${id}`)
    } catch (e) {
        return res.status(404).json({error:e.message})
    }

})

productRouter.delete('/deleteAll', async (req,res) => {

    try {
        await manager.deleteAll()

        return res.status(200).send(`Deleted all`)
    } catch (e) {
        return res.status(404).json({error:e.message})
    }

})
module.exports = productRouter