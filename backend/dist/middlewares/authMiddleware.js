"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const token_utils_1 = require("../utils/token.utils");
const authMiddleware = (req, res, next) => {
    var _a;
    try {
        // Extract token from headers or cookies
        const token = req.cookies.auth_token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
        console.log("token", token);
        if (!token) {
            res.status(401).json({ message: 'Authentication token is missing' });
            return; // Ensure function ends execution
        }
        // Verify token
        const decoded = (0, token_utils_1.verifyToken)(token);
        // Attach user details to req
        req.user = {
            _id: decoded.id,
            role: decoded.role,
        };
        next(); // Continue to the next middleware or route handler
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};
exports.authMiddleware = authMiddleware;
