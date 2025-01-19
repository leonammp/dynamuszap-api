const Queue = require("better-queue");

class MessageQueueService {
  constructor() {
    this.queues = new Map();
  }

  getQueue(sessionName) {
    if (!this.queues.has(sessionName)) {
      const queue = new Queue(
        async (task, cb) => {
          let attempts = 0;
          const maxAttempts = 3;
          const delay = 3000;

          const tryProcess = async () => {
            try {
              const { type, client, ...params } = task;
              let result;

              switch (type) {
                case "sendText":
                  result = await client.sendText(params.to, params.message);
                  break;
                case "sendPDF":
                  result = await client.sendFileFromBase64(
                    params.to,
                    params.base64PDF,
                    params.fileName,
                    params.message
                  );
                  break;
                case "sendImage":
                  result = await client.sendImageFromBase64(
                    params.to,
                    params.base64Image,
                    params.fileName,
                    params.caption
                  );
                  break;
                default:
                  throw new Error("Tipo de mensagem não suportado");
              }

              console.log(
                `[${sessionName}] Mensagem tipo ${type} enviada para ${params.to}`
              );
              cb(null, { success: true, result });
            } catch (error) {
              attempts++;
              console.error(
                `[${sessionName}] Tentativa ${attempts} falhou: ${error.message}`
              );

              if (attempts < maxAttempts) {
                await new Promise((resolve) => setTimeout(resolve, delay));
                return tryProcess();
              }
              cb(error);
            }
          };

          await tryProcess();
        },
        {
          concurrent: process.env.QUEUE_CONCURRENT || 1,
          maxRetries: process.env.QUEUE_MAX_RETRIES || 3,
          retryDelay: process.env.QUEUE_RETRY_DELAY || 3000,
        }
      );

      this.queues.set(sessionName, queue);
    }

    return this.queues.get(sessionName);
  }
}

module.exports = new MessageQueueService();
