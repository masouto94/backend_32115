const isUserName = (username) =>{
    if(username.match(/^\w+.\w+$/g)){
        return true
    }
    return false
}

const isEmail = (email) => {
    if(email.match(/^\S+@\S+\.\S+$/g)){
        return true
    }
    return false
}


export {
    isUserName,
    isEmail
}
