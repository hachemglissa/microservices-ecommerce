const express = require('express');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { runConsumer } = require('./kafka/consumer');

const db = require('./database/database');

const app = express();
app.use(cors());
app.use(express.json());

const packageDef = protoLoader.loadSync('./proto/product.proto');
const productProto = grpc.loadPackageDefinition(packageDef).product;
runConsumer();
// gRPC function
function getProducts(call, callback) {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, { products: rows });
        }
    });
}

function getProduct(call, callback) {
    const id = call.request.id;

    db.get(
        "SELECT * FROM products WHERE id = ?",
        [id],
        (err, row) => {

            if (err) return callback(err, null);

            if (!row) {
                return callback({
                    code: 5,
                    message: "Product not found"
                });
            }

            callback(null, row);
        }
    );
}

function CreateProduct(call, callback) {
    const { name, price } = call.request;

    db.run(
        "INSERT INTO products(name, price) VALUES (?, ?)",
        [name, price],
        function (err) {
            if (err) return callback(err, null);

            callback(null, {
                id: this.lastID,
                name,
                price
            });
        }
    );
}

function UpdateProduct(call, callback) {
    const { id, name, price } = call.request;

    db.run(
        "UPDATE products SET name = ?, price = ? WHERE id = ?",
        [name, price, id],
        function (err) {
            if (err) return callback(err, null);

            callback(null, { id, name, price });
        }
    );
}

function DeleteProduct(call, callback) {
    db.run(
        "DELETE FROM products WHERE id = ?",
        [call.request.id],
        function (err) {
            if (err) return callback(err, null);

            callback(null, {});
        }
    );
}

function SearchProduct(call, callback) {
    const name = call.request.name;

    db.all(
        "SELECT * FROM products WHERE name LIKE ?",
        [`%${name}%`],
        (err, rows) => {
            if (err) return callback(err, null);

            callback(null, { products: rows });
        }
    );
}

const server = new grpc.Server();

server.addService(productProto.ProductService.service, {
    getProducts,
    getProduct,
    CreateProduct,
    UpdateProduct,
    DeleteProduct,
    SearchProduct
});

server.bindAsync(
    "0.0.0.0:50052",
    grpc.ServerCredentials.createInsecure(),
    () => {
        console.log("Product gRPC running on port 50052");
    }
);

app.listen(4002, () => {
    console.log("Product service REST running on port 4002");
});