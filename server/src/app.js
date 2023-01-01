const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const api = require("./routes/api")


app.use(cors({
    origin: "http://localhost:3000"
}));
app.use(morgan('tiny'))
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/V1", api);
// app.use("/V2", "The name of the API file")

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

module.exports = app;