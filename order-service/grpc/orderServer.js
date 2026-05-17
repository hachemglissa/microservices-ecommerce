const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { Kafka } = require('kafkajs');
const db = require('./database/database');

server.addService(orderProto.OrderService.service, {
    CreateOrder,
    GetOrders,
    GetOrder,
    UpdateOrder,
    DeleteOrder
});