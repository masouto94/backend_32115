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
        if(! usersList){
            return
        }
        await this.sendEmail("App admin <masouto94@gmail.com>",usersList, "Advertencia de eliminación de cuenta por inactividad", 
        `<h1>LOGUEATE</h1>
        <div>O si no te vamos a borrar la cuenta en <b>10 días</b> por inactividad</div>
        <div>Accedé a <a href="${process.env.HOST}/login">este enlace</a> para loguearte y prevenirlo</div>
        `,true)
    }

    userDeletionNotification = async (usersList) => {
        if(! usersList){
            return
        }
        await this.sendEmail("App admin <masouto94@gmail.com>",usersList, "Aviso de eliminación de cuenta por inactividad", 
        `<h1>TARDE</h1>
        <div>Te borramos la cuenta y perdiste todo</div>
        <div>Accedé <a href="${process.env.HOST}/login">este enlace</a> para crear una nueva cuenta </div>
        `,true)
    }

}


export{
    Mailer
}