import { Router } from 'express';
import { generateProducts } from '../utils/mocks/generators/productsGenerator.js';
const mockRouter = Router()


mockRouter.get('/products/:amount', async (req,res) =>{
    const prods = generateProducts(parseInt(req.params.amount))
    return res.status(500).send({mockProducts:prods})

})

export {
    mockRouter
}