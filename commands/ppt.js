const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'ppt',
    description: '🪨📄✂️ Juega a Piedra, Papel o Tijeras 🪨📄✂️',
    async execute(message) {
        const choices = ['🪨 Piedra', '📄 Papel', '✂️ Tijeras'];

        const embed = new EmbedBuilder()
            .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
            .setTitle('🪨📄✂️ Piedra, Papel o Tijeras 🪨📄✂️')
            .setDescription('¡Elige tu opción!');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('piedra')
                    .setLabel('🪨 Piedra')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('papel')
                    .setLabel('📄 Papel')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('tijeras')
                    .setLabel('✂️ Tijeras')
                    .setStyle(ButtonStyle.Primary),
            );

        const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });

        const filter = i => i.user.id === message.author.id;
        const collector = sentMessage.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            const botChoice = choices[Math.floor(Math.random() * choices.length)];
            let result = '';

            if (i.customId === 'piedra') {
                if (botChoice === '🪨 Piedra') result = '¡Empate! 🤝';
                else if (botChoice === '📄 Papel') result = '¡Perdiste! 😢';
                else result = '¡Ganaste! 🎉';
            } else if (i.customId === 'papel') {
                if (botChoice === '🪨 Piedra') result = '¡Ganaste! 🎉';
                else if (botChoice === '📄 Papel') result = '¡Empate! 🤝';
                else result = '¡Perdiste! 😢';
            } else if (i.customId === 'tijeras') {
                if (botChoice === '🪨 Piedra') result = '¡Perdiste! 😢';
                else if (botChoice === '📄 Papel') result = '¡Ganaste! 🎉';
                else result = '¡Empate! 🤝';
            }

            await i.update({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
                        .setTitle('🪨📄✂️ Piedra, Papel o Tijeras 🪨📄✂️')
                        .setDescription(`Elegiste ${i.customId === 'piedra' ? '🪨 Piedra' : i.customId === 'papel' ? '📄 Papel' : '✂️ Tijeras'}\nEl bot eligió ${botChoice}\n\n**${result}**`)
                ],
                components: []
            });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                sentMessage.edit({ content: '¡No elegiste a tiempo! ⏰', components: [] });
            }
        });
    },
};
