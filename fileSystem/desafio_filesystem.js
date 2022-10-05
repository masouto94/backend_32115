fs = require('fs')

class Contenedor {
    constructor(file){
        this.products_list=[]
        this.file=file
        this._uid=0
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
        this.products_list.push(producto)
        try{
            await fs.promises.writeFile(this.file,JSON.stringify(this.products_list))
            return this._uid
        }catch(error){
            throw new Error(error)
        }
        
    }

    getById = (idNum) => {
        
        const foundObject = this.products_list.filter(elem => elem.id === idNum)
        return foundObject
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
        .then(async ()=> {
            await this.readContent()

        })
        }catch (err){
            console.log(`No se pudo borrar el elemento con id: ${idNum}`)
        }
    }

    
     deleteAll = async () =>{
        try{
        await fs.promises.writeFile(this.file, "")
        .then(()=> console.log("Se borro todo"))
        .then(()=>{
            this.products_list=[]
            this._uid=0
        })
        }catch (err){
            console.log(`No se pudieron borrar los elementos del archivo`)
        }
    }
}

const producto1= {
    id:1,
    title: "Primero",
    price: 123,
    thumbnail: "Esto es algo"
}
fs.writeFileSync("./file.txt",JSON.stringify(producto1))

const manager = new Contenedor('./file.txt')

manager.save(producto1)

const producto2={

    title: "Segundo",
    price: 1233,
    thumbnail: "Esto tmb es algo"
}
manager.save(producto2)


const producto3={

    title: "Tercero",
    price: 12233,
    thumbnail: "Esto no tmb es algo"
}
manager.save(producto3)
const allProducts = manager.getAll()
console.log(allProducts)







// manager.deleteAll()