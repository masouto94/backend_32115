import {Server} from 'socket.io'


class SocketHandler{
    constructor(event, callback=undefined, target=undefined,args=undefined){
        this.event = event
        this.callback = callback
        this.target = target
        this.args = args
    }
}
const greeting = (message) => {
    console.log(message.toUpperCase())
}
const greetingHandler = () => {
    return new SocketHandler('greeting', greeting)
}

const renderMessage = (message,source) => {
    console.log("#".repeat(10))
    console.log(message)
    console.log("FROM FORM ID=> ", source)
    console.log("#".repeat(10))
}

const renderMessageHandler = () => {
    return new SocketHandler('inputMessage', renderMessage)
}


import {  cartModel } from '../model/Cart.js'
import {  productModel } from '../model/Product.js'

const renderCartsServer = async () => {
    const carts = await cartModel.find().lean()
    return carts
    
}

const renderProductsServer = async (prods) => {
    let returnData = []
    
    for (let index = 0; index < prods.length; index++) {
        const product = await productModel.findById(prods[index].id,{'title':1})
        const title =  product.title
        returnData.push({prod_id: prods[index].id,title: title, quantity:prods[index].quantity})
    }
    return returnData
    
}

const handlers = [greetingHandler(), renderMessageHandler()]
const reemiters = []
const socketServer = (httpServer, handlers,reemiters) => {
    const socket = new Server(httpServer)
    socket.on('connection', (conn) =>{
        for (const handler of handlers) {
            conn.on(handler.event, handler.callback)
        }
        conn.on('createCart', async () =>{
            const carts = await renderCartsServer()
            socket.emit( 'createCart',carts)
        })
        conn.on('renderProduct', async (products) =>{
            const prods = await  renderProductsServer(products)
            socket.emit('renderProduct', prods)
        })
        for (const reemiter of reemiters) {
            conn.on(reemiter.event,  () => {
                conn.emit(reemiter.target, reemiter.args)
            })
        }
        
    })
}
export{
    socketServer,
    SocketHandler,
    handlers,
    reemiters
}