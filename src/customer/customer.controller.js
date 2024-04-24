const router = require("express").Router();
const { CustomerService } = require('./customer.service')
const { successResponse } = require('../../common/success-response')
const { errorResponse } = require('../../common/error-response')
const cron = require('node-cron');
const { MailEvent } = require("./mail-event.service");

const service = new CustomerService()
const INTERVAL_TIME_IN_MIN = 0.5 * 60 * 1000

router.post('/register', async (req, res) => {

    const response = await service.customerCreation(req.body)
    if (response.error) {
        return errorResponse(res, response.error, 503, [{ statusCode: 503, message: response.error }])
    }
    return successResponse(res, 'Customer registered succesfully', 201, response)
});

router.get('', async (req, res) => {
    const response =  await mailSending()
    return successResponse(res, response.message, 201, [])
})

// for reset previous mail status at 12.01am
cron.schedule('1 0 * * *', async () => {
    await service.resetBirthdayStatus()
});

// for sending mails if system restart or mail failed
cron.schedule('0 * * * *', () => {
    console.log('Running a task every hour');
});
async function mailSending() {
    let intervalId = setInterval(async () => {
        console.log("Start interval");
        const response = await service.getMailingData()
        if (!response.length) {
            clearInterval(intervalId)
        }
        const mailEvent = new MailEvent(response)
        mailEvent.emit('send-mail')
    }, INTERVAL_TIME_IN_MIN)

    return {
        message: "Email sending"
    }
}

module.exports = {
    basePath: '/customer',
    router: router
}