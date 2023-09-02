import jwt from 'jsonwebtoken';
const { JWT_ACCESS_SECRET } = process.env;
export default function isAuthenticated(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        res.status(401).send('Un-Authenticated Request.');
    }
    try {
        const token = authorization.split(' ')[1];
        const payload = jwt.verify(token, JWT_ACCESS_SECRET);
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
//# sourceMappingURL=middleware.js.map