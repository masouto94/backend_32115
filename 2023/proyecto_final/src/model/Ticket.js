import mongoose, { Schema, model } from "mongoose";
import paginate from 'mongoose-paginate-v2'
import { isEmail } from "../utils/helpers.js";

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
    }
})

ticketSchema.pre('save', async function(){
    try{
        if(!isEmail(this.buyer)){
            throw TypeError("buyer must be an email")
        }
        const lastCode= await ticketCodesModel.findOne({})
        console.log(lastCode)
        this.code = lastCode.code
        console.log(lastCode.code)
        const newCode = lastCode.code +1
        await ticketCodesModel.findByIdAndUpdate( lastCode._id,{code: newCode})
    } catch(e){
        console.log(e)
    }
})
ticketSchema.plugin(paginate)
const ticketModel =  model('Ticket', ticketSchema)

export{
    ticketModel,
    ticketCodesModel
}