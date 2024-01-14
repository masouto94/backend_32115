const isUserName = (username) =>{
    if(username.match(/^\w+.\w+$/g)){
        return true
    }
    return false
}
class InvalidUserNameError extends Error{
    constructor(message) {
        super(message);
        this.name = "InvalidUserNameError";
      }
}
const isEmail = (email) => {
    if(email.match(/^\S+@\S+\.\S+$/g)){
        return true
    }
    return false
}

class InvalidEmailError extends Error{
    constructor(message) {
        super(message);
        this.name = "InvalidEmailError";
      }
}

export {
    isUserName,
    isEmail,
    InvalidEmailError,
    InvalidUserNameError
}
