const { EmbedBuilder } = require('discord.js');
const kickedUsers = [];

module.exports = {
    name: 'listkick',
    description: '📜 Muestra la lista de usuarios expulsados.',
    execute(message) {
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.reply('❌ No tienes permisos para ver la lista de usuarios expulsados.');
        }

        if (kickedUsers.length === 0) {
            return message.reply('📜 No hay usuarios expulsados en este servidor.');
        }

        const embed = new EmbedBuilder()
            .setColor('#FF5733')
            .setTitle('📜 Lista de Usuarios Expulsados')
            .setDescription(kickedUsers.map(user => `👤 **${user.tag}** - ${user.reason}`).join('\n'))
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};