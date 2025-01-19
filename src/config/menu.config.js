const MENU_OPTIONS = {
  main: {
    title: "Menu Principal",
    options: [
      { id: "1", label: "Fazer um pedido" },
      { id: "2", label: "Ver status do pedido" },
      { id: "3", label: "Falar com atendente" },
      { id: "4", label: "Horário de funcionamento" },
    ],
  },
  order: {
    title: "Menu de Pedidos",
    options: [
      { id: "1", label: "Pizza" },
      { id: "2", label: "Hamburger" },
      { id: "3", label: "Bebidas" },
      { id: "0", label: "Voltar ao menu principal" },
    ],
  },
  status: {
    title: "Status do Pedido",
    options: [
      { id: "1", label: "Consultar pedido atual" },
      { id: "2", label: "Histórico de pedidos" },
      { id: "0", label: "Voltar ao menu principal" },
    ],
  },
};

module.exports = MENU_OPTIONS;
