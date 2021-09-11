require("dotenv").config();

const { Client, Intents, Permissions, Discord, MessageEmbed } = require('discord.js');
const client = new Client({ partials: ["MESSAGE", "USER", "REACTION"], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const prefix = process.env.PREFIX;

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

client.on('message', async (message) => {
    if (message.content.startsWith(prefix + 'embed')) {
        if (message.author.bot) return;
        message.delete();
        const kanalaid = "885870398682583063"
        const embedi = new MessageEmbed()
            .setTitle("mājas darbi")
            .setDescription("Šeit sūtam mājas darbus, lai varētu špikot viens no otra :smile:")
            .setFooter("~Iedzīvotājs")
            .setColor("#009602");
        
        message.channel.send({ embeds: [new MessageEmbed().setTitle("mājasdarbi").setDescription("Šeit sūtam mājas darbus, lai varētu špikot viens no otra :smile:").setFooter("~Iedzīvotājs").setColor("#009602")] })
    }

    process.on('unhandledRejection', error => {
        console.error('Unhandled promise rejection:', error);
    });

});

client.login(process.env.DISCORDJS_BOT_TOKEN);