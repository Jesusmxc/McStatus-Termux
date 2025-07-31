const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'banlist',
    description: '📜 Muestra la lista de usuarios baneados.',
    execute(message) {
        // Verificar si el usuario tiene permisos de administrador
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ No tienes permisos para usar este comando.');
        }

        message.guild.bans.fetch()
            .then(bans => {
                if (bans.size === 0) {
                    return message.reply('📜 No hay usuarios baneados en este servidor.');
                }

                const embed = new EmbedBuilder()
                    .setColor('#FF5733')
                    .setTitle('📜 Lista de Usuarios Baneados')
                    .setDescription(bans.map(ban => `${ban.user.tag} - ${ban.reason || 'Sin razón'}`).join('\n'))
                    .setTimestamp();

                message.channel.send({ embeds: [embed] });
            })
            .catch(err => {
                message.reply('❌ No pude obtener la lista de usuarios baneados.');
                console.error(err);
            });
    },
};
