const venom = require('venom-bot');

class WhatsAppService {
  async createSession(sessionName, onQrCode) {
    return venom.create(
      sessionName,
      onQrCode,
      (statusSession) => console.log('Status Session:', statusSession),
      {
        multidevice: true,
        headless: true,
      }
    );
  }

  async isValidWhatsAppNumber(client, phoneNumber) {
    try {
      const formattedNumber = `${phoneNumber}@c.us`;
      const profile = await client.checkNumberStatus(formattedNumber);
      return profile.status === 200;
    } catch (error) {
      console.error('Error checking number validity:', error);
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
      fileName || 'document.pdf',
      message
    );
  }
}

module.exports = new WhatsAppService();