// NOTE: We use mariadb not mysql.

// Set the default timezone. Assume always Australia.
const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

const CONFIG = {
  HOST: '',
  USER: '',
  PASSWORD: '',
  DB: '',
  DIALECT: '',
  TIMEZONE: TIME_ZONE,
};

module.exports = CONFIG;
