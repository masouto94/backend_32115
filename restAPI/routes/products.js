const {Router} = require('express')
const router = Router()
const contenedor = require('../src/contenedor.js').Contenedor
const manager = new contenedor("./src/file.txt")


router.get('/prueba', (req,res) => {
    res.send('llegue')
})

router.get('/all', async (req,res) => {

    const prods = await manager.getAll()
    return res.status(200).json(prods)
})

router.get('/:id', async (req,res) => {
    const {id} = req.params
    await manager.readContent()
    const product = await manager.getById(parseInt(id))
    if(product.length === 0){
        return res.status(404).json({error:"Product not found"})
    }
    else{
        res.status(200).json({product})
    }

})

router.post('/add', async (req,res) => {
    await manager.readContent()
    const newProductID = await manager.save(req.body)
    return res.status(200).json({createdID: newProductID})

})

router.put('/update/:id', async (req,res) => {
    const {id} = req.params
    await manager.readContent()
    const product = await manager.getById(parseInt(id))
    if(product.length === 0){
        return res.status(404).json({error:"Product not found"})
    }
    else{
        await manager.update(parseInt(id), req.body)

        res.status(200).json(
            {
                "before":product,
                "after":req.body 
            }
        )
    }

})

router.delete('/delete/:id', async (req,res) => {
    await manager.readContent()
    const {id} = req.params
    const product = await manager.getById(parseInt(id))
    if(product.length === 0){
        return res.status(404).json({error:"Product not found"})
    }
    else{
        await manager.deleteByID(parseInt(id))
        return res.status(200).send(`Deleted product with id ${id}`)
    }

})
module.exports = router