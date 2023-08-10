import { Product } from "./Product.js"

class Cart {
    constructor(products, id=undefined) {
        this.products = products
        this.price = this.products.reduce((accumulator, product) => {return accumulator + (product.price * product.quantity)}, 0)
        this.#validateAttributes()
        this.id = id ? id : Cart.generateId()

    }
#validateAttributes() {
    for (let product of this.products) {
        if (!(product instanceof Product)) {
            throw new TypeError("Products attribute must be composed of Product-like objects")
        }
    }
    return 
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


export {
    Cart
}