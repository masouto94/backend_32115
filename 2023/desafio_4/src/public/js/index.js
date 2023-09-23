const socket = io()
socket.emit('greeting','Bienvenido al websocket')

const formData = document.querySelectorAll('.former')

const show = async (e) =>{
    e.preventDefault()
    const valor = e.target.querySelector('.inputContent').value
    socket.emit('inputMessage',valor, e.target.id)
    return 
}
formData.forEach(form => form.addEventListener('submit', show))