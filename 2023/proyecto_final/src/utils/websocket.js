import {Server} from 'socket.io'

const greeting = (message) => {
    console.log(message.toUpperCase())
}
const greetingHandler = () => {
    return {on: 'greeting', func:greeting}
}

const renderMessage = (message,source) => {
    console.log("#".repeat(10))
    console.log(message)
    console.log("FROM FORM ID=> ", source)
    console.log("#".repeat(10))
}

const renderMessageHandler = () => {
    return {on: 'inputMessage', func:renderMessage}
}

const renderCartsHandler = () => {
    return {on: 'createCart', target:'updateCarts'}
}

const handlers = [greetingHandler(), renderMessageHandler()]
const reemiters = [renderCartsHandler()]
const socketServer = (httpServer, handlers) => {
    const socket = new Server(httpServer)
    socket.on('connection', (conn) =>{
        for (const handler of handlers) {
            conn.on(handler.on, handler.func)
        }
        for (const reemiter of reemiters) {
            conn.on(reemiter.on, () => conn.emit(reemiter.target))
        }
        
    })
}
export{
    socketServer,
    handlers
}