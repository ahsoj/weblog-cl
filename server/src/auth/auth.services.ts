import { prisma } from '../utils/prisma';
import { hashTokens } from '../utils/jwt';

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
  findRefreshTokenById(id: string) {
    return prisma.refreshToken.findUnique({
      where: { id },
    });
  }
  deleteRefreshToken(id: string) {
    return prisma.refreshToken.update({
      where: { id },
      data: { revoked: true },
    });
  }
  revokedTokens(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }
}

export default new AuthService();
