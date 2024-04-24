const EventEmitter = require('events');
const config = require('../../config/env-config')
const { MailTrap } = require('../mailtrap/mailtrap.service')
const db = require('../../models')
const CustomerBdInfo = db.customerBdMail

class MailEvent extends EventEmitter {
    /**
     * @param {{id: number;name: string;to: string;from: any;dob: string;mail_status: "PENDING" | "FAILED" | "SUCCESS",remain_attempt: number;}[]} mailData 
     * @param {FunctionConstructor} callback 
     */
    constructor(mailData) {
        super();
        this.mailTrap = new MailTrap(config.mailtrapHost, config.mailtrapUser, config.mailtrapPass)
        this.on("send-mail", async()=>await this.sendEmail(mailData));
    }
    /**
     * 
     * @param {{id: number;name: string;to: string;from: any;dob: string;mail_status: "PENDING" | "FAILED" | "SUCCESS",remain_attempt: number;}[]} mailData 
     */
    async sendEmail(mailData) {
        const mailSentPromise = mailData.map(dt => {
            return this.mailTrap.isMailSent(dt.from, dt.to, dt.message, dt.name)
        })
        const mailSent = await Promise.allSettled(mailSentPromise)
        const updateableData = []
        for (let i = 0; i < mailData.length; i++) {
            console.log("\n\n");
            console.log(mailSent[i]);
            console.log("\n\n");
            if (mailSent[i].status === 'fulfilled' && mailSent[i].value) {
                updateableData.push({
                    id: mailData[i].id,
                    remain_attempt: mailData[i].remain_attempt - 1,
                    mail_status: 'SUCCESS',
                    email: mailData[i].to
                })
            } else {
                updateableData.push({
                    id: mailData[i].id,
                    remain_attempt: mailData[i].remain_attempt - 1,
                    email: mailData[i].to,
                    mail_status: 'PENDING',
                    ...(mailData[i].remain_attempt - 1 === 0 && { mail_status: 'FAILED' })
                })
                console.log("\n\n");
                console.log("failed", mailData[i].id);
                console.log("\n\n");
            }
        }
        await CustomerBdInfo.bulkCreate(updateableData, { updateOnDuplicate: ["mail_status","remain_attempt"] })
    }

}

module.exports = {
    MailEvent
}