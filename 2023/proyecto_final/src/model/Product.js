import {Schema, model} from 'mongoose'
import {mongoosePaginate} from 'mongoose-paginate-v2'


const productSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    code:{
        type: Number,
        required: true
        },
    price:{
        type: Number,
        required: true
    },
    stock:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    thumbnail:{
        type: String,
        required: true
    }
})
productSchema.plugin(mongoosePaginate)
const productModel = model('Product', productSchema)
export {
    productSchema,
    productModel
}