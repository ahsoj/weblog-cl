import bcrypt from 'bcrypt';
import { prisma } from '@/utils/prisma.js';
class UserService {
    async findUserByEmail(email) {
        return await prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
    async syncProfile(userId) {
        const profileData = await prisma.user.findUnique({
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
        const upsertNewData = await prisma.user.update({
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
        const bookmark = await prisma.bookmark.findFirst({
            where: { userId },
        });
        if (bookmark && bookmark.postId === postId) {
            // already bookmarked this post
            return await prisma.bookmark.delete({ where: { id: bookmark.id } });
        }
        else {
            return await prisma.bookmark.create({ data: { postId, userId } });
        }
    }
    async createFollows(followerId, followingId) {
        const xfollow = await prisma.follows.findMany({ where: { followerId } });
        const xid = xfollow && xfollow.find((xf) => xf.followingId === followingId);
        if (xfollow && xid) {
            return await prisma.follows.delete({
                where: {
                    id: xid.id,
                },
            });
        }
        else {
            return await prisma.follows.create({ data: { followerId, followingId } });
        }
    }
    async myFollowers(userId) {
        const follower = await prisma.follows.findMany({
            where: { followingId: userId },
        });
        return follower;
    }
    async whoIFollow(userId) {
        const followingId = [];
        const following = await prisma.follows.findMany({
            where: { followerId: userId },
        });
        following.map((save) => followingId.push(save.followingId));
        return followingId;
    }
    async getSavedTopics(userId) {
        const saved = await prisma.bookmark.findMany({
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
        const saved = await prisma.bookmark.findMany({
            where: { userId },
            select: { postId: true },
        });
        saved.map((save) => sorted.push(save.postId));
        return sorted;
    }
    async getLikedArticle(userId) {
        const sorted = [];
        const saved = await prisma.like.findMany({
            where: { userId },
            select: { postId: true },
        });
        saved.map((save) => sorted.push(save.postId));
        return sorted;
    }
    async createUserWithPassword(user) {
        user.passwordHash = bcrypt.hashSync(user.passwordHash, 12);
        return await prisma.user.create({ data: user });
    }
    async findUserById(id) {
        const user = await prisma.user.findUnique({ where: { id } });
        delete user.passwordHash;
        return user;
    }
    async exists(email, userId) {
        if (email) {
            const exist = await prisma.user.findUnique({ where: { email } });
            return exist?.email ? true : false;
        }
        else if (userId) {
            const exist = await prisma.user.findUnique({ where: { id: userId } });
            return exist.id ? true : false;
        }
    }
    deleteUser(id) {
        const deletedUser = this.findUserById(id);
        if (!deletedUser) {
            throw Error('No such a user');
        }
        return prisma.user.delete({
            where: { id },
        });
    }
}
export default new UserService();
//# sourceMappingURL=users.services.js.map