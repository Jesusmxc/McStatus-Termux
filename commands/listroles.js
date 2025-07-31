const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'listroles',
    description: '📜 Muestra la lista de roles del servidor.',
    execute(message) {
        // Verificar si el usuario tiene permisos de administrador
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permisos Insuficientes')
                .setDescription('No tienes permisos para usar este comando.');
            return message.reply({ embeds: [embed] });
        }

        const roles = message.guild.roles.cache.map(role => `${role.name} - ${role.id}`).join('\n');

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('📜 Lista de Roles')
            .setDescription(roles)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
