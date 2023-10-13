import local from 'passport-local'
import * as localStrategies from './strategies/localStrategies.js' 
import {authWithGithub} from './strategies/githubStrategy.js' 
import passport from 'passport'
import { hashPassword, validateHash } from '../utils/encrypter.js'
import { userModel } from '../model/User.js'



const initPassport = () => {
    passport.use('register', localStrategies.registerUser),
    passport.use('login', localStrategies.loginUser)
    passport.use('githubLogin', authWithGithub)

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export{
    passport,
    initPassport
}