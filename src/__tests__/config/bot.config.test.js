const BOT_CONFIG = require("../../config/bot.config");

describe("Bot Configuration", () => {
  test("deve conter todas as palavras-chave de ativação necessárias", () => {
    expect(BOT_CONFIG.activationKeywords).toContain("iniciar");
    expect(BOT_CONFIG.activationKeywords).toContain("ativar");
    expect(BOT_CONFIG.activationKeywords).toContain("começar");
    expect(BOT_CONFIG.activationKeywords).toContain("start");
    expect(BOT_CONFIG.activationKeywords.length).toBe(4);
  });

  test("deve conter todas as palavras-chave de desativação necessárias", () => {
    expect(BOT_CONFIG.deactivationKeywords).toContain("parar");
    expect(BOT_CONFIG.deactivationKeywords).toContain("desativar");
    expect(BOT_CONFIG.deactivationKeywords).toContain("encerrar");
    expect(BOT_CONFIG.deactivationKeywords).toContain("stop");
    expect(BOT_CONFIG.deactivationKeywords.length).toBe(4);
  });

  test("deve conter todas as mensagens definidas", () => {
    expect(BOT_CONFIG.welcomeMessage).toBeDefined();
    expect(BOT_CONFIG.activationMessage).toBeDefined();
    expect(BOT_CONFIG.deactivationMessage).toBeDefined();
    expect(BOT_CONFIG.menuNotActiveMessage).toBeDefined();
    expect(BOT_CONFIG.groupMessage).toBeDefined();
  });

  test("deve conter as instruções corretas nas mensagens", () => {
    expect(BOT_CONFIG.welcomeMessage).toContain("ativar");
    expect(BOT_CONFIG.welcomeMessage).toContain("desativar");
    expect(BOT_CONFIG.activationMessage).toContain("menu");
    expect(BOT_CONFIG.deactivationMessage).toContain("ativar");
  });
});
