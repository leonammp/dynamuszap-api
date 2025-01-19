const WhatsAppController = require("../../controllers/WhatsAppController");
const WhatsAppService = require("../../services/whatsappService");
const MenuService = require("../../services/MenuService");
const Session = require("../../models/Session");

jest.mock("../../services/whatsappService");
jest.mock("../../services/MenuService");
jest.mock("../../models/Session");

describe("WhatsAppController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      whatsappClient: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("startSession", () => {
    it("should start a new WhatsApp session and return a QR code", async () => {
      const mockClient = {
        onMessage: jest.fn(),
      };
      const mockQRCode = "mock-qr-code";
      req.body.sessionName = "test-session";

      WhatsAppService.createSession.mockImplementationOnce(
        (sessionName, callback) => {
          callback(mockQRCode);
          return Promise.resolve(mockClient);
        }
      );

      await WhatsAppController.startSession(req, res);

      expect(WhatsAppService.createSession).toHaveBeenCalledWith(
        "test-session",
        expect.any(Function)
      );
      expect(Session.add).toHaveBeenCalledWith("test-session", mockClient);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        qrCode: mockQRCode,
      });
    });

    it("should handle errors when starting a session", async () => {
      const mockError = new Error("Session creation failed");
      WhatsAppService.createSession.mockRejectedValueOnce(mockError);

      await WhatsAppController.startSession(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: mockError.message,
      });
    });
  });

  describe("sendMessage", () => {
    it("should send a WhatsApp message successfully", async () => {
      req.body = { number: "123456789", message: "Hello, World!" };
      WhatsAppService.isValidWhatsAppNumber.mockResolvedValueOnce(true);
      WhatsAppService.sendTextMessage.mockResolvedValueOnce("Message sent");

      await WhatsAppController.sendMessage(req, res);

      expect(WhatsAppService.isValidWhatsAppNumber).toHaveBeenCalledWith(
        req.whatsappClient,
        "123456789"
      );
      expect(WhatsAppService.sendTextMessage).toHaveBeenCalledWith(
        req.whatsappClient,
        "123456789",
        "Hello, World!"
      );
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Mensagem enviada com sucesso",
        data: "Message sent",
      });
    });

    it("should handle invalid WhatsApp numbers", async () => {
      req.body = { number: "invalid", message: "Hello, World!" };
      WhatsAppService.isValidWhatsAppNumber.mockResolvedValueOnce(false);

      await WhatsAppController.sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Número de WhatsApp inválido",
      });
    });

    it("should handle errors during message sending", async () => {
      const mockError = new Error("Failed to send message");
      WhatsAppService.isValidWhatsAppNumber.mockResolvedValueOnce(true);
      WhatsAppService.sendTextMessage.mockRejectedValueOnce(mockError);

      await WhatsAppController.sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: mockError.message,
      });
    });
  });

  describe("checkNumber", () => {
    it("should validate a WhatsApp number", async () => {
      req.body = { number: "123456789" };
      WhatsAppService.isValidWhatsAppNumber.mockResolvedValueOnce(true);

      await WhatsAppController.checkNumber(req, res);

      expect(WhatsAppService.isValidWhatsAppNumber).toHaveBeenCalledWith(
        req.whatsappClient,
        "123456789"
      );
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: {
          number: "123456789",
          isValid: true,
          message: "Número de WhatsApp válido",
        },
      });
    });

    it("should handle errors during number validation", async () => {
      const mockError = new Error("Validation failed");
      WhatsAppService.isValidWhatsAppNumber.mockRejectedValueOnce(mockError);

      await WhatsAppController.checkNumber(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: mockError.message,
      });
    });
  });

  describe("sendPdf", () => {
    it("should send a PDF document successfully", async () => {
      req.body = {
        number: "123456789",
        message: "Here is your document",
        base64PDF: "mockBase64Data",
        fileName: "document.pdf",
      };
      WhatsAppService.isValidWhatsAppNumber.mockResolvedValueOnce(true);
      WhatsAppService.sendPdfDocument.mockResolvedValueOnce("PDF sent");

      await WhatsAppController.sendPdf(req, res);

      expect(WhatsAppService.isValidWhatsAppNumber).toHaveBeenCalledWith(
        req.whatsappClient,
        "123456789"
      );
      expect(WhatsAppService.sendPdfDocument).toHaveBeenCalledWith(
        req.whatsappClient,
        "123456789",
        "mockBase64Data",
        "document.pdf",
        "Here is your document"
      );
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "PDF enviado com sucesso",
        data: "PDF sent",
      });
    });

    it("should handle invalid WhatsApp numbers when sending a PDF", async () => {
      req.body = {
        number: "invalid",
        message: "Here is your document",
        base64PDF: "mockBase64Data",
        fileName: "document.pdf",
      };
      WhatsAppService.isValidWhatsAppNumber.mockResolvedValueOnce(false);

      await WhatsAppController.sendPdf(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Número de WhatsApp inválido",
      });
    });

    it("should handle errors during PDF sending", async () => {
      const mockError = new Error("Failed to send PDF");
      WhatsAppService.isValidWhatsAppNumber.mockResolvedValueOnce(true);
      WhatsAppService.sendPdfDocument.mockRejectedValueOnce(mockError);

      await WhatsAppController.sendPdf(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: mockError.message,
      });
    });
  });
});
