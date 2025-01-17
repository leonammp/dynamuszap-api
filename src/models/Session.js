class Session {
    constructor() {
      this.sessions = new Map();
    }
  
    add(sessionName, client) {
      this.sessions.set(sessionName, client);
    }
  
    get(sessionName) {
      return this.sessions.get(sessionName);
    }
  
    exists(sessionName) {
      return this.sessions.has(sessionName);
    }
  }
  
  module.exports = new Session();