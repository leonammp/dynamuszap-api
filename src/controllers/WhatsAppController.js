const WhatsAppService = require('../services/whatsappService.js');
const Session = require('../models/Session');

class WhatsAppController {
  async startSession(req, res) {
    try {
      const { sessionName } = req.body;
      const client = await WhatsAppService.createSession(sessionName, (qrCode) => {
        res.json({ status: 'success', qrCode });
      });

      Session.add(sessionName, client);

      client.onMessage((message) => {
        console.log('Message received:', message);
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async sendMessage(req, res) {
    try {
      const { number, message } = req.body;
      const client = req.whatsappClient;

      const isValidNumber = await WhatsAppService.isValidWhatsAppNumber(client, number);
      if (!isValidNumber) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid WhatsApp number',
        });
      }

      const result = await WhatsAppService.sendTextMessage(client, number, message);
      res.json({
        status: 'success',
        message: 'Message sent successfully',
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async checkNumber(req, res) {
    try {
      const { number } = req.body;
      const client = req.whatsappClient;

      const isValid = await WhatsAppService.isValidWhatsAppNumber(client, number);
      res.json({
        status: 'success',
        data: {
          number,
          isValid,
          message: isValid ? 'Valid WhatsApp number' : 'Invalid WhatsApp number',
        },
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async sendPdf(req, res) {
    try {
      const { number, message, base64PDF, fileName } = req.body;
      const client = req.whatsappClient;

      const isValidNumber = await WhatsAppService.isValidWhatsAppNumber(client, number);
      if (!isValidNumber) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid WhatsApp number',
        });
      }

      const result = await WhatsAppService.sendPdfDocument(
        client,
        number,
        base64PDF,
        fileName,
        message
      );

      res.json({
        status: 'success',
        message: 'PDF sent successfully',
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }
}

module.exports = new WhatsAppController();
