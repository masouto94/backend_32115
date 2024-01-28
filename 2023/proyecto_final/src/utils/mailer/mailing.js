import { createTransport } from "nodemailer";

const transport = createTransport({
    service: 'gmail',
    auth: {
        user: 'masouto94@gmail.com',
        pass: process.env.MAILER_PASS
    }
})

class Mailer{
    static transporter = transport
    sendEmail = async (from, to, subject, body, attachments=[]) => {
        await Mailer.transporter.sendMail({
            from:from,
            to:to,
            subject: subject,
            html: body,
            attachments: attachments
        })
    }
    userInactivityWarning = async () => {
        await this.sendEmail("EL TEST <masouto94@gmail.com>","masouto94@gmail.com", "Esto es un mail", "<h1>SE VIENE BOCA</h1>")
    }
    static lele = () => {
        console.log(this.transporter)
    }
}


export{
    Mailer
}