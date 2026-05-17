const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const packageDef = protoLoader.loadSync(
    path.join(__dirname, '../proto/product.proto')
);

const productProto = grpc.loadPackageDefinition(packageDef).product;

const client = new productProto.ProductService(
    'localhost:50052',
    grpc.credentials.createInsecure()
);

module.exports = client;