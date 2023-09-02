"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { JWT_ACCESS_SECRET } = process.env;
function isAuthenticated(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        res.status(401).send('Un-Authenticated Request.');
    }
    try {
        const token = authorization.split(' ')[1];
        const payload = jsonwebtoken_1.default.verify(token, JWT_ACCESS_SECRET);
        req.body = payload;
    }
    catch (err) {
        res.status(401);
        if (err.name === 'TokenExpiredError') {
            throw new Error(err.name);
        }
    }
    return next();
}
exports.default = isAuthenticated;
//# sourceMappingURL=middleware.js.map