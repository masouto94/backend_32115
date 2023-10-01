import local from 'passport-local'
import * as localStrategies from './strategies/localStrategies.js' 
import passport from 'passport'
import { hashPassword, validateHash } from '../utils/encrypter.js'
import { userModel } from '../model/User.js'



const initPassport = () => {
    passport.use('register', localStrategies.registerUser)
}

export{
    initPassport
}