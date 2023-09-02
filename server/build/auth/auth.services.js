import { prisma } from '@/utils/prisma.js';
import { hashTokens } from '@/utils/jwt.js';
class AuthService {
    addRefreshTokenWhiteList({ refreshToken, userId }) {
        return prisma.refreshToken.create({
            data: {
                hashedToken: hashTokens(refreshToken),
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
        return prisma.refreshToken.findUnique({
            where: { id },
        });
    }
    deleteRefreshToken(id) {
        return prisma.refreshToken.update({
            where: { id },
            data: { revoked: true },
        });
    }
    revokedTokens(userId) {
        return prisma.refreshToken.updateMany({
            where: { userId },
            data: { revoked: true },
        });
    }
}
export default new AuthService();
//# sourceMappingURL=auth.services.js.map