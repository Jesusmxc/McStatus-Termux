const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'query',
    description: 'Obtiene información de un servidor de Minecraft',
    async execute(message, args) {
        if (args.length !== 2) {
            return message.reply('❌ Uso correcto: `.query <IP o Dominio> <Port>`');
        }

        const [ipOrDomain, port] = args;
        try {
            const response = await axios.get(`https://api.mcsrvstat.us/2/${ipOrDomain}:${port}`);
            const data = response.data;

            if (!data.online) {
                return message.reply('❌ El servidor está offline o la IP/puerto es incorrecto.');
            }

            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`🌍 Información del servidor: ${ipOrDomain}:${port}`)
                .addFields(
                    { name: '📋 Motd', value: data.motd && data.motd.clean ? data.motd.clean.join('\n') : 'Desconocido', inline: true },
                    { name: '🧑‍🤝‍🧑 Jugadores', value: `${data.players.online}/${data.players.max}`, inline: true },
                    { name: '🗺️ Versión', value: data.version || 'Desconocido', inline: true },
                    { name: '📜 Plugins', value: data.plugins && data.plugins.names ? data.plugins.names.join(', ') : 'Ninguno', inline: true },
                    { name: '🔗 IP', value: data.ip || 'Desconocido', inline: true },
                    { name: '🔢 Puerto', value: data.port ? data.port.toString() : 'Desconocido', inline: true },
                    { name: '🌐 Query Habilitado', value: data.debug && data.debug.query ? 'Sí' : 'No', inline: true },
                    { name: '🗺️ Mundo Principal', value: data.map || 'Desconocido', inline: true },
                    { name: '🔧 Protocolo', value: data.protocol ? data.protocol.toString() : 'Desconocido', inline: true },
                    { name: '🖥️ Software', value: data.software || 'Desconocido', inline: true },
                    { name: '⏱️ Cache Time', value: data.debug && data.debug.cachetime ? data.debug.cachetime.toString() : 'Desconocido', inline: true },
                    { name: '🚫 Bloqueado por Mojang', value: data.debug && data.debug.approval ? 'Sí' : 'No', inline: true },
                    { name: '📶 Ping', value: data.ping ? `${data.ping} ms` : 'Desconocido', inline: true },
                    { name: '🔍 SRV Record', value: data.srv ? `${data.srv.host}:${data.srv.port}` : 'Ninguno', inline: true },
                )
                .setTimestamp()
                .setFooter({ text: 'Información proporcionada por mcsrvstat.us' });

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('❌ Error:', error);
            message.reply('❌ Hubo un error al obtener la información del servidor.');
        }
    },
};
