const BOT_CONFIG = {
  activationKeywords: ["iniciar", "ativar", "começar", "start"],
  deactivationKeywords: ["parar", "desativar", "encerrar", "stop"],
  welcomeMessage: `Olá! Bem-vindo ao nosso atendimento automatizado.
  Para ativar o bot, digite "ativar"
  Para desativar, digite "desativar"`,
  activationMessage:
    "Bot ativado com sucesso! Digite *menu* para ver as opções disponíveis.",
  deactivationMessage: 'Bot desativado. Para reativar, digite "ativar".',
  menuNotActiveMessage: 'O bot está desativado. Para usar, digite "ativar".',
  groupMessage: "Este bot funciona apenas em conversas privadas.",
};

module.exports = BOT_CONFIG;
