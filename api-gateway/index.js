const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API Gateway Running');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});