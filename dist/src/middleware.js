import jwt from "jsonwebtoken";
import User from "./models/User.js";
export async function protect(req, res, next) {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (token && token !== "null") {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (user) {
                req.user = user;
            }
            else {
                res.status(401).json({ success: false, message: "Invalid jwt token" });
            }
            next();
        }
        catch (err) {
            console.error(err);
        }
    }
    else {
        res.status(401).json({ success: false, message: "Not authorize to access this route" });
    }
}
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`,
            });
        }
        next();
    };
};
