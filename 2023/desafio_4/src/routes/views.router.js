import express  from "express"

const router = express.Router()

router.get('/', (req, res)=>{
    res.render('index',{})
})

router.post('/', (req, res)=>{
    //El endpoint esta aca pero no es el que manda el evento?
    res.send(req.body)
})
export{
    router
}