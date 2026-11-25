const { pool } = require("../data/login");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET; 


if (!JWT_SECRET) {
    console.warn("JWT_SECRET n'est pas défini. L'authentification JWT est désactivée.");
}


async function login(username, password)
{
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET_MANQUANT");
    }

    const [rows] = await pool.execute(
        "SELECT * FROM `user` WHERE username = ? LIMIT 1",
        [username]
    );

    const user = rows[0];
    if (!user || !user.password) {
        return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
	delete user.password;

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
		return {user: user, token : token}; // Retourner l'utilisateur sans le mot de passe
	}
    return false;
}

module.exports = { login };