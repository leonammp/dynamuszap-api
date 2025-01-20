const APP_CONFIG = require("../config/app.config");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res
      .status(401)
      .json({ message: "Cabeçalho de autorização ausente ou inválido" });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "utf-8"
  );
  const [username, password] = credentials.split(":");

  if (
    username === APP_CONFIG.BASIC_AUTH_USER &&
    password === APP_CONFIG.BASIC_AUTH_PASSWORD
  ) {
    return next();
  }

  res.status(401).json({ message: "Credenciais inválidas" });
};
