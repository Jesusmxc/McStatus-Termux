const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'onmc',
    description: 'Verifica si un servidor de Minecraft está online o offline',
    async execute(message, args) {
        if (args.length !== 2) {
            return message.reply('❌ Uso correcto: `.onmc <IP o Dominio> <Port>`');
        }

        const [ipOrDomain, port] = args;
        try {
            const response = await axios.get(`https://api.mcsrvstat.us/2/${ipOrDomain}:${port}`);
            const data = response.data;

            if (data.online === undefined) {
                return message.reply('❌ No se pudo obtener información del servidor. Verifica la IP/puerto e inténtalo de nuevo.');
            }

            const embed = new EmbedBuilder()
                .setColor(data.online ? 0x00ff00 : 0xff0000)
                .setTitle(`🌍 Estado del servidor: ${ipOrDomain}:${port}`)
                .setDescription(data.online ? '🟢 El servidor está **online**' : '🔴 El servidor está **offline**')
                .setTimestamp()
                .setFooter({ text: 'Información proporcionada por el bot' });

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('❌ Error:', error);
            message.reply('❌ Hubo un error al verificar el estado del servidor.');
        }
    },
};
