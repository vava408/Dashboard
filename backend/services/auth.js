const { pool } = require("../data/login");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "votre_clé_secrète"; 


async function login(username, password)
{
    const [rows] = await pool.execute(
        "SELECT * FROM `user` WHERE username = ? LIMIT 1",
        [username]
    );

    const user = rows[0];
    if (!user || !user.password) {
        return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    const token = jwt.sign(
        {
            userId: user.id,
            username: user.username
        },
        JWT_SECRET,
        {
            expiresIn: "1h",
            algorithm: "HS256"
        }
    );



	if (passwordMatches) {
		// Supprimer le mot de passe avant de renvoyer l'utilisateur
		delete user.password;
		return {user: user, token : token}; // Retourner l'utilisateur sans le mot de passe
	}
    return false;
}

module.exports = { login };