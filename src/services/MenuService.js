const Menu = require("../models/Menu");
const BotControl = require("../models/BotControl");
const MENU_OPTIONS = require("../config/menu.config");
const BOT_CONFIG = require("../config/bot.config");

class MenuService {
  constructor() {
    Object.entries(MENU_OPTIONS).forEach(([menuId, menuData]) => {
      Menu.setMenu(menuId, menuData);
    });
  }

  isDirectMessage(message) {
    return !message.from.includes("@g.us");
  }

  formatMenuMessage(menuData) {
    let message = `*${menuData.title}*\n\n`;
    menuData.options.forEach((option) => {
      message += `*${option.id}*. ${option.label}\n`;
    });
    message += "\nDigite o número da opção desejada:";
    return message;
  }

  isActivationMessage(message) {
    return BOT_CONFIG.activationKeywords.includes(message.toLowerCase());
  }

  isDeactivationMessage(message) {
    return BOT_CONFIG.deactivationKeywords.includes(message.toLowerCase());
  }

  async handleInitialMessage(client, userId) {
    await client.sendText(userId, BOT_CONFIG.welcomeMessage);
  }

  async handleMessage(client, message) {
    // Ignora mensagens de grupo
    if (!this.isDirectMessage(message)) {
      return;
    }

    const userId = message.from;
    const userMessage = message.body.trim().toLowerCase();
    const sessionName = client.session;

    // Log da mensagem
    BotControl.logMessage(sessionName, message);

    // Verifica se é primeira mensagem
    if (
      !BotControl.isBotActive(userId) &&
      !this.isActivationMessage(userMessage)
    ) {
      if (userMessage === "oi" || userMessage === "olá") {
        await this.handleInitialMessage(client, userId);
        return;
      }
      await client.sendText(userId, BOT_CONFIG.menuNotActiveMessage);
      return;
    }

    // Processa ativação/desativação
    if (this.isActivationMessage(userMessage)) {
      BotControl.activateBot(sessionName, userId);
      await client.sendText(userId, BOT_CONFIG.activationMessage);
      const mainMenu = Menu.getMenu("main");
      await this.sendMenu(client, userId, mainMenu);
      return;
    }

    if (this.isDeactivationMessage(userMessage)) {
      BotControl.deactivateBot(sessionName, userId);
      Menu.clearUserState(userId);
      await client.sendText(userId, BOT_CONFIG.deactivationMessage);
      return;
    }

    // Se o bot não estiver ativo para este usuário, não processa mensagens
    if (!BotControl.isBotActive(userId)) {
      return;
    }

    // Processa mensagens do menu
    if (userMessage === "menu") {
      const mainMenu = Menu.getMenu("main");
      await this.sendMenu(client, userId, mainMenu);
      Menu.setUserState(userId, {
        menuId: "main",
        lastInteraction: Date.now(),
      });
      return;
    }

    const userState = Menu.getUserState(userId);
    const currentMenu = Menu.getMenu(userState.menuId);
    const selectedOption = currentMenu.options.find(
      (opt) => opt.id === userMessage
    );

    if (selectedOption) {
      switch (userState.menuId) {
        case "main":
          await this.handleMainMenuSelection(client, userId, selectedOption.id);
          break;
        case "order":
          await this.handleOrderMenuSelection(
            client,
            userId,
            selectedOption.id
          );
          break;
        case "status":
          await this.handleStatusMenuSelection(
            client,
            userId,
            selectedOption.id
          );
          break;
      }
    } else {
      await client.sendText(
        userId,
        "Opção inválida. Por favor, escolha uma das opções abaixo:"
      );
      await this.sendMenu(client, userId, currentMenu);
    }
  }

  async handleMainMenuSelection(client, userId, option) {
    switch (option) {
      case "1":
        const orderMenu = Menu.getMenu("order");
        await this.sendMenu(client, userId, orderMenu);
        Menu.setUserState(userId, {
          menuId: "order",
          lastInteraction: Date.now(),
        });
        break;
      case "2":
        const statusMenu = Menu.getMenu("status");
        await this.sendMenu(client, userId, statusMenu);
        Menu.setUserState(userId, {
          menuId: "status",
          lastInteraction: Date.now(),
        });
        break;
      case "3":
        await client.sendText(
          userId,
          "Um atendente entrará em contato em breve. Aguarde um momento."
        );
        break;
      case "4":
        await client.sendText(
          userId,
          "Funcionamos de Segunda a Domingo, das 18h às 23h"
        );
        const mainMenu = Menu.getMenu("main");
        await this.sendMenu(client, userId, mainMenu);
        break;
    }
  }

  async handleOrderMenuSelection(client, userId, option) {
    if (option === "0") {
      const mainMenu = Menu.getMenu("main");
      await this.sendMenu(client, userId, mainMenu);
      Menu.setUserState(userId, {
        menuId: "main",
        lastInteraction: Date.now(),
      });
      return;
    }

    const items = {
      1: "Pizza",
      2: "Hamburger",
      3: "Bebidas",
    };

    if (items[option]) {
      await client.sendText(
        userId,
        `Você selecionou: ${items[option]}\nPor favor, aguarde enquanto processamos seu pedido.`
      );
      const mainMenu = Menu.getMenu("main");
      await this.sendMenu(client, userId, mainMenu);
      Menu.setUserState(userId, {
        menuId: "main",
        lastInteraction: Date.now(),
      });
    }
  }

  async handleStatusMenuSelection(client, userId, option) {
    if (option === "0") {
      const mainMenu = Menu.getMenu("main");
      await this.sendMenu(client, userId, mainMenu);
      Menu.setUserState(userId, {
        menuId: "main",
        lastInteraction: Date.now(),
      });
      return;
    }

    switch (option) {
      case "1":
        await client.sendText(userId, "Você não possui pedidos em andamento.");
        break;
      case "2":
        await client.sendText(userId, "Você não possui histórico de pedidos.");
        break;
    }

    const mainMenu = Menu.getMenu("main");
    await this.sendMenu(client, userId, mainMenu);
    Menu.setUserState(userId, { menuId: "main", lastInteraction: Date.now() });
  }

  async sendMenu(client, userId, menuData) {
    const menuMessage = this.formatMenuMessage(menuData);
    await client.sendText(userId, menuMessage);
  }
}

module.exports = new MenuService();
