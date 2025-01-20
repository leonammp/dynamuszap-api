const WhatsAppService = require("../services/whatsService.js");
const MenuService = require("../services/MenuService.js");
const Session = require("../models/Session");
const fs = require("fs");
const path = require("path");
class WhatsAppController {
  /**
   * Verifica se o arquivo SingletonLock existe para uma sessão.
   * @param {string} sessionName - Nome da sessão.
   * @returns {boolean} - Retorna true se o arquivo existir, caso contrário false.
   */
  fileSingletonLockExists(sessionName) {
    const filePath = path.join(
      __dirname,
      `../tokens/${sessionName}/SingletonLock`
    );
    return fs.existsSync(filePath);
  }

  async startSession(req, res) {
    const { sessionName } = req.body;

    try {
      // Constrói o caminho do diretório da sessão
      const lockDirPath = path.resolve(
        __dirname,
        "..",
        "..",
        "tokens",
        sessionName
      );

      const client = await WhatsAppService.createSession(
        sessionName,
        (qrCode) => {
          res.json({ status: "success", qrCode });
        }
      );

      Session.add(sessionName, client);

      // client.onMessage((message) => {
      //   console.log('Message received:', message);
      // });

      client.onMessage(async (message) => {
        if (process.env.BOT_ATIVO === "S") {
          console.log("Bot ATIVO");
          try {
            if (MenuService.isDirectMessage(message)) {
              await MenuService.handleMessage(client, message);
            }
            // Mensagens de grupo são silenciosamente ignoradas
          } catch (error) {
            console.error("Erro ao processar a mensagem:", error);
            // Só envia mensagem de erro para mensagens diretas
            if (MenuService.isDirectMessage(message)) {
              await client.sendText(
                message.from,
                "Desculpe, ocorreu um erro. Por favor, tente novamente."
              );
            }
          }
        }
        console.log("Bot INATIVO");
        console.log("Message received:", message);
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async sendMessage(req, res) {
    try {
      const { number, message } = req.body;
      const client = req.whatsappClient;

      const isValidNumber = await WhatsAppService.isValidWhatsAppNumber(
        client,
        number
      );
      if (!isValidNumber) {
        return res.status(400).json({
          status: "error",
          message: "Número de WhatsApp inválido",
        });
      }

      const result = await WhatsAppService.sendTextMessage(
        client,
        number,
        message
      );
      res.json({
        status: "success",
        message: "Mensagem enviada com sucesso",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async checkNumber(req, res) {
    try {
      const { number } = req.body;
      const client = req.whatsappClient;

      const isValid = await WhatsAppService.isValidWhatsAppNumber(
        client,
        number
      );
      res.json({
        status: "success",
        data: {
          number,
          isValid,
          message: isValid
            ? "Número de WhatsApp válido"
            : "Número de WhatsApp inválido",
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async sendPdf(req, res) {
    try {
      const { number, message, base64PDF, pdfPath, fileName } = req.body;
      const client = req.whatsappClient;

      const isValidNumber = await WhatsAppService.isValidWhatsAppNumber(
        client,
        number
      );
      if (!isValidNumber) {
        return res.status(400).json({
          status: "error",
          message: "Número de WhatsApp inválido",
        });
      }

      if (!base64PDF && !pdfPath) {
        return res.status(400).json({
          status: "error",
          message: "É necessário fornecer base64PDF ou pdfPath",
        });
      }

      let result;
      if (base64PDF) {
        result = await WhatsAppService.sendPdfDocument(
          client,
          number,
          base64PDF,
          fileName,
          message
        );
      } else {
        result = await WhatsAppService.sendPdfFromPath(
          client,
          number,
          pdfPath,
          fileName,
          message
        );
      }

      res.json({
        status: "success",
        message: "PDF enviado com sucesso",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async sendImage(req, res) {
    try {
      const { number, caption, base64Image, imagePath } = req.body;
      const client = req.whatsappClient;

      const isValidNumber = await WhatsAppService.isValidWhatsAppNumber(
        client,
        number
      );

      if (!isValidNumber) {
        return res.status(400).json({
          status: "error",
          message: "Número de WhatsApp inválido",
        });
      }

      if (!base64Image && !imagePath) {
        return res.status(400).json({
          status: "error",
          message: "É necessário fornecer base64Image ou imagePath",
        });
      }

      let result;
      if (base64Image) {
        result = await WhatsAppService.sendImageBase64(
          client,
          number,
          base64Image,
          caption
        );
      } else {
        result = await WhatsAppService.sendImage(
          client,
          number,
          imagePath,
          caption
        );
      }

      res.json({
        status: "success",
        message: "Imagem enviada com sucesso",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

module.exports = new WhatsAppController();
