const express = require("express");
const request = require("supertest");
const sessionValidator = require("../../middleware/sessionValidator");
const Session = require("../../models/Session");

jest.mock("../../models/Session");

describe("sessionValidator Middleware", () => {
  let app;

  beforeAll(() => {
    app = express();

    // Middleware para simular rotas protegidas pelo sessionValidator
    app.get("/test/:sessionName", sessionValidator, (req, res) => {
      res.status(200).json({ status: "success", message: "Session validated" });
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error if session is not initialized", async () => {
    Session.get.mockReturnValue(null); // Simula sessão inexistente

    const response = await request(app).get("/test/nonexistentSession");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "erro",
      mensagem: "Sessão nonexistentSession não inicializada",
    });
    expect(Session.get).toHaveBeenCalledWith("nonexistentSession");
  });

  it("should proceed if session is initialized", async () => {
    const mockClient = {}; // Simula cliente WhatsApp válido
    Session.get.mockReturnValue(mockClient); // Simula sessão existente

    const response = await request(app).get("/test/validSession");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "success",
      message: "Session validated",
    });
    expect(Session.get).toHaveBeenCalledWith("validSession");
  });
});
