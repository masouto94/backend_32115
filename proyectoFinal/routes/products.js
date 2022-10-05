const express = require('express')
const contenedor = require('../src/model/contenedor.js').Contenedor
const productRouter = express.Router()
const manager = new contenedor("./src/products/products.txt")
productRouter.use(express.json())
productRouter.use(express.urlencoded({extended:true}))

const dataPostingValidation = (req,res,next) => {
    const allKeys = ['code','title', 'price', 'thumbnail', 'stock'] 
    const confirmation = allKeys.every(item => req.body[item] !== '');    
    if (confirmation){
        next()
        return
    }
    res.status(401).send("All fields must be completed")
}
const dataUpdatingValidation = (req,res,next) => {
    let reqObject = req.body.formEntriesValues
    const anyKey = ['code','title', 'price', 'thumbnail', 'stock'] 
    const confirmation = anyKey.some(item => reqObject[item]);
    if (confirmation){
        next()
        return
    }
    res.status(401).send("At least a field must be completed")
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
    const newProductId = await manager.save(req.body)
    console.log({createdId: newProductId})
    return res.redirect('/')
})

productRouter.put('/update/:id',dataUpdatingValidation, async (req,res) => {
    const {id} = req.params
    await manager.readContent()
    
    try {
        const product = await manager.getById(parseInt(id))
        await manager.update(parseInt(id), req.body.formEntriesValues)
        res.status(200).json(
            {
                "original":product,
                "updated":req.body.formEntriesValues
            }
        )
    } catch (e) {
        return res.status(404).json({error:e.message})
    }
})

productRouter.delete('/delete/:id', async (req,res) => {
    const {id} = req.params
    await manager.readContent()

    try {
        const product = await manager.getById(parseInt(id))
        await manager.deleteById(product.id)
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