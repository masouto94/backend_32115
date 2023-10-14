const productDetailGeneral = (product) =>{
    
    const template = `<div class="product" id="product_${product._id}">
        <h2>${product.title}</h2>
        <img src=${product.thumbnail} alt="" srcset="">
        <ul>
            <li>${product.code}</li>
            <li>${product.price}</li>
            <li>${product.stock}</li>
        </ul>
        <p>${product.description}</p>
    </div>`
    return template
}

export {
    productDetailGeneral
}