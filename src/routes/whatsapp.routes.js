const express = require("express");
const WhatsAppController = require("../controllers/WhatsAppController");
const sessionValidator = require("../middleware/sessionValidator");
const {
  startSessionValidation,
  sendMessageValidation,
  checkNumberValidation,
  sendPdfValidation,
  sendImageValidation,
} = require("../middleware/requestValidator");

const router = express.Router();

/**
 * @swagger
 * /api/whatsapp/start:
 *   post:
 *     summary: Start a new WhatsApp session
 *     tags: [Session]
 *     security:
 *       - BasicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionName
 *             properties:
 *               sessionName:
 *                 type: string
 *                 description: Name for the WhatsApp session
 *     responses:
 *       200:
 *         description: Session started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 qrCode:
 *                   type: string
 *                   description: Base64 QR code image
 */
router.post("/start", startSessionValidation, WhatsAppController.startSession);

/**
 * @swagger
 * /api/whatsapp/{sessionName}/send:
 *   post:
 *     summary: Send a WhatsApp message
 *     tags: [Messages]
 *     security:
 *       - BasicAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionName
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - message
 *             properties:
 *               number:
 *                 type: string
 *                 description: Phone number (10-14 digits)
 *               message:
 *                 type: string
 *                 description: Message to send
 */
router.post(
  "/:sessionName/send",
  sendMessageValidation,
  sessionValidator,
  WhatsAppController.sendMessage
);

/**
 * @swagger
 * /api/whatsapp/{sessionName}/check-number:
 *   post:
 *     summary: Check if a number exists on WhatsApp
 *     tags: [Validation]
 *     security:
 *       - BasicAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionName
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *             properties:
 *               number:
 *                 type: string
 *                 description: Phone number to check (10-14 digits)
 */
router.post(
  "/:sessionName/check-number",
  checkNumberValidation,
  sessionValidator,
  WhatsAppController.checkNumber
);

/**
 * @swagger
 * /api/whatsapp/{sessionName}/send-pdf:
 *   post:
 *     summary: Send a PDF document via WhatsApp
 *     tags: [Documents]
 *     security:
 *       - BasicAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionName
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - base64PDF
 *             properties:
 *               number:
 *                 type: string
 *                 description: Phone number (10-14 digits)
 *               base64PDF:
 *                 type: string
 *                 description: Base64 encoded PDF document
 *               fileName:
 *                 type: string
 *                 description: Optional file name
 *               message:
 *                 type: string
 *                 description: Optional message to send with the PDF
 */
router.post(
  "/:sessionName/send-pdf",
  sendPdfValidation,
  sessionValidator,
  WhatsAppController.sendPdf
);

router.post(
  "/:sessionName/send-image",
  sendImageValidation,
  sessionValidator,
  WhatsAppController.sendImage
);
module.exports = router;
