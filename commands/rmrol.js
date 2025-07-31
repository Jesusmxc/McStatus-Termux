const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'rmrol',
    description: '🗑️ Elimina un rol.',
    execute(message, args) {
        // Verificar si el usuario tiene permisos de administrador
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permisos Insuficientes')
                .setDescription('No tienes permisos para usar este comando.');
            return message.reply({ embeds: [embed] });
        }

        const roleName = args.join(' ');
        const role = message.guild.roles.cache.find(r => r.name === roleName);

        if (!role) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❗ Error')
                .setDescription('No encontré un rol con ese nombre.');
            return message.reply({ embeds: [embed] });
        }

        role.delete()
            .then(() => {
                const embed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('🗑️ Rol Eliminado')
                    .setDescription(`Rol eliminado: ${role.name}`);
                message.reply({ embeds: [embed] });
            })
            .catch(err => {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Error')
                    .setDescription('No pude eliminar el rol. Verifica que tengo los permisos necesarios.');
                message.reply({ embeds: [embed] });
                console.error(err);
            });
    },
};
