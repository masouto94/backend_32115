import local from 'passport-local'
import {hashPassword, validateHash} from '../../utils/encrypter.js' 
import { userModel } from '../../model/User.js'

const LocalStrategy = local.Strategy

const registerUser = new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        //Registro de usuario

        const { first_name, last_name, email, age } = req.body

        try {
            const user = await userModel.findOne({ email: email })

            if (user) {
                //Caso de error: usuario existe
                return done(null, false)
            }

            //Crear usuario

            const passwordHash = hashPassword(password)
            const userCreated = await userModel.create({
                first_name: first_name,
                last_name: last_name,
                age: age,
                email: email,
                password: passwordHash
            })

            return done(null, userCreated)

        } catch (error) {
            return done(error)
        }
    })

const loginUser = new LocalStrategy(
    { usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })

            if (!user) {
                return done(null, false)
            }

            if (validateHash(password, user.password)) {
                return done(null, user)
            }

            return done(null, false)

        } catch (error) {
            return done(error)
        }
    })
export {
    LocalStrategy,
    registerUser,
    loginUser
}