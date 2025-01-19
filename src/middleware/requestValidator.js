const { validationResult, body, param } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "erro",
      errors: errors.array(),
    });
  }
  next();
};

const startSessionValidation = [
  body("sessionName")
    .trim()
    .notEmpty()
    .withMessage("Nome da sessão é obrigatório")
    .isLength({ min: 3 })
    .withMessage("O nome da sessão deve ter pelo menos 3 caracteres"),
  validate,
];

const sendMessageValidation = [
  param("sessionName")
    .trim()
    .notEmpty()
    .withMessage("Nome da sessão é obrigatório"),
  body("number")
    .trim()
    .notEmpty()
    .withMessage("Número de telefone é obrigatório")
    .matches(/^\d{10,14}$/)
    .withMessage("Formato de número de telefone inválido"),
  body("message").trim().notEmpty().withMessage("Mensagem é obrigatória"),
  validate,
];

const checkNumberValidation = [
  param("sessionName")
    .trim()
    .notEmpty()
    .withMessage("Nome da sessão é obrigatório"),
  body("number")
    .trim()
    .notEmpty()
    .withMessage("Número de telefone é obrigatório")
    .matches(/^\d{10,14}$/)
    .withMessage("Formato de número de telefone inválido"),
  validate,
];

const sendPdfValidation = [
  param("sessionName")
    .trim()
    .notEmpty()
    .withMessage("Nome da sessão é obrigatório"),
  body("number")
    .trim()
    .notEmpty()
    .withMessage("Número de telefone é obrigatório")
    .matches(/^\d{10,14}$/)
    .withMessage("Formato de número de telefone inválido"),
  body("base64PDF")
    .trim()
    .notEmpty()
    .withMessage("Conteúdo do PDF é obrigatório")
    .matches(/^data:application\/pdf;base64,/)
    .withMessage("Formato de base64 do PDF inválido"),
  body("fileName").optional().isString().withMessage("Nome de arquivo inválido"),
  body("message").optional().isString().withMessage("Formato de mensagem inválido"),
  validate,
];

module.exports = {
  startSessionValidation,
  sendMessageValidation,
  checkNumberValidation,
  sendPdfValidation,
};
