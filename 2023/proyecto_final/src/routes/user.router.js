import { Router } from "express"
import { userModel } from "../model/User.js"
import { cartModel } from "../model/Cart.js"
import {isAdmin, loggedIn} from  "../utils/middlewares.js"

const userRouter = Router()

userRouter.get('/',isAdmin, async (req, res) => {
    try {
        const users = await userModel.find()
        res.status(200).send({ response: 'OK', message: users })
    } catch (error) {
        res.status(400).send({  response: 'Failed to get users', message: error  })
    }
})

userRouter.get('/:id', isAdmin, async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (!user) {
            res.status(404).send({ response: 'Failed to get user', message: `User with id: ${id} not Found` })
        }
        res.status(200).send({ response: 'OK', message: user })
    } catch (error) {
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
        res.status(400).send({ response: 'Failed to update user', message: error })
    }
})

userRouter.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        //Revisar por qué no se guarda bien el ID para borrar el mock user
        // req.logger.error(JSON.stringify(req.session))
        // if(id !== req.session.user._id && req.session.user.role !== 'admin'){
        //     res.status(403).send({ response: 'Only admins are allowed to delete other users', message: `Trying to delete ${_id} while being ${req.session.user._id}`})    
        // }
        const user_cart = await userModel.findById(id,{cart:1})
        const user = await userModel.findByIdAndDelete(id)
        if (user) {
            await cartModel.findByIdAndDelete(user_cart.cart)
            res.status(200).send({ response: 'OK', message: `Deleted user ${id} and cart ${user_cart.cart}` })
        } else {
            res.status(404).send({ response: 'Failed to delete user', message:  `User with id: ${id} not Found` })
        }
    } catch (error) {
        res.status(400).send({ response: 'Failed to delete user', message: error.message })
    }
})

userRouter.delete('/', isAdmin, async (req, res) => {
    try {
        const user_cart = await userModel.findById(id,{cart:1})
        const user = await userModel.findByIdAndDelete(id)
        if (user) {
            await cartModel.findByIdAndDelete(user_cart.cart)
            res.status(200).send({ response: 'OK', message: `Deleted user ${id} and cart ${user_cart.cart}` })
        } else {
            res.status(404).send({ response: 'Failed to delete user', message:  `User with id: ${id} not Found` })
        }
    } catch (error) {
        res.status(400).send({ response: 'Failed to delete user', message: error })
    }
})

export {
    userModel,
    userRouter
}