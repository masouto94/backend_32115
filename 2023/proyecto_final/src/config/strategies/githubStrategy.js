import GithubStrategy from 'passport-github2'
import { userModel } from '../../model/User.js'
import { hashPassword } from '../../utils/encrypter.js'

const authWithGithub = new GithubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await userModel.findOne({ email: profile._json.email })
        if (user) {
            done(null, user)
        } else {
            const fullName = profile._json.name?? profile._json.login 
            const splitted = fullName.split(" ")
            const firstName = splitted[0]
            const lastName = splitted.slice(1) ? splitted.slice(1).join(" ") : ' '
            const userCreated = await userModel.create({
                first_name: firstName,
                last_name: lastName,
                email: profile._json.email,
                age: 18,
                password: hashPassword(profile._json.email + profile._json.name)
            })
            done(null, userCreated)
        }

    } catch (error) {
        done(error)
    }
})


export {
    authWithGithub
}