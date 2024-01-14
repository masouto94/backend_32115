import {Schema, model} from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import { cartModel } from './Cart.js'
import { isUserName, InvalidUserNameError } from '../utils/helpers.js'

const userSchema = new Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
        },
    user_name:{
        type: String,
       
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    },
    role:{
        type: String,
        default: 'user'
    }
})
userSchema.pre('save', async function(next){
    if(!this.user_name){
        this.user_name = `${this.first_name.toLowerCase()}.${this.last_name.toLowerCase()}`
        if(!isUserName(this.user_name)){
            throw InvalidUserNameError(`${this.user_name} is an invalid user name`)
        }
    }
    const userCart = await cartModel.create({})
    this.cart = userCart._id
    next()
})

userSchema.plugin(paginate)
const userModel = model('User', userSchema)
export {
    userSchema,
    userModel
}