const venom = require("venom-bot");

class WhatsAppService {
  static async addToQueue(sessionName, type, params) {
    const client = sessions.get(sessionName);
    if (!client) {
      return { status: "error", message: "Sessão não encontrada" };
    }

    try {
      const queue = messageQueue.getQueue(sessionName);
      await new Promise((resolve, reject) => {
        queue.push(
          {
            type,
            client,
            ...params,
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      return { status: "success", message: `${type} adicionado na fila` };
    } catch (error) {
      return { status: "error", message: error.message };
    }
  }

  async createSession(sessionName, onQrCode) {
    return venom.create(
      sessionName,
      onQrCode,
      (statusSession) => console.log("Status Session:", statusSession),
      {
        multidevice: true,
        headless: "new",
      }
    );
  }

  async isValidWhatsAppNumber(client, phoneNumber) {
    try {
      const formattedNumber = `${phoneNumber}@c.us`;
      const profile = await client.checkNumberStatus(formattedNumber);
      return profile.status === 200;
    } catch (error) {
      console.error("Error checking number validity:", error);
      return false;
    }
  }

  async sendTextMessage(client, phoneNumber, message) {
    const formattedNumber = `${phoneNumber}@c.us`;
    return client.sendText(formattedNumber, message);
  }

  async sendPdfDocument(client, phoneNumber, base64PDF, fileName, message) {
    const formattedNumber = `${phoneNumber}@c.us`;
    return client.sendFileFromBase64(
      formattedNumber,
      base64PDF,
      fileName || "document.pdf",
      message
    );
  }

  formatPhoneNumber(number) {
    return number.includes("@c.us") ? number : `${number}@c.us`;
  }
}

module.exports = new WhatsAppService();
