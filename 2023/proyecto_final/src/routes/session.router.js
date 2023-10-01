import { Router } from "express"
import { userModel } from "../model/User.js"
import {auth} from '../utils/middlewares.js'
import {passport} from '../config/passport.js'
const sessionRouter = Router()


sessionRouter.post('/register', passport.authenticate('register'),async (req,res) =>{
    try {
        if (!req.user) {
            return res.status(400).send({ mensaje: "Usuario ya existente" })
        }

        res.status(200).send({ mensaje: 'Usuario registrado' })
    } catch (error) {
        res.status(500).send({ mensaje: `Error al registrar usuario ${error}` })
    }
})
    

// sessionRouter.post('/register', async (req,res) =>{
//     const { first_name, last_name, email, password, age } = req.body
//     if(await userModel.findOne({email:email})){
//         res.status(400).send(`User with email ${email} already exist`)
//     }
//     try {
//         const user = await userModel.create({ first_name, last_name, email, password, age })
//         console.log({ response: 'OK', message: user })
//     } catch (error) {
//         console.log({ response: 'Failed to create user', message: error })
//     }
//     res.status(200).redirect('/productActions')
// })

sessionRouter.post('/login', async (req,res) =>{
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

sessionRouter.get('/logout', (req,res) =>{
    req.session.destroy(err => {
        if(err){
            return res.json({status:'Logout error', body:err})
        }
        res.send('Logout success')
    })
})

export {
    userModel,
    sessionRouter
}