// NOTE: We use mariadb not mysql.

// Set the default timezone. Assume always Australia.
const process = require("../../.eslintrc");
const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

const CONFIG = {
  HOST: process.env.HOST,
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  DB: process.env.DB,
  DIALECT: process.env.DIALECT,
  TIMEZONE: TIME_ZONE,
};

module.exports = CONFIG;
