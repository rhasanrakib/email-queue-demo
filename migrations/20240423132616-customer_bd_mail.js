'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable('customer_bd_mail', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: false,
        allowNull: false
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: false,
        allowNull: false,
      },
      dob: {
        type: Sequelize.DataTypes.DATEONLY,
        defaultValue: Sequelize.DataTypes.NOW,
        allowNull: false,
      },
      mail_status: {
        type: Sequelize.DataTypes.ENUM,
        defaultValue: 'PENDING',
        allowNull: false,
        values: [
          'PENDING',
          'FAILED',
          'SUCCESS'
        ],
      },
      max_try: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 5,
        allowNull: false,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('customer_bd_mail');
  }
};
