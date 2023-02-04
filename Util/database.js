const Sequelize = require('sequelize');
const dbCredentials = require('../config/dbCredentials.config');
// const dockerCredentials = require('../config/docker.config');

const sequelize = new Sequelize(
  dbCredentials.DB_NAME,
  dbCredentials.DB_USERNAME,
  dbCredentials.DB_PASSWORD,
  {
    host: dbCredentials.DB_HOST,
    dialect: dbCredentials.DB_DIALECT,
  })

module.exports = sequelize;