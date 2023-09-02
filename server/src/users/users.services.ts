import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma';
import { User } from '../types/types';

// function exclude<User, Key extends keyof User>(
//   user: User,
//   keys: Key[]
// ): Omit<User, Key> {
//   return Object.fromEntries(
//     Object.entries(user).filter(([key]) => !keys.includes(key))
//   );
// }

type ProfileInfo = {
  userId: string;
  username?: string;
  bio?: string;
  socialLinks?: {
    site_name: string;
    link: string;
  }[];
};

class UserService {
  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
  async syncProfile(userId: string) {
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
  async resyncProfile(profileInfo: ProfileInfo) {
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
  async createBookmark({ userId, postId }: { userId: string; postId: string }) {
    const bookmark = await prisma.bookmark.findFirst({
      where: { userId },
    });
    if (bookmark && bookmark.postId === postId) {
      // already bookmarked this post
      return await prisma.bookmark.delete({ where: { id: bookmark.id } });
    } else {
      return await prisma.bookmark.create({ data: { postId, userId } });
    }
  }
  async createFollows(followerId: string, followingId: string) {
    const xfollow = await prisma.follows.findMany({ where: { followerId } });
    const xid = xfollow && xfollow.find((xf) => xf.followingId === followingId);
    if (xfollow && xid) {
      return await prisma.follows.delete({
        where: {
          id: xid.id,
        },
      });
    } else {
      return await prisma.follows.create({ data: { followerId, followingId } });
    }
  }
  async myFollowers(userId: string) {
    const follower = await prisma.follows.findMany({
      where: { followingId: userId },
    });
    return follower;
  }
  async whoIFollow(userId: string) {
    const followingId: string[] = [];
    const following = await prisma.follows.findMany({
      where: { followerId: userId },
    });
    following.map((save) => followingId.push(save.followingId));
    return followingId;
  }
  async getSavedTopics(userId: string) {
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
  async getSavedTopicsId(userId: string) {
    const sorted: string[] = [];
    const saved = await prisma.bookmark.findMany({
      where: { userId },
      select: { postId: true },
    });
    saved.map((save) => sorted.push(save.postId));
    return sorted;
  }
  async getLikedArticle(userId: string) {
    const sorted: string[] = [];
    const saved = await prisma.like.findMany({
      where: { userId },
      select: { postId: true },
    });
    saved.map((save) => sorted.push(save.postId));
    return sorted;
  }
  async createUserWithPassword(
    user: Pick<User, 'username' | 'email' | 'passwordHash'>
  ) {
    user.passwordHash = bcrypt.hashSync(user.passwordHash, 12);
    return await prisma.user.create({ data: user });
  }
  async findUserById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    delete user.passwordHash;
    return user;
  }
  async exists(email?: string, userId?: string) {
    if (email) {
      const exist = await prisma.user.findUnique({ where: { email } });
      return exist?.email ? true : false;
    } else if (userId) {
      const exist = await prisma.user.findUnique({ where: { id: userId } });
      return exist.id ? true : false;
    }
  }
  deleteUser(id: string) {
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
