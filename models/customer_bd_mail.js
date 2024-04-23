
const { MAIL_STATUS } = require('../common/constants')

module.exports = (sequelize, DataTypes) => {
    const CustomerBdInfo = sequelize.define('customerBdMail', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            defaultValue: false,
            allowNull: false,
        },
        dob: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        mail_status: {
            type: DataTypes.ENUM,
            defaultValue: 'PENDING',
            allowNull: false,
            values: Object.keys(MAIL_STATUS),
        },
        max_try: {
            type: DataTypes.INTEGER,
            defaultValue: 5,
            allowNull: false,
        }
    }, {
        tableName: 'customer_bd_mail', 
        timestamps: false  
    });
    return CustomerBdInfo
}


