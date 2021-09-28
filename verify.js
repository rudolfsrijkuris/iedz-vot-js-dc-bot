const firstMessage = require('./first-message')

module.exports = client => {
    const channelId = '887406287703384084'

    const getEmoji = (emojiName) =>
        client.emojis.cache.find((emoji) => emoji.name === emojiName)

    const emojis = {
        viens: 'Klases iedzīvotājs',
        divi: 'Citas klases iedzīvotājs',
        tris: 'Imigrants',
    }

    const reactions = []

    let emojiText = 'Uzspied uz reaction, lai saņemtu role\n\n'
    for (const key in emojis) {
        const emoji = getEmoji(key)
        reactions.push(emoji)
    
        const role = emojis[key]
        emojiText += `${emoji} = ${role}\n`
    }
    
    firstMessage(client, channelId, emojiText, reactions)

    const handleReaction = (reaction, user, add) => {
        if (user.id === '885903800097972254') {
        return
        }

        const emoji = reaction._emoji.name

        const { guild } = reaction.message

        const roleName = emojis[emoji]
        if (!roleName) {
        return
        }

        if (guild.roles.cache.find((role) => role.name === roleName)) {
            return
        } // pārbaude vai ir jau role iedots

        const role = guild.roles.cache.find((role) => role.name === roleName)
        const member = guild.members.cache.find((member) => member.id === user.id)

        if (add) {
        member.roles.add(role)
        } //else {
        //member.roles.remove(role)
        //}
    }

    client.on('messageReactionAdd', (reaction, user) => {
        if (reaction.message.channel.id === channelId) {
          handleReaction(reaction, user, true)
        }
    })
    
    //client.on('messageReactionRemove', (reaction, user) => {
    //    if (reaction.message.channel.id === channelId) {
     //     handleReaction(reaction, user, false)
    //    }
    //})
}