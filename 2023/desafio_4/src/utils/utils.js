
import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __views = `${__dirname}/../views`
const __public = `${__dirname}/../public`
const PORT = process.env.PORT || 8080


const renderMessage = (message,source) => {
    console.log("#".repeat(10))
    console.log(message)
    console.log("FROM FORM ID=> ", source)
    console.log("#".repeat(10))
}
export {
    renderMessage,
    __dirname,
    __public,
    __views,
    PORT
}