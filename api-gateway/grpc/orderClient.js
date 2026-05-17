const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const packageDef = protoLoader.loadSync(
    path.join(__dirname, '../proto/order.proto')
);

const orderProto = grpc.loadPackageDefinition(packageDef).order;

const client = new orderProto.OrderService(
    '127.0.0.1:50053',
    grpc.credentials.createInsecure()
);

module.exports = client;