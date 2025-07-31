const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'ban',
    description: '🚫 Banea a un usuario del servidor.',
    execute(message, args) {
        // Verificar si el usuario tiene permisos de administrador
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ No tienes permisos para usar este comando.');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('❗ Debes mencionar al usuario que quieres banear.');
        }

        const reason = args.slice(1).join(' ');
        if (!reason) {
            return message.reply('❗ Debes proporcionar una razón para el baneo.');
        }

        const member = message.guild.members.cache.get(user.id);
        if (!member) {
            return message.reply('❌ Ese usuario no está en este servidor.');
        }

        const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        member.ban({ reason: reason })
            .then(() => {
                const embed = new EmbedBuilder()
                    .setColor(randomColor)
                    .setTitle('🚫 Usuario Baneado')
                    .setDescription(`El usuario ${user.tag} ha sido baneado.`)
                    .addFields(
                        { name: '👤 Usuario', value: `${user.tag}`, inline: true },
                        { name: '📝 Razón', value: `${reason}`, inline: true },
                        { name: '🔨 Moderador', value: `${message.author.tag}`, inline: true }
                    )
                    .setTimestamp();

                message.channel.send({ embeds: [embed] });

                const warningMessage = `⚠️ **Si no quieres ser baneado al igual que ${user.tag}, evita romper las reglas del servidor.**\n @everyone`;
                message.channel.send(warningMessage);
            })
            .catch(err => {
                message.reply('❌ No pude banear al usuario. Verifica que tengo los permisos necesarios.');
                console.error(err);
            });
    },
};
