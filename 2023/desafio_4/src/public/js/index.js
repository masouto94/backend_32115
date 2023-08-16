const socket = io()
socket.emit('greeting','este es un mensaje en mayuscula')

const formData = document.querySelector('#testForm')

const show = async (e) =>{
    e.preventDefault()
    const valor = document.querySelector('#content').value
    console.log(valor)
    socket.emit('inputMessage',valor, formData.id)
    return 
}
formData.addEventListener('submit', show)