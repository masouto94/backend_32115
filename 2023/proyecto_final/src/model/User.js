import {Schema, model} from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import { cartModel } from './Cart.js'

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
    }
    const userCart = await cartModel.create({})
    this.cart = userCart._id
    next()
})
userSchema.pre('findOne', function () {
    this.populate('cart.cart_id')
})
userSchema.pre('find', function () {
    this.populate('cart.cart_id')
})
userSchema.pre('findById', function () {
    this.populate('cart.cart_id')
})
userSchema.plugin(paginate)
const userModel = model('User', userSchema)
export {
    userSchema,
    userModel
}