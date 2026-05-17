const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'notification-service',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({
    groupId: 'notification-group'
});

async function run() {
    try {
        await consumer.connect();
        console.log("📡 Notification Consumer connected");

        await consumer.subscribe({
            topic: 'order.created',
            fromBeginning: true
        });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const data = JSON.parse(message.value.toString());

                    console.log("=================================");
                    console.log("📩 NEW ORDER RECEIVED");
                    console.log(`Order ID: ${data.orderId}`);
                    console.log(`User ID: ${data.userId}`);
                    console.log(`Product ID: ${data.productId}`);
                    console.log("=================================");

                    // 👉 Ici tu peux ajouter :
                    // - envoi email
                    // - notification push
                    // - log DB
                    // - etc.

                } catch (err) {
                    console.error("❌ Message processing error:", err);
                }
            }
        });

    } catch (err) {
        console.error("❌ Kafka consumer error:", err);
        process.exit(1);
    }
}

run();

/* ---------------- GRACEFUL SHUTDOWN ---------------- */
process.on("SIGINT", async () => {
    console.log("\nShutting down notification-service...");

    try {
        await consumer.disconnect();
        console.log("Kafka consumer disconnected");
    } catch (err) {
        console.error("Error during disconnect:", err);
    }

    process.exit(0);
});