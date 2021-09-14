require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();

const { Client, Intents, Permissions, Discord, MessageEmbed, voiceStateUpdate } = require('discord.js');
const client = new Client({ partials: ["MESSAGE", "USER", "REACTION"], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const prefix = process.env.PREFIX;
const ytdl = require('ytdl-core');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});



/* function startKeepAlive() {
    setInterval(function() {
        const options = {
            host: '0.0.0.0',
            port: process.env.PORT,
            path: '/'
        };
        http.get(options, function(res) {
            res.on('data', function(chunk) {
                try {
                    console.log("HEROKU RESPONSE: " + chunk);
                } catch (err) {
                    console.log(err.message);
                }
            });
        }).on('error', function(err) {
            console.log("Error: " + err.message);
        });
    }, 20 * 60 * 1000);
} */

const roleClaim = require('./role-claim');
const verify = require('./verify');

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
    client.user.setActivity("ciema iedzīvotājus", { type: "WATCHING", name: "Iedzīvotājs" });

    client.setMaxListeners(30);

    roleClaim(client); // reaction roles
    verify(client); // verify role
});

///  JAUNS VOICE KANĀLS  ///

client.on('messageCreate', async (message) => {
    if (message.content.startsWith(prefix + "voice")) {
        if (message.author.bot) return;
        
        const args = message.content.split(' ').slice(1);
        const name = args.join();

        message.guild.channels.create(name, {
            type: 'GUILD_VOICE',
            //permissionOverwrites: [
            //    {
            //        id: message.guild.roles.everyone, //To make it be seen by a certain role, user an ID instead
            //        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
            //    }
            //],
        })
            .then((channel) => {
                const categoryID = process.env.CATEGORY_ID;
                channel.setParent(categoryID)
            })
    }

});

client.on('messageCreate', async (message) => {
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

///  KOMANDAS  ///

client.on('messageCreate', async (message) => {
    if (message.content.startsWith(prefix + 'embed')) {
        if (message.author.bot) return;
        message.delete();
        const kanalaid = process.env.KANALA_ID;
        
        message.channel.send({ embeds: [new MessageEmbed()
            .setTitle("**Akmens, šķēres papīrīts**")
            .addField("**Komanda:**", "?rps akmens | skeres | papirits")
            .setFooter("~Iedzīvotājs")
            .setColor("#009602")
            .setTimestamp()
        ]})
    }
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith(prefix + 'tpg')) {
        if (message.author.bot) return;
        message.delete();
        const kanalaid = process.env.KANALA_ID;
        
        message.channel.send({ embeds: [new MessageEmbed()
            .setTitle("**Tev piss garām**")
            .setFooter("~Iedzīvotājs")
            .setColor("#009602")
            .setTimestamp()
        ]})
    }
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith(prefix + 'nemīz')) {
        if (message.author.bot) return;
        //message.delete();
        const kanalaid = process.env.KANALA_ID;
        
        message.channel.send({ embeds: [new MessageEmbed()
            .setTitle("**Īsti veči mīž tikai no alus un, no arbūza**")
            .setFooter("~Iedzīvotājs")
            .setColor("#009602")
            .setTimestamp()
        ]})
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'rps') {
        const acceptedReplies = ['akmens', 'papirs', 'skeres'];
        const random = Math.floor((Math.random() * acceptedReplies.length));
        const result = acceptedReplies[random];

        const choice = args[0];
        if (!choice) return message.channel.send(`Kā spēlēt: \`${prefix}rps <akmens|papirs|skeres>\``);
        if (!acceptedReplies.includes(choice)) return message.channel.send(`Tikai šīs atbildes ir pieņemamas: \`${acceptedReplies.join(', ')}\``);
        
        console.log('Bota Rezultats:', result);
        if (result === choice) return message.reply("Neizšķirts!");
        
        switch (choice) {
            case 'akmens': {
                if (result === 'papirs') return message.reply('HaHa Es uzvarēju! :joy:');
                else return message.reply('Tu uzvarēji!');
            }
            case 'papirs': {
                if (result === 'skeres') return message.reply('HaHa Es uzvarēju! :joy:');
                else return message.reply('Tu uzvarēji!');        
            }
            case 'skeres': {
                if (result === 'akmens') return message.reply('HaHa Es uzvarēju! :joy:');
                else return message.reply('Tu uzvarēji!');
            }
            default: {
                return message.channel.send(`Tikai šīs atbildes ir pieņemamas: \`${acceptedReplies.join(', ')}\``);
            }
        }
    }
})

