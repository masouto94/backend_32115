import { Router } from "express"
import { userModel } from "../model/User.js"
import {auth} from '../utils/middlewares.js'

const userRouter = Router()

userRouter.post('/register', async (req,res) =>{
    const { first_name, last_name, email, password, age } = req.body
    if(await userModel.findOne({email:email})){
        res.status(400).send(`User with email ${email} already exist`)
    }
    try {
        const user = await userModel.create({ first_name, last_name, email, password, age })
        console.log({ response: 'OK', message: user })
    } catch (error) {
        console.log({ response: 'Failed to create user', message: error })
    }
    res.status(200).redirect('/productActions')
})

userRouter.post('/login', async (req,res) =>{
    const { email, password } = req.body
    let user = await userModel.findOne({email:email, password:password})
    if(!user ){
        res.status(400).send(`User with email ${email} does not exist`)
    }
    try {
        req.session.user_name = user.user_name
        console.log({ response: 'OK', message: user })
    } catch (error) {
        console.log({ response: 'Failed to login', message: error })
    }
    res.status(200).redirect('/productActions')
})

userRouter.get('/logout', (req,res) =>{
    req.session.destroy(err => {
        if(err){
            return res.json({status:'Logout error', body:err})
        }
        res.send('Logout success')
    })
})

export {
    userModel,
    userRouter
}