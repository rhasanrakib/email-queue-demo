'use strict';
const { faker } = require('@faker-js/faker');
const {dayjs} = require('../common/dayjs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = []
    for (let i = 0; i < 10; i++) {
      data.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        dob: dayjs().format('YYYY-MM-DD'),
        mail_status: 'PENDING',
        remain_attempt: 5,
        message: faker.lorem.lines(5)
      })

    }
    await queryInterface.bulkInsert('customer_bd_mail', data)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('customer_bd_mail', null, {});
  }
};
