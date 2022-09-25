const express = require('express')
const http = require('http')
const {Server: SocketServer} = require('socket.io')
const app = express()
const httpServer = http.createServer(app)
const socketServer = new SocketServer(httpServer)
const PORT = process.env.PORT || 3000

app.use(express.static('./public'))
app.get('/', (req,res) => {
    res.sendFile('index.html')
})

const mensajes = []
socketServer.on('connection', (client)=>{
    console.log(`Usuario ${client.id} conectado al socket`)
    
    client.emit('handshake', mensajes)
    
    
    client.on('mensaje', mensaje=>{
        const obj = {id: client.id, user: mensaje.user, message:mensaje.message }
        mensajes.push(obj)
        socketServer.sockets.emit('mensajesArray', mensajes)
        client.emit('userSelected')
    })
    
    client.on('disconnect', () => {
        console.log(`Cliente ${client.id} desconectado`)
    })
})

httpServer.listen(PORT, ()=>{
    console.log(`Server levantado en ${PORT}`)
})