import express from 'express'
import * as utils from './utils/utils.js'
import {morgan, handlebars} from './utils/middlewares.js'
import {Server} from 'socket.io'
import { router } from './routes/views.router.js'

const app = express()
app.use(morgan('dev'))
app.engine('handlebars', handlebars.engine())
app.set('views', utils.__views)
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(utils.__public))

app.use('/', router)

const httpServer = app.listen(utils.PORT,()=>{
    console.log(`Connected to port ${utils.PORT} - HTTP`)
})
const socketServer = new Server(httpServer)
socketServer.on('connection', (conn) =>{
    conn.on('greeting', (message) => {
        console.log(message.toUpperCase())
    })
    conn.on('inputMessage',(message,target)=>{
        utils.renderMessage(message,target)
    })
})

//Hay que pasar esto al proyecto final y hacer una pagina nueva