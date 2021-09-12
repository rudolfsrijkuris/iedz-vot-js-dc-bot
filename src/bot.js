require("dotenv").config();


const { Client, Intents, Permissions, Discord, MessageEmbed } = require('discord.js');
const client = new Client({ partials: ["MESSAGE", "USER", "REACTION"], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const prefix = process.env.PREFIX;

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
    client.user.setActivity("ciema iedzīvotājus", { type: "WATCHING", name: "Iedzīvotājs" });
});


client.on('message', async (message) => {
    if (message.content.startsWith(prefix + 'say')) {
        if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            if (message.author.bot) return;
            message.delete();
            const SayMessage = message.content.slice(4).trim();
            message.channel.send(SayMessage);
        } else {
            console.log("Kādam piss garām!")
        }
    } else {
        return;
    }
});

client.on('message', async (message) => {
    if (message.content.startsWith(prefix + 'embed')) {
        if (message.author.bot) return;
        message.delete();
        const kanalaid = process.env.KANALA_ID;
        
        message.channel.send({ embeds: [new MessageEmbed()
            .setTitle("mājasdarbi")
            .setDescription("Šeit sūtam mājas darbus, lai varētu špikot viens no otra :smile:")
            .setFooter("~Iedzīvotājs")
            .setColor("#009602")
            .setTimestamp()
        ]})
    }

    if (message.content.startsWith(prefix + "balsot")) {
        if (message.author.bot) return;
        message.delete();
        const channelidkarte = process.env.CHANNEL_IDKARTE;
        message.channel.send({ embeds: [ new MessageEmbed()
            .setTitle("Balsošana")
            .setDescription(/*"Vai pievienot visas trīs 10. klases un pārveidot šo par RTV 10. klašu discordu?"*/ "Jautājums? Jā-✔️ Nē-❌")
            .setFooter("~Iedzīvotājs")
            .setColor("#ff0000") 
        ]}).then(embedMessage => {
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

    if (message.content.startsWith(prefix + "help")) {
        if (message.author.bot) return;
        message.channel.send({ embeds: [ new MessageEmbed() 
            .setTitle("Komandas")
            .setColor("#009602")
            .addField("Komandu prefix:", "?")
            .addField("Informācija par šo discord serveri:", "?info")
            .addField("Ieteikt/piedāvāt kādu ideju vai jebko citu kopīgam balsojumam:", "?ieteikt teksts")
            .setFooter("~Iedzīvotājs")
            .setTimestamp()
        ]})
    }


    if (message.content.startsWith(prefix + "ieteikt")) {
        if (message.author.bot) return;
        const words = message.content.split(" ").splice(1).join(" ")
        message.channel.send({ embeds: [ new MessageEmbed() 
            .setColor("#009602")
            .setTitle(`Ieteikums no **${message.author.tag}**: `)
            .setDescription(`"${words}"`)
            .setFooter("~Iedzīvotājs")
            .setTimestamp()
        ]}).then(embedMessage => {
            embedMessage.react("✔️"),
            embedMessage.react("❌")
        });
    }


    process.on('unhandledRejection', error => {
        console.error('Unhandled promise rejection:', error);
    });


});

client.login(process.env.DISCORDJS_BOT_TOKEN);