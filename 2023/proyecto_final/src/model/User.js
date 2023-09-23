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
    age:{
        type: Number,
        required: true
    },
    profile_photo:{
        type: String
    }
})
userSchema.pre('save', function(next){
    if(!this.user_name){
        this.user_name = `${this.first_name}.${this.last_name}`
    }
    next()
})
userSchema.plugin(paginate)
const userModel = model('User', userSchema)
export {
    userSchema,
    userModel
}