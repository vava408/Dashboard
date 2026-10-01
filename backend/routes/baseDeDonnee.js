const router = require("express").Router();
const { testConnection, pool } = require("../data/login");
const multer = require("multer");

const upload = multer({
	dest: "uploads/"
});

router.get("/test", async (req, res) => {
    try {
        await testConnection();
        res.json({
            success: true,
            message: "Connexion a la base de donnees reussie"
        });
    } catch (error) {
        console.error("Connexion a la base de donnees echouee:", error.message);
        res.status(503).json({
            success: false,
            message: "Connexion a la base de donnees echouee",
            error: error.code || "DB_CONNECTION_ERROR"
        });
    }
});

router.post("/creerBot", async (req, res) =>
{
    const processPM2 = req.body.processPM2;
    const nomBot = req.body.nomBot;
    const image = req.file?.filename + ".png" || null;
    var etat = true;
    var erreur = "";

    if (processPM2 == null || nomBot == null)
    {
        etat = false; 
        erreur = "Le nom du bot et le processus PM2 sont obligatoires";
    }
    else
    {
        upload.single(image+"png")
        const [bots] = await pool.execute(
            "SELECT * FROM bot_discord WHERE nom = ? AND process_pm2 = ?",
            [nomBot, processPM2]
        );

        if (bots.length > 0)
        {
            etat = false;
            erreur = "Ce bot existe deja";
        }
        else
        {
            await pool.execute(
                "INSERT INTO bot_discord (nom, image, process_pm2) VALUES (?, ?, ?)",
                [nomBot, image || null, processPM2]
            );
        }
    }

    res.json({
        success: etat,
        processPM2,
        nomBot,
        image,
        erreur
    });
});

module.exports = router;
