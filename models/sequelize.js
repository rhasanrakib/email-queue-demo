const { Sequelize } = require('sequelize');
const config = require("../config/config");

const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
  host: config.dbHost,
  port: config.dbPort,
  dialect: 'mysql',

});

module.exports = sequelize;