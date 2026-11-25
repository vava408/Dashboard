require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const verifyToken = require("./middleware/verifyToken")

app.use(cors());
app.use(express.json());
app.use("/api/login", require("./routes/auth"));
const explorer = require("./routes/explorer");

app.use("/uploads", verifyToken, express.static(path.join(__dirname, "uploads")));
app.use("/api", explorer.router);
app.use("/api/system",verifyToken, require("./routes/system"));
app.use("/api/bots",verifyToken, require("./routes/bots"));
app.use("/api/docker",verifyToken, require("./routes/docker"));
app.use("/api/bdd", verifyToken, require("./routes/baseDeDonnee"));

app.get("/docs", explorer.renderExplorer);

app.get("/", (req, res) => {
    res.json({
        name: "AirPanel Pro",
        status: "online"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`API lancée sur le port ${PORT}`);
});