const { EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'crcanal',
    description: '📁 Crea un canal de texto o voz.',
    execute(message, args) {
        // Verificar si el usuario tiene permisos de administrador
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permisos Insuficientes')
                .setDescription('No tienes permisos para usar este comando.');
            return message.reply({ embeds: [embed] });
        }

        const type = args[0];
        const channelName = args.slice(1).join(' ');

        if (!type || !['texto', 'voz'].includes(type)) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❗ Error')
                .setDescription('Debes especificar el tipo de canal (texto o voz).');
            return message.reply({ embeds: [embed] });
        }

        if (!channelName) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❗ Error')
                .setDescription('Debes proporcionar un nombre para el canal.');
            return message.reply({ embeds: [embed] });
        }

        message.guild.channels.create({
            name: channelName,
            type: type === 'texto' ? ChannelType.GuildText : ChannelType.GuildVoice
        })
        .then(channel => {
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('📁 Canal Creado')
                .setDescription(`Canal ${type} creado: ${channel.name}`);
            message.reply({ embeds: [embed] });
        })
        .catch(err => {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Error')
                .setDescription('No pude crear el canal. Verifica que tengo los permisos necesarios.');
            message.reply({ embeds: [embed] });
            console.error(err);
        });
    },
};
