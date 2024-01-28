import {schedule} from 'node-cron'
import { userModel } from '../../model/User.js'
const logser = () => console.log("SI",Date.now())

// 0 0 * * *
export const tasks = {
    test: schedule("1 * * * * *",logser).start(),
    getUsers: schedule("1 * * * * *", async () => {
        const now = new Date()
        const monthAgo = new Date(new Date().setMinutes(now.getMinutes() - 3));
        const users = await userModel.find({last_login: {$lte: monthAgo}}).lean()
        console.log(monthAgo)
        console.log(users)
    }).start()
}

