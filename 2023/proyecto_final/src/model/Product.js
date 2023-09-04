import {Schema, model} from 'mongoose'
class MissingPropertyError extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
    }
}
class Product {
    constructor(title, code, price, stock, description, thumbnail, id=undefined) {
        this.title = title
        this.code = code
        this.price = price
        this.stock = stock
        this.description = description
        this.thumbnail = thumbnail
        if (this.#validateAttributes()) {
            throw new MissingPropertyError("None of Product properties can be null or undefined")
        }
        this.id = id ? id : Product.generateId()
    }
    #validateAttributes() {
        return Object.values(this).includes(undefined) || Object.values(this).includes(null) || Object.values(this).includes(false)
    }
    static generateId(){
        if(!this._id){
            this._id = 1
        }
        const id = this._id
        this._id++
        return id
        
    }

    static setBaseId(id){
        this._id = id
        return   
    }

}

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
const productModel = model('Product', productSchema)
export {
    MissingPropertyError,
    Product,
    productSchema,
    productModel
}