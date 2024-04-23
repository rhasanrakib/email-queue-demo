const db = require('../../models')
const CustomerBdInfo = db.customerBdMail
const { MAIL_STATUS } = require('../../common/constants')
const Joi = require('joi');


class CustomerService {
    /**
     * 
     * @param {{name:string,email:string,dob:string, max_try?:number}} dto 
     * @returns {Promise<{[string]:any}>}
     */
    async create(dto) {
        try {
            const customerCreation = await CustomerBdInfo.create(
                {
                    name: dto.name,
                    email: dto.email,
                    dob: dto.dob,
                    mail_status: MAIL_STATUS.PENDING,
                    ...(dto.max_try && { max_try: dto.max_try })
                },
            );
            return customerCreation
        } catch (error) {
            return {
                error: "Sorry! Please try later."
            }
        }
    }

    /**
     * 
     * @param {string} email 
     * @returns 
     */
    async getByMail(email) {
        const customerInfo = await CustomerBdInfo.findAll(
            {
                where: {
                    email: email,
                }
            },
        );
        return customerInfo
    }
    

    /**
     * 
     * @param {{name:string,email:string,dob:string, max_try?:number}} dto 
     * @returns {{[string]:any}}
     */
    dtoValidator(dto) {
        const customerSchema = Joi.object({
            name: Joi.string()
                .min(3)
                .max(30)
                .required(),

            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                .required(),

            dob: Joi.date()
                .required(),
            max_try: Joi.number().optional()
        });

        const { error, value } = customerSchema.validate(dto);

        if (error) {
            return {
                error: error.details[0].message
            }
        } else {
            return {
                data: value
            }
        }

    }

    /**
     * 
     * @param {{name:string,email:string,dob:string, max_try?:number}} dto 
     * @returns {Promise<{[string]:any}>}
     */
    async customerCreation(dto) {
        const validate = this.dtoValidator(dto)
        if (validate.error) {
            return {
                error: validate.error
            }
        }
        const existingCustomer = await this.getByMail(dto.email)
        if (existingCustomer.length) {
            return {
                error: "User already exist."
            }
        }
        return this.create(dto)
    }

}

module.exports = {
    CustomerService
}