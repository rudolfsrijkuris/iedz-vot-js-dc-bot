const { Discord, MessageEmbed } = require("discord.js")

module.exports = {
    async run (bot, message, args) {
        const msg = await message.channel.send({ embeds: [ new MessageEmbed() 
            .setTitle("Akmens Šķēres Papīrīts")
            .setDescription("Spied uz reaction, lai spēlētu")
            .setTimestamp()
            .setFooter("~Iedzīvotājs")
            .setColor("#009602")
        ]}).then(embedMessage => {
            embedMessage.react("🗻"),
            embedMessage.react("🧻"),
            embedMessage.react("✂")
        })

        const filter = (reaction, user) => {
            return ['🗻', '🧻', '✂']. includes(reaction.emoji.name) && user.id === message.author.id;
        }

        const choices = ['🗻', '🧻', '✂'];
        const me = choices[Math.floor(math.random() * choices.length)]
        msg.awaitReactions(filter, { max: 1, time: 60000, error: ["time"] }). then(
            async(collected) => {
                const reaction = collected.first();
                let result = message.channel.send({ embeds: [ new MessageEmbed()
                    .setTitle("Rezultāts")
                    .addField("**Tu izvēlējies:**", `${reaction.emoji.name}`)
                    .addField("**Iedzīvotājs izvēlējās:**", `${me}`)
                    .setColor("#009602")
                    .setTimestamp()
                    .setFooter("~Iedzīvotājs")
                ]})
                await msg.edit(result);

                if ((me === "🗻" && reaction.emoji.name === "✂") ||
                (me === "✂" && reaction.emoji.name === "🧻") ||
                (me === "🧻" && reaction.emoji.name === "🗻")) {
                    message.reply("Tu zaudēji!");
                } else if (me === reaction.emoji.name) {
                    return message.reply("Neizšķirts!");
                } else {
                    return message.reply("Tu uzvarēji!");
                }
            }
        ).catch(collected => {
            message.reply("Spēle tika apturēta, tu nepaspēji atbildēt laikā!")
        })
    }
}