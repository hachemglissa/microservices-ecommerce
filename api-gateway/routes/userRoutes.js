const express = require('express');
const router = express.Router();

const userClient = require('../grpc/userClient');

/* ================= CREATE USER ================= */
router.post('/', (req, res) => {

    const { name } = req.body;

    userClient.CreateUser({ name }, (err, response) => {
        if (err) return res.status(500).json(err);

        res.json(response);
    });
});

/* ================= GET ALL USERS ================= */
router.get('/', (req, res) => {

    userClient.GetUsers({}, (err, response) => {
        if (err) return res.status(500).json(err);

        res.json(response.users);
    });
});

/* ================= GET USER BY ID ================= */
router.get('/:id', (req, res) => {

    userClient.GetUser({ id: req.params.id }, (err, response) => {
        if (err) return res.status(500).json(err);

        res.json(response);
    });
});

/* ================= UPDATE USER ================= */
router.put('/:id', (req, res) => {

    userClient.UpdateUser(
        { id: req.params.id, ...req.body },
        (err, response) => {
            if (err) return res.status(500).json(err);

            res.json(response);
        }
    );
});

/* ================= DELETE USER ================= */
router.delete('/:id', (req, res) => {

    userClient.DeleteUser({ id: req.params.id }, (err, response) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "User deleted successfully" });
    });
});

module.exports = router;