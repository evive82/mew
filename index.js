require('dotenv').config();
const Discord = require('./discordbot.js');

const discord = new Discord(JSON.parse(process.env.DISCORD_CONFIG));

