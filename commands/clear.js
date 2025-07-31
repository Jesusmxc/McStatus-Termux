// clearChannel.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'Elimina y recrea el canal actual',
    execute: async function(interaction) {
        const channel = interaction.channel;
        const channelName = channel.name;
        const channelPosition = channel.position;
        const channelParent = channel.parent;

        // Mensaje de confirmación de inicio
        const startEmbed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('🧹 Limpiando Canal 🧹')
            .setDescription('🔄 Eliminando y recreando el canal...')
            .setFooter({ text: '⌛ Por favor, espera...' });

        await interaction.reply({ embeds: [startEmbed] });

        // Crear el nuevo canal
        const newChannel = await channel.clone();

        // Mover el nuevo canal a la posición del canal original
        await newChannel.setPosition(channelPosition);

        // Mover el nuevo canal a la categoría del canal original
        if (channelParent) {
            await newChannel.setParent(channelParent);
        }

        // Eliminar el canal original
        await channel.delete();

        // Mensaje de confirmación de finalización
        const endEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Canal Limpio ✅')
            .setDescription(`🧼 El canal **${channelName}** ha sido eliminado y recreado.`)
            .setFooter({ text: '🧹 Canal limpio' });

        await newChannel.send({ embeds: [endEmbed] });
    }
};
