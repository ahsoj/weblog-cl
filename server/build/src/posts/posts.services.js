"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMiddleware = exports.uploadMiddleware = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const prisma_1 = require("../utils/prisma");
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage: storage,
});
exports.uploadMiddleware = exports.upload.single('article_asset');
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}
exports.runMiddleware = runMiddleware;
class PostsService {
    async getAllArticles() {
        const allpost = await prisma_1.prisma.post.findMany({
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
    async createFeed(userId) {
        let feedPosts = [];
        if (userId) {
            const current_user = await prisma_1.prisma.user.findUnique({
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
    async getPostByAuthor(authorId) {
        const byAuthor = await prisma_1.prisma.post.findMany({
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
        if (byAuthor)
            return byAuthor;
        return null;
    }
    async getArticle(slug) {
        const this_post = await prisma_1.prisma.post.findUnique({
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
    async createArticle(data, tags) {
        console.log('tags', tags ?? '');
        const tag = [];
        for (const _ of tags) {
            tag.push(_.name);
        }
        const create_article = await prisma_1.prisma.post.create({
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
    async countPostView(postId, userId) {
        const prev_view = await prisma_1.prisma.postView.findFirst({
            where: { postId },
        });
        if (!prev_view || (prev_view && prev_view.userId !== userId)) {
            return await prisma_1.prisma.postView.create({
                data: { postId, userId },
            });
        }
        return null;
    }
}
exports.default = new PostsService();
//# sourceMappingURL=posts.services.js.map