import { Router } from "express"
import { userModel } from "../model/User.js"
import { cartModel } from "../model/Cart.js"
import {isAdmin, loggedIn} from  "../utils/middlewares.js"
import { logger } from "../config/logger/logger.js"
import { deleteSession } from "./session.router.js"
import { ticketModel } from "../model/Ticket.js"
import { Mailer } from "../utils/mailer/mailing.js"

const mailer = new Mailer()
const userRouter = Router()

const validateHeaders = (req,res,id,errorMsg) =>{
    if(req.headers.authorization === process.env.SESSION_SECRET){
        req.logger.debug("Deleting user by SECRET. This is for tests to run successfully")
    }
    else if(id !== req.session.user._id && req.session.user.role !== 'admin'){
        return res.status(403).send({ response: 'Failed', message: errorMsg})    
    }
}
userRouter.get('/',isAdmin, async (req, res) => {
    try {
        const users = await userModel.find()
        res.status(200).send({ response: 'OK', message: users })
    } catch (error) {
        logger.error(error.message)
        res.status(400).send({  response: 'Failed to get users', message: error  })
    }
})

userRouter.delete('/current',loggedIn, async (req, res) => {
    try {
        const userName  = req.session.user.user_name
        const userEmail = req.session.user.email
        await cartModel.findByIdAndDelete(req.session.user.cart)
        await ticketModel.deleteMany({buyer: req.session.user.email})
        await userModel.findByIdAndDelete(req.session.user._id)
        deleteSession(req,res,`Successfully deleted ${userName} session`)
        await mailer.sendEmail("App admin <masouto94@gmail.com>",userEmail, "Aviso de eliminación de cuenta", 
        `<h1>Borraste tu cuenta</h1>
        <div>Muchas gracias</div>
        `)
        res.status(200).send({ response: 'OK', message: `Successfully deleted ${userName}` })
    } catch (error) {
        logger.error(error.message)
        res.status(400).send({  response: 'Failed to get users', message: error  })
    }
})

userRouter.get('/:id', loggedIn, async (req, res) => {
    const { id } = req.params
    try {
        validateHeaders(req,res,id,`Cannot fetch a different user unless you are admin`)
        
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).send({ response: 'Failed to get user', message: `User with id: ${id} not Found` })
        }
        res.status(200).send({ response: 'OK', message: user })
    } catch (error) {
        logger.error(error.message)
        res.status(400).send({ response: 'Failed to get user', message: error })
    }
})

userRouter.put('/:id', loggedIn, async (req, res) => {
    const { id } = req.params
    const { first_name, last_name, age, email, password } = req.body
    try {
        if(id !== req.session.user._id && req.session.user.role !== 'admin'){
            res.status(403).send({ response: 'Only admins are allowed to update other users', message: `Trying to update ${_id} while being ${req.session.user._id}`})    
        }
        const user = await userModel.findByIdAndUpdate(id, { first_name, last_name, age, email, password })
        if (user) {
            const updatedUser = await userModel.findById(id)
            res.status(200).send({ response: 'OK', message: `Updated user: ${updatedUser}` })
        } else {
            res.status(404).send({ response: 'Failed to update user', message:  `User with id: ${id} not Found` })
        }
    } catch (error) {
        logger.error(error.message)
        res.status(400).send({ response: 'Failed to update user', message: error })
    }
})



userRouter.delete('/inactiveUsers', async (req, res) => {
    try {
        const now = new Date()
        const monthAgo = new Date(new Date().setDate(now.getDate() - 30));
        const users = await userModel.find({last_login: {$lte: monthAgo}})
        if (users) {
            users.forEach(async user =>{
                await cartModel.findByIdAndDelete(user.cart)
                await ticketModel.deleteMany({buyer: user.email})
                await userModel.findByIdAndDelete(user._id)
            })
            await mailer.userDeletionNotification(users.map(user => user.email))
            return res.status(200).send({ response: 'OK', message: `Deleted all inactive users and carts`, users:users.map(user => user.email) })
        } else {
            return res.status(404).send({ response: 'Error', message:  `No users to delete` })
        }
    } catch (error) {
        logger.error(error.message)
        return res.status(400).send({ response: 'Failed to delete user', message: error })
    }
})

userRouter.delete('/:id',loggedIn, async (req, res) => {
    const { id } = req.params
    try {
        validateHeaders(req,res,id,`Trying to delete ${id} while being ${req.session.user._id}`)
        const user = await userModel.findByIdAndDelete(id)
        if (user) {
            await cartModel.findByIdAndDelete(user.cart)
            await ticketModel.deleteMany({buyer: user.email})
            res.status(200).send({ response: 'OK', message: `Deleted user ${id}, cart ${user.cart}, and associated tickets` })
        } else {
            res.status(404).send({ response: 'Failed to delete user', message:  `User with id: ${id} not Found` })
        }
    } catch (error) {
        logger.error(error.message)
        res.status(400).send({ response: 'Failed to delete user', message: error.message })
    }
})
export {
    userModel,
    userRouter
}