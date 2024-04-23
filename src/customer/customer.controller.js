const router = require("express").Router();
const { CustomerService } = require('./customer.service')
const { successResponse } = require('../../common/success-response')
const { errorResponse } = require('../../common/error-response')

const service = new CustomerService()


router.post('/register', async (req, res) => {

    const response = await service.customerCreation(req.body)
    if (response.error) {
        return errorResponse(res, response.error, 503, [{ statusCode: 503, message: response.error }])
    }
    return successResponse(res,'Customer registered succesfully',201,response)
});
module.exports = {
    basePath: '/customer',
    router: router
}