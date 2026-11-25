
function requirePermission(permissions, mode = "OR") {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentification requise"
            });
        }

        // Accepter une permission seule ou un tableau
        const requiredPermissions = Array.isArray(permissions)
            ? permissions
            : [permissions];

        const userPermissions = req.user.permissions || [];

        if (!Array.isArray(userPermissions)) {
            return res.status(403).json({
                success: false,
                message: "Permissions invalides"
            });
        }

        let hasPermission;

        if (mode === "AND") {
            hasPermission = requiredPermissions.every(permission =>
                userPermissions.includes(permission)
            );
        } else {
            hasPermission = requiredPermissions.some(permission =>
                userPermissions.includes(permission)
            );
        }

        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: "Permission insuffisante"
            });
        }

        next();
    };
}

module.exports = requirePermission;
