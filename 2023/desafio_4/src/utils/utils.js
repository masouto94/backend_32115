
import path from 'path'
import {fileURLToPath} from 'url'
import { Server } from 'socket.io'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __views = `${__dirname}/../views`
const __public = `${__dirname}/../public`
const PORT = process.env.PORT || 8080

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

const handlers = [greetingHandler(), renderMessageHandler()]

const socketServer = (httpServer, handlers) => {
    const socket = new Server(httpServer)
    socket.on('connection', (conn) =>{
        for (const handler of handlers) {
            conn.on(handler.on, handler.func)
        }
    })
}
export {
    socketServer,
    handlers,
    __dirname,
    __public,
    __views,
    PORT
}