const express = require('express');
const router = express.Router();

const productClient = require('../grpc/productClient');

router.post('/', (req, res) => {
    const { name, price } = req.body;

    productClient.CreateProduct({ name, price }, (err, response) => {
        if (err) return res.status(500).json(err);

        res.json(response);
    });
});

// GET products via gRPC
router.get('/', (req, res) => {

    productClient.GetProducts({}, (err, response) => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(response.products);
    });
});

router.get('/search', (req, res) => {

    productClient.SearchProduct({ name: req.query.name }, (err, response) => {

        if (err) {
            console.log("SEARCH ERROR =", err); // 🔥 IMPORTANT
            return res.status(500).json(err);
        }

        res.json(response.products);
    });
});

router.get('/:id', (req, res) => {

    productClient.GetProduct({ id: req.params.id }, (err, response) => {
        if (err) return res.status(500).json(err);

        res.json(response);
    });
});

router.put('/:id', (req, res) => {

    productClient.UpdateProduct(
        { id: req.params.id, ...req.body },
        (err, response) => {
            if (err) return res.status(500).json(err);

            res.json(response);
        }
    );
});

router.delete('/:id', (req, res) => {

    productClient.DeleteProduct({ id: req.params.id }, (err, response) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Deleted successfully" });
    });
});

module.exports = router;