import fs from 'fs'

class CartManager {
    #carts = []
    constructor(path) {
        this.path = path
    }
    get carts() {
        return this.#carts
    }
    set carts(value){
        this.#carts = value
    }

    getCarts = async () =>{
        this.carts = await fs.promises.readFile(this.path).then(r => JSON.parse(r))
        return this.carts
    }


}

export {
    CartManager
}