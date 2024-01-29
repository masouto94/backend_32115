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
    sendEmail = async (from, to, subject, body, bcc= false, attachments=[]) => {
        if (bcc){
            return await Mailer.transporter.sendMail({
                from:from,
                bcc:to,
                subject: subject,
                html: body,
                attachments: attachments
            })
        }
        await Mailer.transporter.sendMail({
            from:from,
            to:to,
            subject: subject,
            html: body,
            attachments: attachments
        })
    }
    userInactivityWarning = async (usersList) => {
        await this.sendEmail("EL TEST <masouto94@gmail.com>",usersList, "Aviso de eliminación de cuenta por inactividad", "<h1>SE VIENE BOCA</h1><div>Ojo que te van a borrar la cuenta en 10 días</div>",true)
    }
    static lele = () => {
        console.log(this.transporter)
    }
}


export{
    Mailer
}