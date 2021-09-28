require("dotenv").config();
const Discord = require("discord.js");
const config = require(`./botconfig/config.json`);
const settings = require(`./botconfig/settings.json`);
const filters = require(`./botconfig/filters.json`);
const colors = require("colors");
const Enmap = require("enmap");
const libsodium = require("libsodium-wrappers");
const ffmpeg = require("ffmpeg-static");
const voice = require("@discordjs/voice");
const DisTube = require("distube").default;
const https = require('https-proxy-agent');
const client = new Discord.Client({
    //fetchAllMembers: false,
    //restTimeOffset: 0,
    //restWsBridgetimeout: 100,
    shards: "auto",
    //shardCount: 5,
    allowedMentions: {
      parse: [ ],
      repliedUser: false,
    },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [ 
        Discord.Intents.FLAGS.GUILDS,
        //Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        //Discord.Intents.FLAGS.GUILD_BANS,
        //Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        //Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        //Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        //Discord.Intents.FLAGS.GUILD_INVITES,
        //Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        //Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        //Discord.Intents.FLAGS.DIRECT_MESSAGES,
        //Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        //Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ],
    //presence: {
    //  activity: {
    //    name: `ciema iedzīvotājus`, 
    //    type: "WATCHING", 
    //  },
    //  status: "online"
    //}
});

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

client.setMaxListeners(30);

const roleClaim = require('./role-claim');
const verify = require('./verify');


//BOT CODED BY: Tomato#6966
//DO NOT SHARE WITHOUT CREDITS!
//const proxy = 'http://123.123.123.123:8080';
//const agent = https(proxy);
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
let spotifyoptions = {
  parallel: true,
  emitEventsAfterFetching: true,
}
if(config.spotify_api.enabled){
  spotifyoptions.api = {
    clientId: config.spotify_api.clientId,
    clientSecret: config.spotify_api.clientSecret,
  }
}
client.distube = new DisTube(client, {
  emitNewSongOnly: false,
  leaveOnEmpty: true,
  leaveOnFinish: true,
  leaveOnStop: true,
  savePreviousSongs: true,
  emitAddSongWhenCreatingQueue: false,
  //emitAddListWhenCreatingQueue: false,
  searchSongs: 0,
  youtubeCookie: config.youtubeCookie,     //Comment this line if you dont want to use a youtube Cookie 
  nsfw: true, //Set it to false if u want to disable nsfw songs
  emptyCooldown: 25,
  ytdlOptions: {
    //requestOptions: {
    //  agent //ONLY USE ONE IF YOU KNOW WHAT YOU DO!
    //},
    highWaterMark: 1024 * 1024 * 64,
    quality: "highestaudio",
    format: "audioonly",
    liveBuffer: 60000,
    dlChunkSize: 1024 * 1024 * 64,
  },
  youtubeDL: true,
  updateYouTubeDL: true,
  customFilters: filters,
  plugins: [
    new SpotifyPlugin(spotifyoptions),
    new SoundCloudPlugin()
  ]
})
//Define some Global Collections
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = require("fs").readdirSync(`./commands`);
client.allEmojis = require("./botconfig/emojis.json");

client.setMaxListeners(100); require('events').defaultMaxListeners = 100;

client.settings = new Enmap({ name: "settings",dataDir: "./databases/settings"});
client.infos = new Enmap({ name: "infos", dataDir: "./databases/infos"});


//Require the Handlers                  Add the antiCrash file too, if its enabled
["events", "commands", "slashCommands", settings.antiCrash ? "antiCrash" : null, "distubeEvent"]
    .filter(Boolean)
    .forEach(h => {
        require(`./handlers/${h}`)(client);
    })
//Start the Bot
client.login(config.token)

/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */

///  JAUNS VOICE KANĀLS  ///

client.on('messageCreate', async (message) => {
  if (message.content.startsWith(config.prefix + "cvoice")) {
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
  if (message.content.startsWith(config.prefix + 'say')) {
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
  if (message.content.startsWith(config.prefix + 'embed')) {
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
  if (message.content.startsWith(config.prefix + 'tpg')) {
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
  if (message.content.startsWith(config.prefix + 'nemīz')) {
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
  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'rps') {
      const acceptedReplies = ['akmens', 'papirs', 'skeres'];
      const random = Math.floor((Math.random() * acceptedReplies.length));
      const result = acceptedReplies[random];

      const choice = args[0];
      if (!choice) return message.channel.send(`Kā spēlēt: \`${config.prefix}rps <akmens|papirs|skeres>\``);
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
  if (message.content.startsWith(config.prefix + "balsot")) {
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
  if (message.content.startsWith(config.prefix + "info")) {
      if (message.author.bot) return;
      message.delete();
      const guild = process.env.GUILD_ID

      const botcon = client.user.displayAvatarURL();
      message.channel.send({ embeds: [ new MessageEmbed()
          .setThumbnail(botcon)
          .setTitle("**RTV Ciems**")
          .setColor("#009602")
          .setDescription("Šis ir 10. klašu discord ciemats, kurā ir laipni gaidīti visi, tās iedzīvotāji.")
          .addField("**Izveidošanas datums:**", "11/09/2021 2:29 PM")
          .addField("**Ciema iedzīvotāju skaits:**", "36")
          .setTimestamp()
          .setFooter("~Iedzīvotājs") ] 
      })
  }
});

client.on('messageCreate', async (message) => {
  if (message.content.startsWith(config.prefix + "ihelp")) {
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
  if (message.content.startsWith(config.prefix + "adminhelp")) {
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
  if (message.content.startsWith(config.prefix + "ieteikt")) {
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
  if (message.content.startsWith(config.prefix + "clearchat")) {
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


/**
 * @LOAD_THE_DASHBOARD - Loading the Dashbaord Module with the BotClient into it!
 */
client.on("ready", () => {
  require("./dashboard/index.js")(client);
  roleClaim(client); // reaction roles
  verify(client); // verify role
})
