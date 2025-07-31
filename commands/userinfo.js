const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'userinfo',
    description: 'Muestra información sobre un usuario',
    execute(message, args) {
        // Obtiene el usuario mencionado o el usuario que envió el mensaje
        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0])?.user || message.author;
        const member = message.guild.members.cache.get(user.id);

        // Genera un color brillante aleatorio
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        // Crea un embed con la información del usuario
        const embed = new EmbedBuilder()
            .setTitle('👤 Información del Usuario')
            .setColor(`#${randomColor}`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: '🏷️ Nombre de Usuario', value: user.username, inline: true },
                { name: '🆔 ID de Usuario', value: user.id, inline: true },
                { name: '📅 Cuenta Creada', value: user.createdAt.toDateString(), inline: true },
                { name: '📅 Se Unió al Servidor', value: member.joinedAt.toDateString(), inline: true },
                { name: '🎨 Roles', value: member.roles.cache.map(role => role.name).join(', '), inline: true }
            )
            .setFooter({ text: 'Información del Usuario' });

        message.channel.send({ embeds: [embed] });
    },
};
