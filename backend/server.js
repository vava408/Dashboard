require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const explorer = require("./routes/explorer");

app.use("/api", explorer.router);
app.use("/api/system", require("./routes/system"));
app.use("/api/bots", require("./routes/bots"));
app.use("/api/docker", require("./routes/docker"));
app.use("/api/bdd", require("./routes/baseDeDonnee"));
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