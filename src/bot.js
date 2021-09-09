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
        if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            if (message.author.bot) return;
            message.delete();
            const SayMessage = message.content.slice(4).trim();
            message.channel.send(SayMessage)
        } else {
            console.log("Kādam piss garām!")
        }
    } else {
        return;
    }
});



client.on('message', async message => {
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command == "ticket-setup") {
        // ticket-setup #channel

        let channel = message.mentions.channels.first();
        //if(!channel) return message.reply("Usage: `-ticket-setup #channel`");

        const sent = channel.send(new Discord.MessageEmbed()
            .setTitle("LIVECORE Ticket Sistēma")
            .setDescription("Lai izveidotu ticket spied 🎫!")
            .setFooter("LIVECORE")
            .setColor("33FFFA")
        );

        sent.react('🎫');
        settings.set(`${message.guild.id}-ticket`, sent.id);

        channel.send({embeds: [sent], content: "Ticket Sistēmas uzstādīšana pabeigta!"})
    }

    if(command == "close") {
        if(!message.channel.name.includes("ticket-")) return message.channel.send("Tu nevari to izmantot šeit!")
        message.channel.delete();
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if(user.partial) await user.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();

    if(user.bot) return;

    let ticketid = await settings.get(`${reaction.message.guild.id}-ticket`);

    if(!ticketid) return;

    if(reaction.message.id == ticketid && reaction.emoji.name == '🎫') {
        reaction.users.remove(user);

        reaction.message.guild.channels.create(`ticket-${user.username}`, {
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: reaction.message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                }
            ],
            type: 'text'
        }).then(async channel => {
            channel.send(`<@${user.id}>`, new Discord.MessageEmbed().setTitle("Sveicināti!").setDescription("Lai saņemtu palīdzību raksti šajā kanālā.").setColor("FFFA33"))
        })
    }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);