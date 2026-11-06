const { pool } = require("../data/login");
const bcrypt = require("bcrypt");


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
    return passwordMatches ? user : null;
}

module.exports = { login };