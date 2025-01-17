const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const APP_CONFIG = require('./config/app.config');
const swaggerSpec = require('./config/swagger.config');
const whatsappRoutes = require('./routes/whatsapp.routes');
const errorHandler = require('./middleware/errorHandler');
const apiLimiter = require('./middleware/rateLimiter');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: APP_CONFIG.MAX_REQUEST_SIZE }));
app.use(express.urlencoded({ limit: APP_CONFIG.MAX_REQUEST_SIZE, extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rate limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api/whatsapp', whatsappRoutes);

// Error handling
app.use(errorHandler);

app.listen(APP_CONFIG.PORT, () => {
  console.log(`Server running on port ${APP_CONFIG.PORT}`);
  console.log(`Swagger documentation available at http://localhost:${APP_CONFIG.PORT}/api-docs`);
});