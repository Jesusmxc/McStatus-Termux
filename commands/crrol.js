const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'crrol',
    description: '🎨 Crea un rol con un color específico.',
    execute(message, args) {
        // Verificar si el usuario tiene permisos de administrador
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permisos Insuficientes')
                .setDescription('No tienes permisos para usar este comando.');
            return message.reply({ embeds: [embed] });
        }

        const roleName = args.slice(0, -1).join(' ');
        const color = args[args.length - 1].toLowerCase();

        const colors = {
            'verde': '#00FF00',
            'amarillo': '#FFFF00',
            'rojo': '#FF0000',
            'azul': '#0000FF',
            'morado': '#800080',
            'rosado': '#FF69B4'
        };

        if (!roleName) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❗ Error')
                .setDescription('Debes proporcionar un nombre para el rol.');
            return message.reply({ embeds: [embed] });
        }

        if (!colors[color]) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❗ Error')
                .setDescription('Debes proporcionar un color válido (verde, amarillo, rojo, azul, morado, rosado).');
            return message.reply({ embeds: [embed] });
        }

        message.guild.roles.create({ name: roleName, color: colors[color] })
            .then(role => {
                const embed = new EmbedBuilder()
                    .setColor(colors[color])
                    .setTitle('🎨 Rol Creado')
                    .setDescription(`Rol creado: ${role.name} con color ${color}`);
                message.reply({ embeds: [embed] });
            })
            .catch(err => {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Error')
                    .setDescription('No pude crear el rol. Verifica que tengo los permisos necesarios.');
                message.reply({ embeds: [embed] });
                console.error(err);
            });
    },
};
