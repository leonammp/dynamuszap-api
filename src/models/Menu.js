class Menu {
  constructor() {
    this.menus = new Map();
    this.userStates = new Map();
  }

  setMenu(menuId, options) {
    this.menus.set(menuId, options);
  }

  getMenu(menuId) {
    return this.menus.get(menuId);
  }

  setUserState(userId, state) {
    this.userStates.set(userId, state);
  }

  getUserState(userId) {
    return (
      this.userStates.get(userId) || {
        menuId: "main",
        lastInteraction: Date.now(),
      }
    );
  }

  clearUserState(userId) {
    this.userStates.delete(userId);
  }
}

module.exports = new Menu();
