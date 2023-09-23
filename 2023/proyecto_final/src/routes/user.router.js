import { Router } from "express"
import { userModel } from "../model/User.js"


const userRouter = Router()


userRouter.get('/', (req,res) =>{
    res.status(200).send('loginpage')
})


export {
    userModel,
    userRouter
}