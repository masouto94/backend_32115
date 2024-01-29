import {schedule} from 'node-cron'
import { userModel } from '../../model/User.js'
const logser = () => console.log("SI",Date.now())
import {Mailer} from '../../utils/mailer/mailing.js'

const mailer = new Mailer()
// 0 0 * * *
export const tasks = {

    // warnUsers: schedule("*/10 * * * * *", async () => {
    //     const now = new Date()
    //     const monthAgo = new Date(new Date().setDate(now.getDate() - 20));
    //     const users = await userModel.find({last_login: {$lte: monthAgo}}, {_id:0, email:1}).lean()
    //     // await mailer.userInactivityWarning(users.map(user => user.email)) 
    // }).start(),
    // deleteInactiveUsers: schedule("*/10 * * * * *", async () => {
    //     const deletedUsers = await fetch(`${process.env.HOST}/users/inactiveUsers`,{method:'DELETE', headers:{"authorization": process.env.SESSION_SECRET}})
    //     await mailer.userDeletionNotification(deletedUsers.users)
    // }).start()
}

