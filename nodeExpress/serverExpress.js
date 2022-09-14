const PORT = process.env.PORT || 8082

const express = require('express')
const moment = require("moment");

mensajeBienvenida = () =>{
    const template = `
    <h1 style='color:blue'>Bienvenidos al servidor express</h1>
    `
    return template
}

fechaYHora = () => {
    const dateObject = {
        fyh: moment().format("DD/MM/YY hh:mm:ss")
    }
    return JSON.stringify(dateObject)
  }

//App
const app = express()
server = app.listen(PORT, () => {
    console.log(`Listening port: ${PORT}`);
})
server.on('error', error => console.log(`Error: ${error}`))

//Home
app.get('/', (req,res) =>{
    res.end(mensajeBienvenida())
})

//Visitas
let visitas = 0
app.get('/visitas', (req,res) =>{
    const uptime = new Date(process.uptime() * 1000).toISOString().substr(11, 8);
    

    res.send(`La cantidad de visitas con el server up ${uptime} es ${++visitas}`)
})

//Fecha y hora
app.get('/fyh', (req,res) =>{
    res.end(fechaYHora())
})