const { Sequelize, Op, DataTypes } = require("sequelize");
const config = require("./config.js");

const db = {
  // The where option is used to filter the query.
  // There are lots of operators to use for the where clause,
  // available as Symbols from Op.
  Op: Op,
};

// Init sequelize.
db.sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.DIALECT,
    timezone: config.TIMEZONE,
  },
);

// Add models.
require('./initModels')(db, DataTypes);

// Synchronization with back-end, create table when necessary.
db.syncToBackend = async () => {
  await db.sequelize.sync();
  // await db.sequelize.sync({ force: true });
};

module.exports = db;
