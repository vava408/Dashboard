const router = require("express").Router();
const pm2 = require("pm2");
const fs = require("fs");
const { getNom } = require("../services/pm2.js");
const { start } = require("repl");

router.get("/getBots", (req, res) => {
    pm2.connect((err) => {
        if (err) {
            console.error(err);

            fs.writeFileSync(
                `logs/Log_PM2_connexion_du_${Date.now()}.txt`,
                String(err)
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
                    String(err)
                );

                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }
			console.log(res)
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
                `logs/Log_PM2_restart_du_${Date.now()}.txt`,
                String(err)
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
                `logs/Log_PM2_stop_du_${Date.now()}.txt`,
                String(err)
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
                `logs/Log_PM2_start_du_${Date.now()}.txt`,
                String(err)
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

router.get("/start", (req, res) => {
    const idBot = req.query.botId;

    pm2.start(idBot, (err, proc) => {
        pm2.disconnect();

        if (err) {
            fs.writeFileSync(
                `logs/Log_PM2_start_du_${Date.now()}.txt`,
                String(err)
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

module.exports = router;