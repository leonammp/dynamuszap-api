describe("Swagger Configuration", () => {
  let swaggerConfig;

  beforeEach(() => {
    jest.resetModules();
    swaggerConfig = require("../../../src/config/swagger.config");
  });

  test("deve ter opções básicas definidas", () => {
    const options = swaggerConfig;
    expect(options.openapi).toBe("3.0.0");
    expect(options.info).toBeDefined();
  });

  test("deve ter informações do serviço corretas", () => {
    const options = swaggerConfig;
    expect(options.info).toEqual({
      title: "API do WhatsApp",
      version: "1.0.0",
      description: "API do WhatsApp usando venom-bot",
    });
  });

  test("deve ter configuração de servidor padrão", () => {
    const options = swaggerConfig;
    expect(options.servers).toHaveLength(1);
    expect(options.servers[0]).toEqual({
      url: "http://localhost:3000",
      description: "Servidor de desenvolvimento",
    });
  });

  test("deve ter schema de erro definido", () => {
    const options = swaggerConfig;
    const errorSchema = options.components.schemas.Error;

    expect(errorSchema).toEqual({
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "error",
        },
        message: {
          type: "string",
          example: "Mensagem de erro",
        },
      },
    });
  });
});
