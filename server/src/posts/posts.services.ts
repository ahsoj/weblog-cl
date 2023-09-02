import multer from 'multer';
import { prisma } from '../utils/prisma';
import type { Post } from '@prisma/client';

const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
});

export const uploadMiddleware = upload.single('article_asset');

export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

type NewPost = Pick<
  Post,
  'title' | 'slug' | 'imageUrl' | 'content' | 'published' | 'authorId'
>;

class PostsService {
  async getAllArticles() {
    const allpost = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        tag: true,
        author: {
          include: {
            _count: {
              select: {
                followers: true,
                post: true,
              },
            },
          },
        },
        _count: {
          select: {
            comment: true,
            like: true,
            postView: true,
            saved: true,
          },
        },
      },
    });
    allpost.map((article) => delete article.author.passwordHash);
    return allpost;
  }

  async createFeed(userId?: string) {
    let feedPosts = [];
    if (userId) {
      const current_user = await prisma.user.findUnique({
        where: { id: userId },
      });
      const post = await this.getAllArticles();
    }
  }
  // async attachAtgs(tags: string[], postId: string) {
  //   for (const tag of tags) {
  //     await prisma.tag.c
  //   }
  // }
  async getPostByAuthor(authorId: string) {
    const byAuthor = await prisma.post.findMany({
      where: { authorId },
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    if (byAuthor) return byAuthor;
    return null;
  }
  async getArticle(slug: string) {
    const this_post = await prisma.post.findUnique({
      where: { slug: slug },
      include: {
        tag: true,
        author: {
          include: {
            _count: {
              select: {
                followers: true,
                post: true,
              },
            },
          },
        },
        comment: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            _count: {
              select: {
                commentLike: true,
              },
            },
          },
        },
        _count: {
          select: {
            like: true,
            postView: true,
          },
        },
      },
    });
    delete this_post.author.passwordHash;
    return this_post;
  }
  /**
   *  tags must be provide like `[ { name: 'webdev' }, { name: 'code' }, { name: 'news' } ]`
   * @param data
   * @param tags
   * @returns
   */
  async createArticle(data: NewPost, tags?: Array<{ name: string }>) {
    console.log('tags', tags ?? '');
    const tag: string[] = [];
    for (const _ of tags) {
      tag.push(_.name);
    }

    const create_article = await prisma.post.create({
      data: {
        ...data,
        tag: {
          createMany: {
            data: tags,
          },
        },
      },
    });

    return create_article;
  }
  async countPostView(postId: string, userId: string) {
    const prev_view = await prisma.postView.findFirst({
      where: { postId },
    });
    if (!prev_view || (prev_view && prev_view.userId !== userId)) {
      return await prisma.postView.create({
        data: { postId, userId },
      });
    }
    return null;
  }
}

export default new PostsService();
