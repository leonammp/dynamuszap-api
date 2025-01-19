const express = require("express");
const request = require("supertest");
const {
  startSessionValidation,
  sendMessageValidation,
  checkNumberValidation,
  sendPdfValidation,
} = require("../../middleware/requestValidator");

describe("Validation Middleware", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Rotas para cada validação
    app.post("/start-session", startSessionValidation, (req, res) => {
      res.status(200).json({ status: "success", message: "Valid data" });
    });

    app.post(
      "/send-message/:sessionName",
      sendMessageValidation,
      (req, res) => {
        res.status(200).json({ status: "success", message: "Valid data" });
      }
    );

    app.post(
      "/check-number/:sessionName",
      checkNumberValidation,
      (req, res) => {
        res.status(200).json({ status: "success", message: "Valid data" });
      }
    );

    app.post("/send-pdf/:sessionName", sendPdfValidation, (req, res) => {
      res.status(200).json({ status: "success", message: "Valid data" });
    });
  });

  it("should validate startSession input", async () => {
    const response = await request(app)
      .post("/start-session")
      .send({ sessionName: "" }); // Nome inválido

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe("Nome da sessão é obrigatório");
  });

  it("should validate sendMessage input", async () => {
    const response = await request(app)
      .post("/send-message/testSession")
      .send({ number: "123", message: "" }); // Dados inválidos

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe(
      "Formato de número de telefone inválido"
    );
    expect(response.body.errors[1].msg).toBe("Mensagem é obrigatória");
  });

  it("should validate checkNumber input", async () => {
    const response = await request(app)
      .post("/check-number/testSession")
      .send({ number: "invalid" }); // Número inválido

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe(
      "Formato de número de telefone inválido"
    );
  });

  it("should validate sendPdf input", async () => {
    const response = await request(app).post("/send-pdf/testSession").send({
      number: "12345678901",
      base64PDF: "invalid_base64", // Base64 inválido
      message: "Hello",
      fileName: 123, // Nome inválido
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe(
      "Formato de base64 do PDF inválido"
    );
    expect(response.body.errors[1].msg).toBe("Nome de arquivo inválido");
  });

  it("should pass validation for valid data", async () => {
    const response = await request(app).post("/send-pdf/testSession").send({
      number: "12345678901",
      base64PDF: "data:application/pdf;base64,example",
      message: "Hello",
      fileName: "document.pdf",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "success",
      message: "Valid data",
    });
  });
});
