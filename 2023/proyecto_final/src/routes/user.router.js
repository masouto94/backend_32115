import { Router } from "express"
import { userModel } from "../model/User.js"

const userRouter = Router()
userRouter.get('/', async (req, res) => {
    try {
        const users = await userModel.find()
        res.status(200).send({ response: 'OK', message: users })
    } catch (error) {
        res.status(400).send({  response: 'Failed to get users', message: error  })
    }
})

userRouter.get('/:id', async (req, res) => {
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

userRouter.put('/:id', async (req, res) => {
    const { id } = req.params
    const { first_name, last_name, age, email, password } = req.body
    try {
        const user = await userModel.findByIdAndUpdate(id, { first_name, last_name, age, email, password })
        if (user) {
            const updatedUser = await userModel.findById(id)
            res.status(200).send({ response: 'OK', message: updatedUser })
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
        const user = await userModel.findByIdAndDelete(id)
        if (user) {
            res.status(200).send({ response: 'OK', message: `Deleted user ${id}` })
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