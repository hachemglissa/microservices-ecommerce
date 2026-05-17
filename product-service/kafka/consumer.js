const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'product-service',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'product-group' });

async function runConsumer() {
    await consumer.connect();
    console.log("Product consumer connected");

    await consumer.subscribe({
        topic: "order.created",
        fromBeginning: true
    });

    await consumer.run({
        eachMessage: async ({ message }) => {

            const data = JSON.parse(message.value.toString());

            console.log("🔥 EVENT RECEIVED IN PRODUCT SERVICE:");
            console.log(data);

            // EXEMPLE LOGIQUE METIER
            console.log("📦 reduce stock for product:", data.productId);
        }
    });
}

module.exports = { runConsumer };