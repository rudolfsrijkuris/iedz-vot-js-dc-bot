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
        const kanalaid = process.env.KANALA_ID;
        const embedi = new MessageEmbed()
            .setTitle("mājas darbi")
            .setDescription("Šeit sūtam mājas darbus, lai varētu špikot viens no otra :smile:")
            .setFooter("~Iedzīvotājs")
            .setColor("#009602");
        
        message.channel.send({ embeds: [new MessageEmbed().setTitle("mājasdarbi").setDescription("Šeit sūtam mājas darbus, lai varētu špikot viens no otra :smile:").setFooter("~Iedzīvotājs").setColor("#009602")] })
    }

    if (message.content.startsWith(prefix + "poll")) {
        if (message.author.bot) return;
        message.delete();
        const channelidkarte = process.env.CHANNEL_IDKARTE;
        const embed = new MessageEmbed()
            .setTitle("Balsošana")
            .setDescription("Vai Jums patīk mans vārds - Iedzīvotājs? Jā-:white_check_mark: Nē-:x:")
            .setFooter("~Iedzīvotājs")
            .setColor("#ff0000");
        message.channel.send({ embeds: [ new MessageEmbed().setTitle("Balsošana").setDescription("Vai Jums patīk mans vārds - Iedzīvotājs? Jā-✔️ Nē-❌").setFooter("~Iedzīvotājs").setColor("#ff0000") ] }).then(embedMessage => {
            embedMessage.react("✔️"),
            embedMessage.react("❌")
        });
    }

    if (message.content.startsWith(prefix + "info")) {
        if (message.author.bot) return;
        message.delete();
        const guild = process.env.GUILD_ID
        const botcon = client.user.displayAvatarURL();
        message.channel.send({ embeds: [ new MessageEmbed()
            .setThumbnail(botcon)
            .setTitle("RTV 10.B klases ciems")
            .setColor("#009602")
            .setDescription("Šis ir 10.B klases discord ciemats, kurā ir laipni gaidīti visi, tās iedzīvotāji.")
            .addField("Izveidošanas datums:", "11/09/2021 2:29 PM")
            .addField("Ciema iedzīvotāju skaits:", "24")
            .setTimestamp()
            .setFooter("~Iedzīvotājs") ] 
        })
    }

    process.on('unhandledRejection', error => {
        console.error('Unhandled promise rejection:', error);
    });

});

client.login(process.env.DISCORDJS_BOT_TOKEN);