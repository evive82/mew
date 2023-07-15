const cleverbot = require("cleverbot-free");

module.exports = class Cleverbot {
    constructor() {
        this.context = [""];
    }

    // Sending previous responses as context helps to keep the bot on topic. Probably.
    addToContext(message, response) {
        this.context.push(message);
        this.context.push(response);
        while (this.context.length > 5) {
            this.context.shift();
        }
    }

    async speak(message) {
        try {
            const response = await cleverbot(message, this.context);
            this.addToContext(message, response);
            return response;
        }
        catch {
            console.error(error);
            return "Error getting Cleverbot response.";
        }
    }
}