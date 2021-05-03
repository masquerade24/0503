const Sequelize = require('sequelize');
const User = require('./user');
const Drug = require('./drug');
const DB_drug = require('./db_drug');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.DB_drug = DB_drug;
db.User = User;
db.Drug = Drug;

DB_drug.init(sequelize);
User.init(sequelize);
Drug.init(sequelize);

DB_drug.associate(db);
User.associate(db);
Drug.associate(db);

module.exports = db;