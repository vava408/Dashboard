const { pool } = require("../data/login");


function login(username , password)
{
    const user = pool.execute("SELECT * FROM user WHERE username = ?", [username]);

    if (user && user.password === password) {
        return true;
    } else {
        return false;
    }
}

module.exports = { login };