class Product {
    #quantity
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

    get quantity(){
        return this.#quantity 
    }
    set quantity(amount){
        this.#quantity = amount
    }
}
const mate = new Product("Mate", 0, 100, 10, "Un mate normal", "photoUrl")
const yerba = new Product("Yerba", 1, 60, 1000, "Yerba", "photoUrl")

const add = (arr,prod) => {
    
    if(!arr.includes(prod)){
        const toAdd = prod
        toAdd.quantity = 1
        arr.push(toAdd)
        return

    }
    arr = arr.map((item) => {
        if(item.code === prod.code){
            item.quantity++
        }
    return
    })

}

let cart = []

add(cart,mate)
console.log(cart)

for (const prod of cart) {
    console.log(typeof(prod))    
}