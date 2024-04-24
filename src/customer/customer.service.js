const db = require('../../models')
const CustomerBdInfo = db.customerBdMail
const { MAIL_STATUS } = require('../../common/constants')
const Joi = require('joi');
const sequelize = require('sequelize')
const config = require('../../config/env-config')
const { dayjs } = require('../../common/dayjs');

class CustomerService {

    constructor() {
        if (CustomerService._instance) {
            return CustomerService._instance
        }

        CustomerService._instance = this
    }
    /**
     * 
     * @param {{name:string,email:string,dob:string, remain_attempt?:number}} dto 
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
                    ...(dto.remain_attempt && { remain_attempt: dto.remain_attempt }),
                    ...(dto.message && { message: dto.message })
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
    async getOneByMail(email) {
        const customerInfo = await CustomerBdInfo.findOne(
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
     * @param {number} id 
     * @returns 
     */
    async getOneById(id) {
        const customerInfo = await CustomerBdInfo.findOne(
            {
                where: {
                    id: id,
                }
            },
        );
        return customerInfo
    }

    /**
     * 
     * @param {string} month 
     * @param {string} day 
     * @returns 
     */
    async findPendingBirthdayMail(month, day) {
        const customerInfo = await CustomerBdInfo.findAll(
            {
                where: {
                    [sequelize.Op.and]: [
                        sequelize.where(
                            sequelize.fn('DATE_FORMAT', sequelize.col('dob'), '%m-%d'), // MySQL date format function
                            `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
                        ), {
                            mail_status: {
                                [sequelize.Op.or]: ['FAILED', 'PENDING']
                            },
                            remain_attempt: {
                                [sequelize.Op.not]: 0
                            }
                        }]
                }
            },
        );
        return customerInfo
    }
    /**
     * 
     * @param {string} month 
     * @param {string} day 
     * @returns 
     */
    async findBirthday(month, day) {
        const customerInfo = await CustomerBdInfo.findAll(
            {
                where: {
                    [sequelize.Op.and]: [
                        sequelize.where(
                            sequelize.fn('DATE_FORMAT', sequelize.col('dob'), '%m-%d'), // MySQL date format function
                            `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
                        ), {
                            remain_attempt: {
                                [sequelize.Op.not]: 0
                            }
                        }]
                }
            },
        );
        return customerInfo
    }


    /**
     * 
     * @param {{name:string,email:string,dob:string, remain_attempt?:number}} dto 
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
            remain_attempt: Joi.number().optional(),
            message: Joi.string().optional()
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
     * @param {{name:string,email:string,dob:string, remain_attempt?:number}} dto 
     * @returns {Promise<{[string]:any}>}
     */
    async customerCreation(dto) {
        const validate = this.dtoValidator(dto)
        if (validate.error) {
            return {
                error: validate.error
            }
        }
        const existingCustomer = await this.getOneByMail(dto.email)
        if (existingCustomer) {
            return {
                error: "User already exist."
            }
        }
        return this.create(dto)
    }

    async getMailingData() {
        const today = dayjs();
        const month = today.month() + 1;
        const day = today.date();
        const allBdToday = await this.findPendingBirthdayMail(month, day)
        return this.formatForMail(allBdToday)

    }

    /**
     * 
     * @param { { "id": number, "name": string, "email": string,"dob": string,"mail_status": "PENDING"|"FAILED"|"SUCCESS","remain_attempt": number}[]} data 
     * @returns
     **/

    formatForMail(data) {
        return data.map(dt => {
            return {
                id: dt.id,
                name: dt.name,
                to: dt.email,
                from: config.mailtrapUser,
                dob: dt.dob,
                mail_status: dt.mail_status,
                remain_attempt: dt.remain_attempt
            }
        })
    }


    async resetBirthdayStatus() {
        const today = dayjs();
        const month = today.month() + 1;
        const day = today.date();
        const bdData = await this.findBirthday(month, day)
        const updateableData = bdData.map(dt=>{
            return {
                ...dt,
                mail_status: MAIL_STATUS.PENDING,
                remain_attempt: 5
            }
        })
        await CustomerBdInfo.bulkCreate(updateableData, { updateOnDuplicate: ["mail_status","remain_attempt"] })
    }



}

module.exports = {
    CustomerService
}