class BotControl {
  constructor() {
    this.activeSessions = new Map();
    this.activeNumbers = new Set();
    this.messageLog = new Map();
  }

  activateBot(sessionName, number) {
    if (!this.activeSessions.has(sessionName)) {
      this.activeSessions.set(sessionName, new Set());
    }
    this.activeSessions.get(sessionName).add(number);
    this.activeNumbers.add(number);
  }

  deactivateBot(sessionName, number) {
    if (this.activeSessions.has(sessionName)) {
      this.activeSessions.get(sessionName).delete(number);
    }
    this.activeNumbers.delete(number);
  }

  isBotActive(number) {
    return this.activeNumbers.has(number);
  }

  getSessionStatus(sessionName) {
    return {
      activeUsers: Array.from(this.activeSessions.get(sessionName) || []),
      totalActive: this.activeSessions.get(sessionName)?.size || 0,
    };
  }

  logMessage(sessionName, message) {
    if (!this.isGroupMessage(message)) {
      if (!this.messageLog.has(sessionName)) {
        this.messageLog.set(sessionName, []);
      }
      this.messageLog.get(sessionName).push({
        timestamp: new Date(),
        from: message.from,
        body: message.body,
        type: "direct",
      });
    }
  }

  isGroupMessage(message) {
    return message.from.includes("@g.us");
  }

  getMessageLog(sessionName) {
    return this.messageLog.get(sessionName) || [];
  }

  getStats(sessionName) {
    const logs = this.getMessageLog(sessionName);
    return {
      totalDirectMessages: logs.length,
      activeUsers: this.getSessionStatus(sessionName).totalActive,
      lastMessage: logs[logs.length - 1],
    };
  }
}

module.exports = new BotControl();
