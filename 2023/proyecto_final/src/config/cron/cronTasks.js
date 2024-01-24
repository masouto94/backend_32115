import {schedule} from 'node-cron'
import { userModel } from '../../model/User.js'
const logser = () => console.log("SI",Date.now())

export const tasks = {
    test: schedule("1 * * * * *",logser).start(),
    getUsers: schedule("1 * * * * *", async () => {
        const now = new Date()
        const monthAgo = new Date(new Date().setDate(now.getDate() - 30));
        const users = await userModel.find({last_login: {$gte: monthAgo}}).lean()
        console.log(users)
    }).start()
}