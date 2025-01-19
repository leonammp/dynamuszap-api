require("dotenv").config();
const APP_CONFIG = {
  PORT: process.env.PORT || 3000,
  MAX_REQUEST_SIZE: process.env.MAX_REQUEST_SIZE || "10mb",
  SESSION_TIMEOUT: 1000 * 60 * 60 * process.env.SESSION_TIMEOUT || 24, // 24 horas
};

module.exports = APP_CONFIG;
