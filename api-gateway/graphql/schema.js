const { buildSchema } = require('graphql');

const schema = buildSchema(`

    type Product {
        id: Int
        name: String
        price: Float
    }

    type Order {
        id: ID
        status: String
    }

    type Query {

        getProducts: [Product]

        getOrder(id: ID!): Order
    }
`);

module.exports = schema;