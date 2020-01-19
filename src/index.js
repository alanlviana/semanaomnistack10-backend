const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const routes = require('./routes');
const cors = require('cors');
const {setupWebSocket} = require('./websocket')
const dotenv = require('dotenv');

// Load .env file into process env variables
dotenv.config();

const app = express();
const server = http.Server(app);

const mongoConnectionString = process.env.MONGO_URL;
const port = process.env.PORT;

setupWebSocket(server);

mongoose.connect(mongoConnectionString,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use(cors());

app.use(express.json());
app.use(routes);

server.listen(port);