import { Router } from "express"
import { userModel } from "../model/User.js"
import {passport} from '../config/passport.js'
const sessionRouter = Router()


sessionRouter.post('/register', passport.authenticate('register'),async (req,res) =>{
    try {
        if (!req.user) {
            return res.status(401).send({ message: `User with email ${req.email} already exists` })
        }

        res.status(200).send({ message: `Welcome to our app! Your username is ${req.user.user_name}` })
    } catch (error) {
        res.status(500).send({ message: `Error registering user ${error}` })
    }
})
    
sessionRouter.post('/login',passport.authenticate('login'), async (req,res) =>{
    const user = req.user
    try {
        req.session.user = user.user_name
        console.log({ response: 'OK', message: user })
    } catch (error) {
        console.log({ response: 'Failed to login', message: error })
    }
    console.log(`Welcome to our app! Your username is ${req.user.user_name}`)
    res.status(200).redirect('/productActions')
})

sessionRouter.get('/githubLogin', passport.authenticate('githubLogin', { scope: ['user:email'] }), async (req, res) => {

})

sessionRouter.get('/githubCallback', passport.authenticate('githubLogin'), async (req, res) => {
    const user = req.user
    console.log(user)
    req.session.user = user.user_name
    res.status(200).redirect('/productActions')
})

sessionRouter.get('/logout', (req,res) =>{
    console.log(req.session)
    if(req.session.user){
        const username=req.session.user
        return req.session.destroy(err => {
            if(err){
                return res.json({status:'Logout error', body:err})
            }
            console.log(`User ${username} logged out`)
            return res.status(200).redirect('/productActions')
        })
    }
    return res.status(400).send("User not logged in")
})

export {
    userModel,
    sessionRouter
}