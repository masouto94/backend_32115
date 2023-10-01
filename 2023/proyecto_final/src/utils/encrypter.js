import bcrypt from 'bcrypt'

const hashPassword = (password) => {
    const salt = parseInt(process.env.SALT)
    return bcrypt.hashSync(password, bcrypt.genSaltSync(salt))
}

const validateHash = (hashed, stored) => {
    return bcrypt.compareSync(hashed,stored)
}

export{
    hashPassword,
    validateHash
}