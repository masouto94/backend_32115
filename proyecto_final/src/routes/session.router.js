import { Router } from "express"
import { userModel } from "../model/User.js"
import {passport} from '../config/passport.js'
const sessionRouter = Router()

export const deleteSession = (req,res, message) => {
    req.session.destroy(err => {
        if(err){
            req.logger.error(JSON.stringify({status:'Logout error', body:err}))    
            return res.json({status:'Logout error', body:err})
        }
        req.logger.info(message)
    })
}

sessionRouter.post('/register', passport.authenticate('register'),async (req,res) =>{
    const user = req.user
    try {
        if (!req.user) {
            return res.status(401).send({ message: `User with email ${req.email} already exists` })
        }
        req.session.user = user
        req.session.user_cart = user.cart
        await userModel.findByIdAndUpdate(user._id, {last_login: Date.now()})
        res.status(200).redirect(302,'/')
    } catch (error) {
        res.status(500).send({ message: `Error registering user ${error}` })
    }
})
    
sessionRouter.post('/login',passport.authenticate('login'), async (req,res) =>{
    const user = req.user
    try {
        req.session.user = user
        req.session.user_cart = user.cart
        await userModel.findByIdAndUpdate(user._id, {last_login: Date.now()})
        req.logger.info(JSON.stringify({ response: 'Logged in successfully', user: user.user_name, source:"native" }))
    } catch (error) {
        req.logger.error(JSON.stringify({ response: 'Failed to login', message: error, user: user.user_name}))
    }
    res.status(200).redirect('/')
})

sessionRouter.get('/githubLogin', passport.authenticate('githubLogin', { scope: ['user:email'] }), async (req, res) => {
})

sessionRouter.get('/githubCallback', passport.authenticate('githubLogin'), async (req, res) => {
    const user = req.user
    try {
        req.session.user = user
        req.session.user_cart = user.cart
        await userModel.findByIdAndUpdate(user._id, {last_login: Date.now()})
        req.logger.info(JSON.stringify({ response: 'Logged in successfully', user: user.user_name, source:"github" }))
    } catch (error) {
        req.logger.error(JSON.stringify({ response: 'Failed to login', message: error, user: user.user_name}))
    }
    res.status(200).redirect('/')
})

sessionRouter.get('/logout', async (req,res) =>{
    if(req.session.user){
        const username=req.session.user
        await userModel.findByIdAndUpdate(req.session.user._id, {last_login: Date.now()})
        deleteSession(req,res,`User ${username.user_name} logged out`)
        return res.status(200).redirect('/login')
    }
    return res.status(400).send("User not logged in")
})

export {
    userModel,
    sessionRouter
}