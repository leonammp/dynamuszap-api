const errorHandler = require("../../middleware/errorHandler");

describe("Error Handler Middleware", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    console.error = jest.fn(); // Mock console.error
  });

  test("deve retornar status 500 com mensagem de erro personalizada", () => {
    const error = new Error("Erro teste");

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(console.error).toHaveBeenCalledWith(error.stack);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: "erro",
      mensagem: "Erro teste",
    });
  });

  test("deve retornar mensagem padrão quando erro não tem mensagem", () => {
    const error = new Error();

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith({
      status: "erro",
      mensagem: "Erro interno do servidor",
    });
  });
});