client.on('messageCreate', async (message) => {
    if (message.content.startsWith(prefix + "balsot")) {
        if (message.author.bot) return;
        message.delete();
        const channelidkarte = process.env.CHANNEL_IDKARTE;
        message.channel.send({ embeds: [ new MessageEmbed()
            .setTitle("**Balsošana**")
            .setDescription(/*"Vai pievienot visas trīs 10. klases un pārveidot šo par RTV 10. klašu discordu?"*/ "Jautājums? Jā-✔️ Nē-❌")
            .setFooter("~Iedzīvotājs")
            .setColor("#ff0000") 
        ]}).then(embedMessage => {
            embedMessage.react("✔️"),
            embedMessage.react("❌")
        });
    }
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith(prefix + "info")) {
        if (message.author.bot) return;
        message.delete();
        const guild = process.env.GUILD_ID
        //const { guild } = message
        const { name, region, memberCount, owner, afkTimeout } = guild

        const botcon = client.user.displayAvatarURL();
        message.channel.send({ embeds: [ new MessageEmbed()
            .setThumbnail(botcon)
            .setTitle("**RTV Ciems**")
            .setColor("#009602")
            .setDescription("Šis ir 10. klašu discord ciemats, kurā ir laipni gaidīti visi, tās iedzīvotāji.")
            .addField("**Izveidošanas datums:**", "11/09/2021 2:29 PM")
            .addField("**Ciema iedzīvotāju skaits:**", memberCount)
            .setTimestamp()
            .setFooter("~Iedzīvotājs") ] 
        })
    }
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith(prefix + "help")) {
        if (message.author.bot) return;
        message.delete();
        message.channel.send({ embeds: [ new MessageEmbed() 
            .setTitle("**Komandas**")
            .setColor("#009602")
            .addField("**Komandu prefix:**", "?")
            .addField("**Informācija par šo discord serveri:**", "?info")
            .addField("**Ieteikt/piedāvāt kādu ideju vai jebko citu kopīgam balsojumam:**", "?ieteikt teksts")
            .addField("**Izveidot jaunu voice kanālu:**", "?voice nosaukums")
            .addField("**Akmens šķēres papīrīts: **", "?rps akmens | papirs | skeres")
            .addField("**Ja nepamēģināsi, neuzināsi:**", "?tpg")
            .addField("**Motivējoša ziņa:**", "?nemīz")
            .setFooter("~Iedzīvotājs")
            .setTimestamp()
        ]})
    }
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith(prefix + "adminhelp")) {
        if (message.author.bot) return;
        message.delete();
        if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            message.channel.send({ embeds: [ new MessageEmbed() 
            .setTitle("**Admin Komandas**")
            .setColor("#009602")
            .addField("**Komandu prefix:**", "?")
            .addField("**Admin help komanda:**", "?adminhelp")
            .addField("**Clear komanda, lai izdzēstu līdz pēdējām 100 ziņām:**", "?clear skaitlis")
            .addField("**Veikt kādu svarīgu paziņojumu, ziņu nosūtot caur botu:**", "?say teksts")
            .setFooter("~Iedzīvotājs")
            .setTimestamp()
            ]})
        }
    }
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith(prefix + "ieteikt")) {
        if (message.author.bot) return;
        const words = message.content.split(" ").splice(1).join(" ")
        message.delete();
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
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith(prefix + "clear")) {
        if (message.author.bot) return;
        if (message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            const args = message.content.split(' ').slice(1);
            const amount = args.join();

            if (!amount) return console.log("Tu neesi norādījis dzēšamo ziņu skaitu.");
            if (isNaN(amount)) return console.log("Daudzuma parametrs nav skaitlis.");

            if (amount > 100) return console.log("Tu nevari izdzēst vairāk par 100 ziņām!");
            if (amount < 1) return console.log("Tev ir jānorāda minimālā vērtība 1!");

            await message.channel.messages.fetch({ limit: amount }).then(messages => {
                message.channel.bulkDelete(messages)
                console.log(amount + " ziņas izdzēstas.")
            });
        }
    }
});


///  MUSIC BOT  ///
/* client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.content.startsWith(prefix)) return;

    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(prefix + "play")) {
        execute(message, serverQueue);
        return;
    } else if (message.content.startsWith(prefix + "skip")) {
        skip(message, serverQueue);
        return;
    } else if (message.content.startsWith(prefix + "stop")) {
        stop(message, serverQueue);
        return;
    } else {
        message.channel.send("Ievadi pareizu komandu!");
    }
})

const queue = new Map();

async function execute(message, serverQueue) {
    const argz = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
        "Tev ir jābūt balss kanālā, lai atskaņotu mūziku!"
    );

    const songInfo = await ytdl.getInfo(argz[1]);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {

    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} tika pievienots rindai!`);
    }

    // Creating the contract for our queue
    const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
    };
    // Setting the queue using our contract
    queue.set(message.guild.id, queueContruct);
    // Pushing the song to our songs array
    queueContruct.songs.push(song);
    
    try {
        // Here we try to join the voicechat and save our connection into our object.
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;
        // Calling the play function to start a song
        play(message.guild, queueContruct.songs[0]);
    } catch (err) {
        // Printing the error message if the bot fails to join the voicechat
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
    }
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Atskaņo: **${song.title}**`);
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "Tev ir jābūt balss kanālā, lai izlaistu dziesmu!"
      );
    if (!serverQueue)
      return message.channel.send("Nav dziesmas, kuras izlaist!");
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "Tev ir jābūt balss kanālā, lai apstādinātu dziesmu!"
      );
    
    if (!serverQueue)
      return message.channel.send("Nav dziesmas, kuras apstādināt!");
      
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
} */ //edit

//startKeepAlive();
client.login(process.env.DISCORDJS_BOT_TOKEN);
