const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'serverinfo',
    description: 'Muestra información del servidor',
    execute(message, args) {
        const { guild } = message;

        // Genera un color aleatorio
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        // Crea un embed con la información del servidor
        const embed = new EmbedBuilder()
            .setTitle('📜 Información del Servidor')
            .setColor(`#${randomColor}`)
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: '🏷️ Nombre del Servidor', value: guild.name, inline: true },
                { name: '🆔 ID del Servidor', value: guild.id, inline: true },
                { name: '👑 Dueño del Servidor', value: `<@${guild.ownerId}>`, inline: true },
                { name: '👥 Miembros', value: `${guild.memberCount}`, inline: true },
                { name: '🔖 Roles', value: `${guild.roles.cache.size}`, inline: true },
                { name: '📁 Canales', value: `${guild.channels.cache.size}`, inline: true },
                { name: '📅 Fecha de Creación', value: `${guild.createdAt.toDateString()}`, inline: true }
            )
            .setFooter({ text: 'Información del Servidor' });

        message.channel.send({ embeds: [embed] });
    },
};
