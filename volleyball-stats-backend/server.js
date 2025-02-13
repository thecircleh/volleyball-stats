const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let logs = [];

app.post('/log', (req, res) => {
    const { player, action } = req.body;
    logs.push({ player, action });
    res.status(200).send({ message: 'Stat logged' });
});

app.get('/logs', (req, res) => {
    res.json(logs);
});

app.listen(5000, () => console.log('Server running on port 5000'));
