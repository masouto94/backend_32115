import {Server} from 'socket.io'
import { productManager } from '../routes/products.router.js'
// import { cartManager } from '../routes/cart.router.js'
import { CartManager } from '../model/CartManager.js'
const cartManager = new CartManager("src/database/carts.json")

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



const renderCartsServer = async () => {
    const carts = await cartManager.getCarts()
    return carts
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
        }
            )
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