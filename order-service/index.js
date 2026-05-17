const express = require('express');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const db = require('./database/database');

// 👉 Kafka (PROPRE: 1 seul producer via module)
const { connectProducer, sendOrderCreated } = require('./kafka/producer');

const app = express();
app.use(cors());
app.use(express.json());

/* ================= INIT KAFKA ================= */
connectProducer();

/* ================= GRPC SETUP ================= */
const packageDef = protoLoader.loadSync('./proto/order.proto');
const orderProto = grpc.loadPackageDefinition(packageDef).order;

/* ================= gRPC FUNCTIONS ================= */

// GET ALL ORDERS
function GetOrders(call, callback) {
    db.all("SELECT * FROM orders", [], (err, rows) => {
        if (err) return callback(err, null);
        callback(null, { orders: rows });
    });
}

// CREATE ORDER
function CreateOrder(call, callback) {
    const { userId, productId } = call.request;

    db.run(
        `INSERT INTO orders(userId, productId, status) VALUES (?, ?, ?)`,
        [userId, productId, "CREATED"],
        async function (err) {

            if (err) return callback(err, null);

            const orderId = this.lastID;

            const order = {
                id: orderId,
                status: "CREATED"
            };

            // 👉 Kafka EVENT
            try {
                await sendOrderCreated({
                    orderId,
                    userId,
                    productId
                });

                console.log("Kafka event sent: order.created");

            } catch (kafkaErr) {
                console.error("Kafka error:", kafkaErr);
            }

            callback(null, order);
        }
    );
}

/* ================= gRPC SERVER ================= */
const server = new grpc.Server();

server.addService(orderProto.OrderService.service, {
    GetOrders,
    CreateOrder
});

server.bindAsync(
    "0.0.0.0:50053",
    grpc.ServerCredentials.createInsecure(),
    () => {
        console.log("Order gRPC running on port 50053");
    }
);

/* ================= REST (TEST) ================= */
app.get("/health", (req, res) => {
    res.json({ status: "OK", service: "order-service" });
});

/* ================= START ================= */
app.listen(4003, () => {
    console.log("Order REST running on port 4003");
});

/* ================= SHUTDOWN ================= */
process.on("SIGINT", () => {
    console.log("Order service stopped");
    process.exit(0);
});