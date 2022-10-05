const express = require('express')
const contenedor = require('../src/model/contenedor.js').Contenedor
const cartRouter = express.Router()
const manager = new contenedor("./src/products/products.txt")
cartRouter.use(express.json())
cartRouter.use(express.urlencoded({extended:true}))



cartRouter.post('/create', async (req,res) => {
    const toAdd = await manager.readContent()
    
    console.log(req.body)
    if(toAdd.length === 0){
        return res.status(401).send('Cant create empty cart')
    }
    let cart= await manager.createCart()
    console.log({cartId: cart})
    return res.redirect('/')
})

cartRouter.get('/:id', async (req,res) => {
    const {id} = req.params

    try {
        const cart = await manager.getCartByID(id)
        res.status(200).json({cart})
    } catch (e) {
        return res.status(404).json({error:e.message})
    }
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