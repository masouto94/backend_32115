import {Schema, model} from 'mongoose'
import paginate from 'mongoose-paginate-v2'


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
    role:{
        type: String,
        default: 'user'
    }
})
userSchema.pre('save', function(next){
    if(!this.user_name){
        this.user_name = `${this.first_name.toLowerCase()}.${this.last_name.toLowerCase()}`
    }
    next()
})
userSchema.plugin(paginate)
const userModel = model('User', userSchema)
export {
    userSchema,
    userModel
}