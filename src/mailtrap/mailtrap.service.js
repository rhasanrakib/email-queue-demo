const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')

class MailTrap {
    constructor(mailHost, mailUser, mailPass) {
        this.transporter = nodemailer.createTransport({
            host: mailHost,
            port: 2525,
            auth: {
                user: mailUser,
                pass: mailPass,
            }
        });
        if (MailTrap._instance) {
            return MailTrap._instance
        }

        MailTrap._instance = this
    }

    /**
     * 
     * @param {string} name 
     * @param {string} message 
     * @returns 
     */
    generateMailBody(name, message) {
        const MailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "Rakib",
                link: 'https://mailgen.js/'
            }
        })
        const email = {
            body: {
                name: name,
                intro: message || 'Happy Birthday',
            }
        }
        const emailBody = MailGenerator.generate(email);
        return emailBody
    }

    /**
     * 
     * @param {string} from 
     * @param {string} to 
     * @param {string} message 
     * @param {string} name 
     * @returns 
     */
    async isMailSent(from, to, message, name) {
        const templateHtml = this.generateMailBody(name, message)
        const mailOptions = {
            from: from,
            to: to,
            subject: 'Birthday Wish',
            html: templateHtml
        };
        const mailRes = await this.transporter.sendMail(mailOptions);
        if (mailRes.accepted) {
            return true
        } else {
            return false
        }
    }

}

module.exports = {
    MailTrap
};
