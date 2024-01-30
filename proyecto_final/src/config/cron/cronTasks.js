import {schedule} from 'node-cron'
import { userModel } from '../../model/User.js'
import {Mailer} from '../../utils/mailer/mailing.js'

const mailer = new Mailer()
//El cron corre a las  00:00 UTC para revisar los usuarios previos a eliminar y borrar los que se tienen que eliminar
export const tasks = {

    warnUsers: schedule("0 0 * * *", async () => {
        const now = new Date()
        const monthAgo = new Date(new Date().setDate(now.getDate() - 20));
        const users = await userModel.find({last_login: {$lte: monthAgo}}, {_id:0, email:1}).lean()
        await mailer.userInactivityWarning(users.map(user => user.email)) 
    }).start(),
    deleteInactiveUsers: schedule("0 0 * * *", async () => {
        await fetch(`${process.env.HOST}/users/inactiveUsers`,{method:'DELETE', headers:{"authorization": process.env.SESSION_SECRET}})
    }).start()
}

