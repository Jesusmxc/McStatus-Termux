const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'listcanales',
    description: '📜 Muestra la lista de canales del servidor.',
    execute(message) {
        // Verificar si el usuario tiene permisos de administrador
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permisos Insuficientes')
                .setDescription('No tienes permisos para usar este comando.');
            return message.reply({ embeds: [embed] });
        }

        const channels = message.guild.channels.cache.map(channel => `${channel.name} - ${channel.type}`).join('\n');

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('📜 Lista de Canales')
            .setDescription(channels)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
