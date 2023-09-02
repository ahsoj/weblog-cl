"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashTokens = exports.generateTokens = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const { JWT_REFRESH_SECRET, JWT_ACCESS_SECRET } = process.env;
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ userId: user.id, username: user.username, email: user.email }, JWT_ACCESS_SECRET, {
        expiresIn: '5m',
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user, jti) => {
    return jsonwebtoken_1.default.sign({
        userId: user.id,
        jti,
    }, JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
};
exports.generateRefreshToken = generateRefreshToken;
const generateTokens = (user, jti) => {
    const accessToken = (0, exports.generateAccessToken)(user);
    const refreshToken = (0, exports.generateRefreshToken)(user, jti);
    return {
        accessToken,
        refreshToken,
    };
};
exports.generateTokens = generateTokens;
const hashTokens = (token) => {
    return crypto_1.default.createHash('sha512').update(`${token}`).digest('hex');
};
exports.hashTokens = hashTokens;
//# sourceMappingURL=jwt.js.map