const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'owner',
    description: 'Muestra información del dueño del bot',
    execute(message, args) {
        // Genera un color aleatorio
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        // Crea un embed con la información del dueño
        const embed = new EmbedBuilder()
            .setTitle('📢 Información del Bot')
            .setDescription('🤖 Este bot ha sido creado por <@1119371526202990654>')
            .setColor(`#${randomColor}`)
            .setFooter({ text: 'Versión 1.0' });

        message.channel.send({ embeds: [embed] });
    },
};
