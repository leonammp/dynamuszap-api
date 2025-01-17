const { validationResult, body, param } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: errors.array(),
    });
  }
  next();
};

const startSessionValidation = [
  body("sessionName")
    .trim()
    .notEmpty()
    .withMessage("Session name is required")
    .isLength({ min: 3 })
    .withMessage("Session name must be at least 3 characters long"),
  validate,
];

const sendMessageValidation = [
  param("sessionName")
    .trim()
    .notEmpty()
    .withMessage("Session name is required"),
  body("number")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\d{10,14}$/)
    .withMessage("Invalid phone number format"),
  body("message").trim().notEmpty().withMessage("Message is required"),
  validate,
];

const checkNumberValidation = [
  param("sessionName")
    .trim()
    .notEmpty()
    .withMessage("Session name is required"),
  body("number")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\d{10,14}$/)
    .withMessage("Invalid phone number format"),
  validate,
];

const sendPdfValidation = [
  param("sessionName")
    .trim()
    .notEmpty()
    .withMessage("Session name is required"),
  body("number")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\d{10,14}$/)
    .withMessage("Invalid phone number format"),
  body("base64PDF")
    .trim()
    .notEmpty()
    .withMessage("PDF content is required")
    .matches(/^data:application\/pdf;base64,/)
    .withMessage("Invalid PDF base64 format"),
  body("fileName").optional().isString().withMessage("Invalid file name"),
  body("message").optional().isString().withMessage("Invalid message format"),
  validate,
];

module.exports = {
  startSessionValidation,
  sendMessageValidation,
  checkNumberValidation,
  sendPdfValidation,
};
