const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const path = require("path");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.set("port", process.env.PORT || 5000);

const MongoClient = require("mongodb").MongoClient;

require("dotenv").config();
const url = process.env.MONGODB_URI;

const client = new MongoClient(url, { useUnifiedTopology: true });
client.connect();

var api = require("./api.js");
api.setApp(app, client);
