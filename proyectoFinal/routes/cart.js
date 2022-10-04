const {Router} = require('express')
const contenedor = require('../src/model/contenedor.js').Contenedor
const cartRouter = Router()
const manager = new contenedor("./src/products/products.txt")

const dataPostingValidation = (req,res,next) => {
    const allKeys = ['title', 'price', 'thumbnail'] 
    const confirmation = allKeys.every(item => req.body[item] !== '');    
    if (confirmation){
        next()
        return
    }
    res.send("All fields must be completed")
}

cartRouter.post('/create', async (req,res) => {
    let cart= await manager.createCart()
    return res.status(200).json({cartId: cart})
})

cartRouter.get('/:id', async (req,res) => {
    const {id} = req.params
    await manager.readContent()

    try {
        const product = await manager.getById(parseInt(id))
        res.status(200).json({product})
    } catch (e) {
        return res.status(404).json({error:e.message})
    }
})

cartRouter.post('/add', dataPostingValidation, async (req,res) => {
    await manager.readContent()
    const newProductID = await manager.save(req.body)
    return res.status(200).json({createdID: newProductID})
})

cartRouter.put('/update/:id', async (req,res) => {
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

cartRouter.delete('/delete/:id', async (req,res) => {
    const {id} = req.params
    await manager.readContent()

    try {
        const product = await manager.getById(parseInt(id))
        await manager.deleteByID(product.id)
        return res.status(200).send(`Deleted product with id ${id}`)
    } catch (e) {
        return res.status(404).json({error:e.message})
    }

})

module.exports = cartRouter