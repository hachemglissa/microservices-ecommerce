const express = require('express');
const cors = require('cors');
const productClient = require('./grpc/productClient');
const orderClient = require('./grpc/orderClient');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('API Gateway Running');
});

// REST Routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers(productClient, orderClient),
    graphiql: true
}));
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});