const express = require('express');
const router = express.Router();

const orderClient = require('../grpc/orderClient');

/* ================= CREATE ORDER ================= */
router.post('/', (req, res) => {

    const { userId, productId } = req.body;

    orderClient.CreateOrder({ userId, productId }, (err, response) => {
        if (err) return res.status(500).json(err);

        res.json(response);
    });
});

/* ================= GET ALL ORDERS ================= */
router.get('/', (req, res) => {

    orderClient.GetOrders({}, (err, response) => {
        if (err) return res.status(500).json(err);

        res.json(response.orders);
    });
});

/* ================= GET ORDER BY ID ================= */
router.get('/:id', (req, res) => {

    orderClient.GetOrder({ id: req.params.id }, (err, response) => {
        if (err) return res.status(500).json(err);

        res.json(response);
    });
});

/* ================= UPDATE ORDER ================= */
router.put('/:id', (req, res) => {

    orderClient.UpdateOrder(
        { id: req.params.id, ...req.body },
        (err, response) => {
            if (err) return res.status(500).json(err);

            res.json(response);
        }
    );
});

/* ================= DELETE ORDER ================= */
router.delete('/:id', (req, res) => {

    orderClient.DeleteOrder({ id: req.params.id }, (err, response) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Order deleted successfully" });
    });
});

module.exports = router;