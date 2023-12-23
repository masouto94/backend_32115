const socket = io()
socket.emit('greeting','Conectado Realtime en Create')

const fetchData = async (data, url, method="GET", contentType="application/json") => {
  return await fetch(url,
  {
      method: method,  
      mode: "cors",  
      cache: "no-cache", 
      credentials: "same-origin", 
      headers: {
        "Content-Type": contentType 
      },
      redirect: "follow",
      referrerPolicy: "no-referrer", 
      body: data,  
    }).then(r=>r.json())
}

const createProductForm  = document.querySelector("#createProductForm")

const createProduct = (data) =>{
  const formObject = {}
  data.forEach(function(value, key){
    formObject[key] = value
  })
  return JSON.stringify(formObject)
}


createProductForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  let output = createProduct(new FormData(createProductForm))
  let result=await fetchData(output,"/products/create", 'POST')
  console.log(result)

  socket.emit('productsModified')
})
