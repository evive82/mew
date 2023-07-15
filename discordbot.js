const Cleverbot = require('./chat_bots/cleverbot.js');
const CommandHandler = require('./command_handler.js');
const { Client, Intents } = require('discord.js');

module.exports = class Discord {
    /**
     * @param {
     *     "token": string - bot token,
     *     "botID": string - bot's ID number,
     *     "activity": string - set bot activity status,
     *     "adminUserID": string - ID number of the bot's owner
     * }
     */
    constructor(config) {
        this.prefix = ".";
        this.config = config;
        this.cleverbot = new Cleverbot();
        this.commandHandler = new CommandHandler('discord');
        this.client = new Client({ 
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
                Intents.FLAGS.GUILD_PRESENCES,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.DIRECT_MESSAGES
            ]
        });

        this.client.on('ready', () => {
            console.log('Connected to Discord!');
            this.client.user.setActivity(this.config.activity);
        });

        this.client.login(this.config.token);

        this.client.on('messageCreate', (message) => {
            this.messageHandler(message);
        });
    }

    async messageHandler(message) {
        if (message.author.bot) 
            return;

        const messageData = {
            id: message.id,
            channel: message.channelId,
            guild: message.guildId,
            user: message.member.displayName,
            content: this.stripQuotes(message.content)
        };

        if (messageData.content.startsWith(this.prefix)) {
            const message = messageData.content.substring(this.prefix.length);
            const response = await this.commandHandler.getResponse(message);
            if (!response) return;

            this.sendMessage(response, messageData);
        }
        else if (messageData.content.includes(this.config.botID) ||
            message.type == 'REPLY' && message.mentions.repliedUser.id == this.config.botID) {
            this.sendToCleverbot(messageData);
        }
    }

    stripQuotes(message) {
        const lines = message.split('\n');
        const stripped = [];

        lines.forEach(line => {
            if (!line.startsWith('> ')) {
                stripped.push(line);
            }
        });

        return stripped.join('\n');
    }

    async sendToCleverbot(messageData) {
        try {
            const response = await this.cleverbot.speak(messageData.content);
            this.sendMessage(response, messageData);
        }
        catch {
            console.error(error);
        }
    }

    sendMessage(message, messageData) {
        try {
            const channel = this.client.channels.cache.get(messageData.channel);
            //channel.send(message);
            channel.send({ 
                content: message, 
                reply: { messageReference: messageData.id }
            });
        }
        catch {
            console.error(error);
        }
    }
}
