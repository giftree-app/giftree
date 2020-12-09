const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
var api = require("./api.js");
require("dotenv").config();

const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("frontend/build", { etag: false }));
app.set("port", PORT);

const client = new MongoClient(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
});
client.connect();

api.setApp(app, client);

app.listen(PORT, function () {
  console.log(
    `App is running, server is listening on port ${process.env.NODE_ENV}`,
    app.get("port")
  );
});

app.get("*", function (req, res) {
  res.redirect("/");
});
