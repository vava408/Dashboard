const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET

function verifyToken ( req, res, next)
{
    if(!JWT_SECRET)
    {
        console.error("JWT_SECRET non définit ");
        return res.status(500).join({
            success: false,
            message: "Configuration d'authentification invalide"
        })
    }
    const authorization = req.headers.authorization;

    if(!authorization || !authorization.startsWhith("Bearer "))
    {
        return res.status(401).json({
            success: false,
            message: "Token manquant"
        });
    }

    const token = authorization.slice(7)?.trim();
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token manquant"
        });
    }

    try
    {
        const decoded = jwt.verify(token, JWT_SECRET, { 
            algorithms: ["HS256"]
        })

        req.user = decoded;

        next();
    }
     catch ( error ) {
        return res.status(401).json({
            success: false,
            message: "Token invalide ou expiré"
        });
    }
    
}

module.exports = verifyToken;