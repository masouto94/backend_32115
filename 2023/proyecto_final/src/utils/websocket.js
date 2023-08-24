import {Server} from 'socket.io'
import {productsRouter, productManager} from '../routes/products.router.js'
import {cartRouter, cartManager} from '../routes/cart.router.js'
class SocketHandler{
    constructor(event, callback=undefined, target=undefined,args=undefined){
        this.event = event
        this.callback = callback
        this.target = target
        this.args = args
    }

    reemit(socket){
        if(this.callback){
            console.log(this.event)
            socket.on(this.event, this.callback)
        }
    
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

const renderCartsHandler = async () => {
    const carts = await cartManager.getCarts()
    return new SocketHandler('createCart', undefined,'updateCarts', carts)
}

const handlers = [greetingHandler(), renderMessageHandler()]
const reemiters = [await renderCartsHandler()]
const socketServer = (httpServer, handlers) => {
    const socket = new Server(httpServer)
    socket.on('connection', (conn) =>{
        for (const handler of handlers) {
            conn.on(handler.event, handler.callback)
        }
        for (const reemiter of reemiters) {
            conn.on(reemiter.event, async (e) => {
                console.log(reemiter.args)
                conn.emit(reemiter.target,reemiter.args)
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