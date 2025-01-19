const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limitar cada IP a 100 solicitações por windowMs
  message: {
    status: 'erro',
    message: 'Muitas solicitações, por favor tente novamente mais tarde.',
  },
});

module.exports = apiLimiter;