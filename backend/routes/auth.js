const router = require("express").Router();
const { pool } = require("../data/login");
const { login } = require("../services/auth");


router.get("/login", async (req, res) => {

    const username = req.query.username;
    const password = req.query.password;

    try {
        const etat = await login(username, password);
        if (etat) {
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: "Identifiants incorrects" });
        }
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }

});
module.exports = router;
