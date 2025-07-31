const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'unban',
    description: '🔓 Desbanea a un usuario del servidor.',
    execute(message, args) {
        // Verificar si el usuario tiene permisos de administrador
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ No tienes permisos para usar este comando.');
        }

        const username = args.join(' ');
        if (!username) {
            return message.reply('❗ Debes proporcionar el nombre de usuario que quieres desbanear.');
        }

        message.guild.bans.fetch()
            .then(bans => {
                const user = bans.find(ban => ban.user.tag === username);
                if (!user) {
                    return message.reply('❌ No encontré a un usuario baneado con ese nombre.');
                }

                message.guild.members.unban(user.user.id)
                    .then(() => {
                        message.reply(`🔓 El usuario ${user.user.tag} ha sido desbaneado.`);
                    })
                    .catch(err => {
                        message.reply('❌ No pude desbanear al usuario. Verifica que tengo los permisos necesarios.');
                        console.error(err);
                    });
            })
            .catch(err => {
                message.reply('❌ No pude obtener la lista de usuarios baneados.');
                console.error(err);
            });
    },
};
