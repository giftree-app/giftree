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
app.use(express.static(__dirname + "frontend/build", { etag: false }));
app.set("port", PORT);

// // Server static assets if in production
// if (process.env.NODE_ENV === "production") {
//   // Set static folder
//   app.use(express.static("frontend/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
//   });
// }

const client = new MongoClient(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
});
client.connect();

api.setApp(app, client);
// If no API routes are hit, send the React app
// app.use(function (req, res) {
//   res.sendFile(path.join(__dirname, "/../frontend/src/pages/Login.tsx"));
// });

app.listen(PORT, function () {
  console.log(
    `App is running, server is listening on port ${process.env.NODE_ENV}`,
    app.get("port")
  );
});
