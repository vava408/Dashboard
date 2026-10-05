const router = require("express").Router();
const pm2 = require("pm2");
const fs = require("fs");
const { getNom, getStats } = require("../services/pm2.js");
const {  pool } = require("../data/login");

router.get("/getBots", (req, res) => {
    pm2.connect((err) => {
        if (err) {
            console.error(err);

            fs.writeFileSync(
                `logs/Log_PM2_connexion.txt`,
                `[${new Date().toISOString()}] ${err}\n`
            );

            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        pm2.list((err, list) => {
            pm2.disconnect();

            if (err) {
                console.error(err);

                fs.writeFileSync(
                    `logs/Log_PM2_list_du_${Date.now()}.txt`,
                    `[${new Date().toISOString()}] ${err}\n`
                );

                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }
            console.log(list)
            res.json({
                success: true,
                bots: getNom(list)
            });
        });
    });
});

router.get("/restart", (req, res) => {
    const idBot = req.query.botId;

    pm2.restart(idBot, (err, proc) => {
        pm2.disconnect();

        if (err) {
            fs.writeFileSync(
                `logs/Log_PM2_restart.txt`,
                `[${new Date().toISOString()}] ${err}\n`
            );
            return res.status(500).json({
                restart: false,
                error: err.message
            });
        }

        res.json({
            restart: true
        });
    });
});

router.get("/stop", (req, res) => {
    const idBot = req.query.botId;

    pm2.stop(idBot, (err, proc) => {
        pm2.disconnect();

        if (err) {
            fs.writeFileSync(
                `logs/Log_PM2_stop.txt`,
                `[${new Date().toISOString()}] ${err}\n`
            );
            return res.status(500).json({
                stop: false,
                error: err.message
            });
        }

        res.json({
            stop: true
        });
    });
});


router.get("/start", (req, res) => {
    const idBot = req.query.botId;

    pm2.start(idBot, (err, proc) => {
        pm2.disconnect();

        if (err) {
            fs.writeFileSync(
                `logs/Log_PM2_start.txt`,
                `[${new Date().toISOString()}] ${err}\n`
            );
            return res.status(500).json({
                start: false,
                error: err.message
            });
        }

        res.json({
            start: true
        });
    });
});

router.get("/stats", (req, res) => {
            const idBot = req.query.botId;
            pm2.list((err, list) => {
            pm2.disconnect();

            if (err) {
                console.error(err);

                fs.writeFileSync(
                    `logs/Log_PM2_list.txt`,
                    `[${new Date().toISOString()}] ${err}\n`
                );

                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }
			console.log(res)
            res.json({
                success: true,
                bots: getStats(list , idBot )
            });
        });
    });

router.get("/saveBot", async (req, res) => {
    try {
        const [bot] = await pool.execute(
            "SELECT process_pm2, nom, image FROM bot_discord"
        );

        const bots = bot.map((b) => ({
            process_pm2: b.process_pm2,
            nom: b.nom,
            image: `/uploads/${b.image}`
        }));

        res.json({
            bot: bots
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Erreur lors de la récupération des bots"
        });
    }
});
module.exports = router;