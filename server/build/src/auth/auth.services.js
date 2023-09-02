"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
const jwt_1 = require("../utils/jwt");
class AuthService {
    addRefreshTokenWhiteList({ refreshToken, userId }) {
        return prisma_1.prisma.refreshToken.create({
            data: {
                hashedToken: (0, jwt_1.hashTokens)(refreshToken),
                userId,
            },
            include: {
                user: {
                    select: {
                        email: true,
                        username: true,
                    },
                },
            },
        });
    }
    findRefreshTokenById(id) {
        return prisma_1.prisma.refreshToken.findUnique({
            where: { id },
        });
    }
    deleteRefreshToken(id) {
        return prisma_1.prisma.refreshToken.update({
            where: { id },
            data: { revoked: true },
        });
    }
    revokedTokens(userId) {
        return prisma_1.prisma.refreshToken.updateMany({
            where: { userId },
            data: { revoked: true },
        });
    }
}
exports.default = new AuthService();
//# sourceMappingURL=auth.services.js.map