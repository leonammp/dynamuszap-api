const MENU_OPTIONS = require("../../../src/config/menu.config");

describe("Menu Configuration", () => {
  test("deve conter todos os menus necessários", () => {
    expect(MENU_OPTIONS).toHaveProperty("main");
    expect(MENU_OPTIONS).toHaveProperty("order");
    expect(MENU_OPTIONS).toHaveProperty("status");
  });

  test("menu principal deve ter estrutura correta", () => {
    const main = MENU_OPTIONS.main;
    expect(main.title).toBe("Menu Principal");
    expect(main.options).toHaveLength(4);
    expect(main.options[0]).toEqual({ id: "1", label: "Fazer um pedido" });
  });

  test("menu de pedidos deve ter estrutura correta", () => {
    const order = MENU_OPTIONS.order;
    expect(order.title).toBe("Menu de Pedidos");
    expect(order.options).toHaveLength(4);
    expect(order.options[3]).toEqual({
      id: "0",
      label: "Voltar ao menu principal",
    });
  });

  test("menu de status deve ter estrutura correta", () => {
    const status = MENU_OPTIONS.status;
    expect(status.title).toBe("Status do Pedido");
    expect(status.options).toHaveLength(3);
    expect(status.options[0]).toEqual({
      id: "1",
      label: "Consultar pedido atual",
    });
  });

  test("todos os menus devem ter IDs únicos por seção", () => {
    const checkUniqueIds = (options) => {
      const ids = options.map((opt) => opt.id);
      const uniqueIds = new Set(ids);
      return ids.length === uniqueIds.size;
    };

    expect(checkUniqueIds(MENU_OPTIONS.main.options)).toBeTruthy();
    expect(checkUniqueIds(MENU_OPTIONS.order.options)).toBeTruthy();
    expect(checkUniqueIds(MENU_OPTIONS.status.options)).toBeTruthy();
  });
});
