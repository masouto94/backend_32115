import mongoose, { Schema, model } from "mongoose";
import paginate from 'mongoose-paginate-v2'
import { logger } from "../config/logger/logger.js";
import { isEmail, InvalidEmailError } from "../utils/helpers.js";

const ticketCodeSchema = new Schema({

    code:{
        type:Number,
        required:true,
        default:0
    }
})
const ticketCodesModel = model('TicketCodes', ticketCodeSchema)

const ticketSchema = new Schema({
    purchase_datetime:{
        type:Date,
        required:true
    },
    amount:{
        type:Number,
        required: true
    },
    buyer:{
        type: String,
        required: true
    },
    code:{
        type: Number, 
        default: null
    },
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
                    default: 1
                }
            }
        ]
    }
})

ticketSchema.pre('save', async function(){
    try{
        if(!isEmail(this.buyer)){
            throw InvalidEmailError("Buyer must be an email")
        }
        const lastCode= await ticketCodesModel.findOne({})
        this.code = lastCode.code
        const newCode = lastCode.code +1
        await ticketCodesModel.findByIdAndUpdate( lastCode._id,{code: newCode})
    } catch(e){
        logger.error(e)
    }
})
ticketSchema.pre('findOne', function () {
    this.populate('products.prod_id','title')
})
ticketSchema.pre('find', function () {
    this.populate('products.prod_id','title')
})
ticketSchema.pre('findById', function () {
    this.populate('products.prod_id','title')
})
ticketSchema.plugin(paginate)
const ticketModel =  model('Ticket', ticketSchema)

export{
    ticketModel,
    ticketCodesModel
}