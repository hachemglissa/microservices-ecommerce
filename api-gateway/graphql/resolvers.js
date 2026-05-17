module.exports = (productClient, orderClient, userClient) => ({

    /* ================= PRODUCT ================= */
    getProducts: () => {
        return new Promise((resolve, reject) => {
            productClient.GetProducts({}, (err, res) => {
                if (err) return reject(err);
                resolve(res.products);
            });
        });
    },

    getProduct: ({ id }) => {
        return new Promise((resolve, reject) => {
            productClient.GetProduct({ id }, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    },

    /* ================= ORDER ================= */
    getOrders: () => {
        return new Promise((resolve, reject) => {
            orderClient.GetOrders({}, (err, res) => {
                if (err) return reject(err);
                resolve(res.orders);
            });
        });
    },

    getOrder: ({ id }) => {
        return new Promise((resolve, reject) => {
            orderClient.GetOrder({ id }, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    },

    createOrder: ({ userId, productId }) => {
        return new Promise((resolve, reject) => {
            orderClient.CreateOrder({ userId, productId }, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

});