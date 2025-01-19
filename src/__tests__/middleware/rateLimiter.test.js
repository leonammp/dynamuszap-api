const express = require("express");
const request = require("supertest");
const rateLimiter = require("../../middleware/rateLimiter");

describe("RateLimiter Middleware", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(rateLimiter);
    app.get("/test", (req, res) => {
      res.status(200).json({ status: "success", message: "Request succeeded" });
    });
  });

  it("should allow requests within the rate limit", async () => {
    const responses = [];
    for (let i = 0; i < 5; i++) {
      const response = await request(app).get("/test");
      responses.push(response);
    }

    responses.forEach((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: "Request succeeded",
      });
    });
  });

  it("should block requests exceeding the rate limit", async () => {
    const maxRequests = 100;
    const timeWindow = 15 * 60 * 1000; // 15 minutos

    // Fazer 100 solicitações para atingir o limite
    for (let i = 0; i < maxRequests; i++) {
      await request(app).get("/test");
    }

    // A 101ª solicitação deve ser bloqueada
    const response = await request(app).get("/test");

    expect(response.status).toBe(429); // Status de Too Many Requests
    expect(response.body).toEqual({
      status: "erro",
      message: "Muitas solicitações, por favor tente novamente mais tarde.",
    });

    // Aguarde o tempo da janela e teste novamente (opcional)
    jest.useFakeTimers();
    jest.advanceTimersByTime(timeWindow);

    const resetResponse = await request(app).get("/test");
    expect(resetResponse.status).toBe(200);
    expect(resetResponse.body).toEqual({
      status: "success",
      message: "Request succeeded",
    });

    jest.useRealTimers();
  });
});
