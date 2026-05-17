const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'order-service',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();

async function connectProducer() {
    await producer.connect();
    console.log("Kafka Producer connected");
}

async function sendOrderCreated(order) {
    await producer.send({
        topic: "order.created",
        messages: [
            {
                value: JSON.stringify(order)
            }
        ]
    });
}

module.exports = { connectProducer, sendOrderCreated };