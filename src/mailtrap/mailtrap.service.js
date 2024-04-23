const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')

class MailTrap {
    constructor(mailUser, mailPass) {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
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
                name: "Test Email",
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
        const mailOptions = {
            from: from,
            to: to,
            subject: 'Birthday Wish',
            html: this.generateMailBody(name, message)
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
