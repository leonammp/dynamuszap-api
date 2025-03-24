const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const APP_CONFIG = require("./config/app.config");
const swaggerSpec = require("./config/swagger.config");
const whatsappRoutes = require("./routes/whatsapp.routes");
const errorHandler = require("./middleware/errorHandler");
const apiLimiter = require("./middleware/rateLimiter");
const authorizeBasic = require("./middleware/authorizeBasic");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: APP_CONFIG.MAX_REQUEST_SIZE }));
app.use(
  express.urlencoded({ limit: APP_CONFIG.MAX_REQUEST_SIZE, extended: true })
);

// Swagger documentação
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Limitação de taxa
app.use("/api/", apiLimiter, authorizeBasic);

// Rotas
app.use("/api/whatsapp", whatsappRoutes);

// Tratamento de erros
app.use(errorHandler);

app.listen(APP_CONFIG.PORT, () => {
  console.log(`Servidor rodando na porta ${APP_CONFIG.PORT}`);
  console.log(
    `Documentação Swagger disponível em ${APP_CONFIG.URLBASE}/api-docs`
  );
});
