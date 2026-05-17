const express = require('express');
const cors = require('cors');

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const db = require('./database/database');

const app = express();

app.use(cors());
app.use(express.json());

const packageDefinition = protoLoader.loadSync(
    './proto/user.proto'
);

const proto = grpc.loadPackageDefinition(packageDefinition).user;

// gRPC method
function getUsers(call, callback) {

    db.all('SELECT * FROM users', [], (err, rows) => {

        if (err) {
            callback(err, null);
        } else {
            callback(null, { users: rows });
        }

    });
}

// gRPC server
const server = new grpc.Server();

server.addService(proto.UserService.service, {
    GetUsers: getUsers
});

server.bindAsync(
    '0.0.0.0:50051',
    grpc.ServerCredentials.createInsecure(),
    () => {
        console.log('gRPC User Service running on port 50051');
    }
);

const PORT = 4001;

app.listen(PORT, () => {
    console.log(`User Service REST running on port ${PORT}`);
});