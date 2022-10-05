fs = require('fs')

class Contenedor {
    constructor(file){
        this.products_list=[]
        this.file=file
        this._uid=0
        this._cartUid=0
    }

    readContent = async () =>  {
        try{
           
            const products = await fs.promises.readFile(this.file,"utf-8").then(elem =>JSON.parse(elem))
            this.products_list=products

            
            this.products_list.map( (producto) => {
                if(producto.id && this._uid <= producto.id){
                    this._uid = producto.id
                }
            })
            return this.products_list
        } catch (error){
            throw new Error(error)
        }

    }

    save = async (producto) => {
        this._uid++
        producto.id =this._uid
        producto.timestamp = Date.now()
        this.products_list.push(producto)
        try{
            await fs.promises.writeFile(this.file,JSON.stringify(this.products_list))
            return this._uid
        }catch(error){
            throw new Error(error)
        }
        
    }

    update = async (idNum, newObject) => {
        const toReplace = await this.getById(idNum)

        try{
            const products = await this.readContent()
            products.map((elem) => {
                if (elem.id === toReplace.id){
                    console.log(elem)
                    console.log(toReplace)
                    Object.assign(elem, newObject)
                }
            })
            this.products_list=products

            await fs.promises.writeFile(this.file, JSON.stringify(products))
            await this.readContent()
            return
        }catch (err){
            console.log(`No se pudo borrar el elemento con id: ${idNum}`)
        }
        

    }

    getById = async (idNum) => {
        
        const foundObject = this.products_list.filter(elem => elem.id === idNum)
        if(foundObject.length === 0){
            throw new Error(`Id ${idNum} not found`)
        } 
        return foundObject[0]
        
    }
    
     getAll = async () => {
        const allProducts = await this.readContent()
        return  allProducts
    }

    deleteById = async (idNum) =>{
        try{
            const products = await this.readContent()
            const filtered_products = products.filter(elem => elem.id !== idNum)
            this.products_list=filtered_products
       
            await fs.promises.writeFile(this.file, JSON.stringify(filtered_products))
            await this.readContent()
        }catch (err){
            console.log(`No se pudo borrar el elemento con id: ${idNum}`)
        }
    }

    
     deleteAll = async () =>{
        try{
        await fs.promises.writeFile(this.file, "[]")
        .then(()=> console.log("Se borro todo"))
        .then(()=>{
            this.products_list=[]
            this._uid=0
        })
        }catch (err){
            console.log(`No se pudieron borrar los elementos del archivo`)
        }
    }
    createCart = async () => {
        let fullRoute = `src/carts/cart_${this._cartUid}.txt`
        let allProducts = await this.getAll()
        await fs.promises.writeFile(fullRoute,JSON.stringify({
            cartId:this._cartUid,
            cartTimestamp: Date.now(),
            products: allProducts
        }))
        this._cartUid++
        return this._cartUid-1
    }
    getCartById = async (id) => {
        let fullRoute = `src/carts/cart_${id}.txt`
        try {
            let cart = await fs.promises.readFile(fullRoute).then(elem =>JSON.parse(elem))
            return cart
        } catch (error) {
            return `Cart with Id: ${id} not found`
        }
    }
    addProductToCart = async (id,productId) => {
        const currentCart = await this.getCartById(id)
        const newProduct = await this.getById(productId)
        currentCart.products.push(newProduct)
        await fs.promises.writeFile(`src/carts/cart_${id}.txt`,JSON.stringify(currentCart))
        return currentCart
    }
    deleteCartById = async (id) => {
        try{
            await fs.promises.unlink(`src/carts/cart_${id}.txt`)
            return `Se borró cart con id ${id}`
        }catch (err){
            console.log(`No se pudo borrar el cart con id: ${id}`)
        }
    }
    deleteProductFromCart = async (id, productId) => {
        try{
            const currentCart = await this.getCartById(id)
            const filteredProducts = currentCart.products.filter(prod => prod.id !== productId)
            currentCart.products = filteredProducts
            await fs.promises.writeFile(`src/carts/cart_${id}.txt`, JSON.stringify(currentCart))
            return `Se borró el producto con id: ${productId} del cart ${id}`
        }catch (err){
            console.log(`No se pudo borrar el cart con id: ${id}`)
        }
    }
}

module.exports.Contenedor= Contenedor