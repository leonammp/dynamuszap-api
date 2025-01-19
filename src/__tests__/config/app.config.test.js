describe("App Configuration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("deve usar valores padrão quando variáveis de ambiente não estão definidas", () => {
    const config = require("../../config/app.config");

    expect(config.PORT).toBe(3000);
    expect(config.MAX_REQUEST_SIZE).toBe("10mb");
    expect(config.SESSION_TIMEOUT).toBe(24);
  });

  test("deve usar valores das variáveis de ambiente quando definidas", () => {
    process.env.PORT = "4000";
    process.env.MAX_REQUEST_SIZE = "20mb";
    process.env.SESSION_TIMEOUT = "48";

    const config = require("../../config/app.config");

    expect(config.PORT).toBe("4000");
    expect(config.MAX_REQUEST_SIZE).toBe("20mb");
    expect(config.SESSION_TIMEOUT).toBe(1000 * 60 * 60 * 48);
  });
});
