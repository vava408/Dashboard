const router = require("express").Router();
const { login } = require("../services/auth");


router.post("/login", async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Nom d'utilisateur et mot de passe requis" });
    }

    try {
        const user = await login(username, password);
        if (user) {
            res.json({ success: true, user: user.user, token: user.token });
        } else {
            res.status(401).json({ success: false, message: "Identifiants incorrects" });
        }
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        if (error.message === "JWT_SECRET_MANQUANT") {
            return res.status(503).json({
                success: false,
                message: "Authentification JWT non configurée"
            });
        }
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }

});
module.exports = router;
