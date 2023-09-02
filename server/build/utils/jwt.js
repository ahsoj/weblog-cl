import jwt from 'jsonwebtoken';
import crypto from 'crypto';
const { JWT_REFRESH_SECRET, JWT_ACCESS_SECRET } = process.env;
export const generateAccessToken = (user) => {
    return jwt.sign({ userId: user.id, username: user.username, email: user.email }, JWT_ACCESS_SECRET, {
        expiresIn: '5m',
    });
};
export const generateRefreshToken = (user, jti) => {
    return jwt.sign({
        userId: user.id,
        jti,
    }, JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
};
export const generateTokens = (user, jti) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, jti);
    return {
        accessToken,
        refreshToken,
    };
};
export const hashTokens = (token) => {
    return crypto.createHash('sha512').update(`${token}`).digest('hex');
};
//# sourceMappingURL=jwt.js.map