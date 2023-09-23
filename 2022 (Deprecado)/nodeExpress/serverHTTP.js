const PORT = process.env.PORT || 8082

const http = require('http')
const moment = require("moment");

mensaje = () =>{
    const hora = new Date().getHours()
    if(hora >= 6 && hora <= 12){
        return 'Buenos Dias'
    } else if (hora >= 13 && hora <=19){
        return 'Buenas Tardes'
    } else{
        return 'Buenas Noches'
    }
}

const app = http.createServer((req,res) =>{
    res.end(mensaje())
})

app.listen(PORT, () => {
    console.log(`Listening port: ${PORT}`);
})