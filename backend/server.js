require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/system", require("./routes/system"));
app.use("/api/bots", require("./routes/bots"));


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