import { productSchema } from "./Product.js"
import {Schema, model} from 'mongoose'
import paginate from 'mongoose-paginate-v2'

const cartSchema = new Schema({
    products: {
        type: [
            {
                prod_id: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    default:1
                }
            }
        ],
        default: function () {
            return [];
        }
    },
    price: {
        type:Number,
        default: 0
    }
})


cartSchema.pre('save', function () {
    this.populate('products.prod_id').then(res=>{
        res.set('price', function() {
            if(this.products.length > 0){
                const total = this.products.reduce((accumulator, product) => { return accumulator + (product.prod_id.price * product.quantity) }, 0)
                return total
            }
            return 0
          })
    })
    
})
cartSchema.pre('findOne', function () {
    this.populate('products.prod_id')
})
cartSchema.pre('find', function () {
    this.populate('products.prod_id')
})

cartSchema.plugin(paginate)
const cartModel = model('Cart', cartSchema)

export {
    cartSchema,
    cartModel
}