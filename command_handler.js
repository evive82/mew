const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const aliases = require('./commands/aliases.json');

module.exports = class CommandHandler {
    /** 
     * @param 'discord' or 'irc'
     */ 
    constructor(source) {
        this.source = source;
        this.commands = new Map();
        this.populateCommands(this.commands);
    }

    async getResponse(message) {
        const parsed = this.parseCommand(message);
        const cmd = await this.commands.get(parsed.command);

        if (!cmd) return false;
        
        const response = await cmd.run(this.source, parsed.args);
        return response;
    }

    parseCommand(message) {
        const command = (message.includes(' ')) ? message.split(' ')[0] : message;
        const args = (message.includes(' ')) ? message.replace(command, '').trim() : '';

        return {
            command: this.checkForAlias(command),
            args: args
        };
    }

    /** 
     * Convert common common command abbreviations to the full commands.
     * Need to find something better.
     */
    checkForAlias(command) {
        return (aliases.hasOwnProperty(command)) ? aliases[command] : command;
    }

    populateCommands(commands) {
        readdir('./commands/', (error, files) => {
            if (error) throw error;
            files.forEach(file => {
                if (!file.endsWith('.js')) return;
                try {
                    const properties = require(`./commands/${file}`);
                    commands.set(properties.cmd.name, properties);
                } 
                catch (error) {
                    throw error;
                }  
            });
        });
    }
}