const { pool } = require("../data/login");


async function login(username, password)
{
    consle.log("login", username, password);
    const [rows] = await pool.execute(
        "SELECT * FROM `user` WHERE username = ? AND password = ? LIMIT 1",
        [username, password]
    );

    return rows[0] || null;
}

module.exports = { login };