require("dotenv").config();
const express = require("express")
const app = express()


app.get("/",(req, res) => {
    res.send("Ready!")
  })
  
  app.listen(3000, () => {
    console.log("Up!")
})


const { Client, Intents, Permissions, Message, User, Reaction } = require('discord.js');
const client = new Client({ partials: ["MESSAGE", "USER", "REACTION"], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const Discord = require("discord.js");
const enmap = require('enmap');

const prefix = process.env.PREFIX;

const settings = new enmap({
    name: "settings",
    autoFetch: true,
    cloneLevel: "deep",
    fetchAll: true
});

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
});

client.on('message', async (message) => {
    if (message.content.startsWith(prefix + 'say')) {
        //if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            if (message.author.bot) return;
            message.delete();
            const SayMessage = message.content.slice(4).trim();
            message.channel.send(SayMessage);
        //} else {
           // console.log("Kādam piss garām!")
        //}
    } else {
        return;
    }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);