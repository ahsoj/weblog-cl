"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../utils/prisma");
class UserService {
    async findUserByEmail(email) {
        return await prisma_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
    async syncProfile(userId) {
        const profileData = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                socialLinks: true,
                followers: {
                    select: {
                        follower: {
                            select: {
                                id: true,
                                username: true,
                                profileUrl: true,
                            },
                        },
                    },
                },
                following: {
                    select: {
                        following: {
                            select: {
                                id: true,
                                username: true,
                                profileUrl: true,
                            },
                        },
                    },
                },
                post: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        post: true,
                    },
                },
            },
        });
        delete profileData.passwordHash;
        return profileData;
    }
    async resyncProfile(profileInfo) {
        const { userId, username, bio, socialLinks } = profileInfo;
        const upsertNewData = await prisma_1.prisma.user.update({
            where: { id: userId },
            data: {
                username: username,
                bio: bio,
                // socialLinks: {
                //   updateMany: {
                //     where: { userId },
                //     data: socialLinks,
                //   },
                // },
            },
        });
        delete upsertNewData.passwordHash;
        return upsertNewData;
    }
    async createBookmark({ userId, postId }) {
        const bookmark = await prisma_1.prisma.bookmark.findFirst({
            where: { userId },
        });
        if (bookmark && bookmark.postId === postId) {
            // already bookmarked this post
            return await prisma_1.prisma.bookmark.delete({ where: { id: bookmark.id } });
        }
        else {
            return await prisma_1.prisma.bookmark.create({ data: { postId, userId } });
        }
    }
    async createFollows(followerId, followingId) {
        const xfollow = await prisma_1.prisma.follows.findMany({ where: { followerId } });
        const xid = xfollow && xfollow.find((xf) => xf.followingId === followingId);
        if (xfollow && xid) {
            return await prisma_1.prisma.follows.delete({
                where: {
                    id: xid.id,
                },
            });
        }
        else {
            return await prisma_1.prisma.follows.create({ data: { followerId, followingId } });
        }
    }
    async myFollowers(userId) {
        const follower = await prisma_1.prisma.follows.findMany({
            where: { followingId: userId },
        });
        return follower;
    }
    async whoIFollow(userId) {
        const followingId = [];
        const following = await prisma_1.prisma.follows.findMany({
            where: { followerId: userId },
        });
        following.map((save) => followingId.push(save.followingId));
        return followingId;
    }
    async getSavedTopics(userId) {
        const saved = await prisma_1.prisma.bookmark.findMany({
            where: { userId },
            include: {
                post: {
                    select: {
                        title: true,
                        slug: true,
                        imageUrl: true,
                    },
                },
            },
        });
        return saved;
    }
    async getSavedTopicsId(userId) {
        const sorted = [];
        const saved = await prisma_1.prisma.bookmark.findMany({
            where: { userId },
            select: { postId: true },
        });
        saved.map((save) => sorted.push(save.postId));
        return sorted;
    }
    async getLikedArticle(userId) {
        const sorted = [];
        const saved = await prisma_1.prisma.like.findMany({
            where: { userId },
            select: { postId: true },
        });
        saved.map((save) => sorted.push(save.postId));
        return sorted;
    }
    async createUserWithPassword(user) {
        user.passwordHash = bcrypt_1.default.hashSync(user.passwordHash, 12);
        return await prisma_1.prisma.user.create({ data: user });
    }
    async findUserById(id) {
        const user = await prisma_1.prisma.user.findUnique({ where: { id } });
        delete user.passwordHash;
        return user;
    }
    async exists(email, userId) {
        if (email) {
            const exist = await prisma_1.prisma.user.findUnique({ where: { email } });
            return exist?.email ? true : false;
        }
        else if (userId) {
            const exist = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
            return exist.id ? true : false;
        }
    }
    deleteUser(id) {
        const deletedUser = this.findUserById(id);
        if (!deletedUser) {
            throw Error('No such a user');
        }
        return prisma_1.prisma.user.delete({
            where: { id },
        });
    }
}
exports.default = new UserService();
//# sourceMappingURL=users.services.js.map