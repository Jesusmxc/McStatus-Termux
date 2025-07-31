const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'rmcanal',
    description: '🗑️ Elimina un canal.',
    execute(message, args) {
        // Verificar si el usuario tiene permisos de administrador
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permisos Insuficientes')
                .setDescription('No tienes permisos para usar este comando.');
            return message.reply({ embeds: [embed] });
        }

        const channel = message.mentions.channels.first() || message.guild.channels.cache.find(c => c.name === args.join(' '));

        if (!channel) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❗ Error')
                .setDescription('Debes mencionar el canal o proporcionar su nombre.');
            return message.reply({ embeds: [embed] });
        }

        channel.delete()
            .then(() => {
                const embed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('🗑️ Canal Eliminado')
                    .setDescription(`Canal eliminado: ${channel.name}`);
                message.reply({ embeds: [embed] });
            })
            .catch(err => {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Error')
                    .setDescription('No pude eliminar el canal. Verifica que tengo los permisos necesarios.');
                message.reply({ embeds: [embed] });
                console.error(err);
            });
    },
};
