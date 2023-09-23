const socketClient = io()

const form = document.getElementById("formulario")
const inputName = document.getElementById("nombre")
const inputValor = document.getElementById("valor")
const lista = document.getElementById("lista")

const generateText = (messages, domElement) =>{
    let listado = messages.map(element => `<li>${element.user}: ${element.message}</li>` ).join(' ')
    domElement.innerHTML=listado
}

form.onsubmit = (event) => {
    event.preventDefault()
    const data = {user: inputName.value, message: inputValor.value}
    if(Object.values(data).every(Boolean)){
        socketClient.emit('mensaje', data)
        inputValor.value = ''
    }
}

socketClient.on('mensajesArray', mensajes => {
    console.log(mensajes)
    generateText(mensajes,lista)
})

socketClient.on('handshake', mensajes => {
    generateText(mensajes, lista)
})

socketClient.on('userSelected', ()=>{
    inputName.disabled=true
})