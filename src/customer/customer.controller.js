const router = require("express").Router();
const { CustomerService } = require('./customer.service')
const { successResponse } = require('../../common/success-response')
const { errorResponse } = require('../../common/error-response')
const cron = require('node-cron');

const service = new CustomerService()


router.post('/register', async (req, res) => {

    const response = await service.customerCreation(req.body)
    if (response.error) {
        return errorResponse(res, response.error, 503, [{ statusCode: 503, message: response.error }])
    }
    return successResponse(res,'Customer registered succesfully',201,response)
});

// for sending mail at 12.01am
cron.schedule('1 0 * * *', () => {
    console.log('Running a task every hour');
});

// for sending mails if system restart or mail failed
cron.schedule('0 * * * *', () => {
    console.log('Running a task every hour');
});

module.exports = {
    basePath: '/customer',
    router: router
}