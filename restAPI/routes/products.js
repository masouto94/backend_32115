const {Router} = require('express')
const contenedor = require('../src/contenedor.js').Contenedor
const router = Router()
const manager = new contenedor("./src/file.txt")

const dataPostingValidation = (req,res,next) => {
    const allKeys = ['title', 'price', 'thumbnail'] 
    const confirmation = allKeys.every(item => req.body[item] !== '');    
    if (confirmation){
        next()
        return
    }
    res.send("All fields must be completed")
}

router.get('/all', async (req,res) => {
    const prods = await manager.getAll()
    return res.status(200).json(prods)
})

router.get('/:id', async (req,res) => {
    const {id} = req.params
    await manager.readContent()

    try {
        const product = await manager.getById(parseInt(id))
        res.status(200).json({product})
    } catch (e) {
        return res.status(404).json({error:e.message})
    }
})

router.post('/add', dataPostingValidation, async (req,res) => {
    await manager.readContent()
    const newProductId = await manager.save(req.body)
    return res.status(200).json({createdId: newProductId})
})

router.put('/update/:id', async (req,res) => {
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

router.delete('/delete/:id', async (req,res) => {
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

module.exports = router