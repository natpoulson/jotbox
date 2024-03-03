const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    'jotbox_test_db',
    process.env.DB_USER,
    process.env.DB_PWD,
    {
        host: 'localhost',
        dialect: 'mysql',
        port: '3006'
    }
);

module.exports = sequelize;