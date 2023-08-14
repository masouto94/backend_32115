import { Product } from "./Product.js"

class Cart {
    constructor(products, price=undefined, id=undefined) {
        this.products = this.retrieveProducts(products)
        this.price = price ? price : this.products.reduce((accumulator, product) => {return accumulator + (product.price * product.quantity)}, 0)
        this.id = id ? id : Cart.generateId()

    }

    retrieveProducts(products) {
        const productList = []
        for (let product of products) {
            if (!(product instanceof Product)) {
                try{
                    let {title, code, price, stock, description, thumbnail, id} = product
                    let toAdd = new Product(title, code, price, stock, description, thumbnail, id)
                    if(product.quantity){
                        toAdd.quantity = product.quantity
                    }
                    productList.push(toAdd)
                    continue
                    
                }catch(e){
                    throw new TypeError("Products attribute must be composed of Product-like objects")
                }
            }
            else{
                productList.push(product)
            }
            
        }
        return productList
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