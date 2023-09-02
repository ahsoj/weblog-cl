import express from 'express';
import PostsService, { runMiddleware, uploadMiddleware, } from './posts.services.js';
import { handleUpload } from '@/utils/cloudinary.js';
import UsersServices from '@/users/users.services.js';
import isAuthenticated from '@/middleware.js';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/utils/prisma.js';
const router = express.Router();
router.get('/articles', async (_req, res, next) => {
    try {
        const articles = await PostsService.getAllArticles();
        return res.status(200).json(articles);
    }
    catch (err) {
        next(err);
    }
});
router.get('/articles/search/:_query', async (req, res, next) => {
    try {
        const { _query } = req.params;
        const response = await prisma.$runCommandRaw({
            aggregate: 'posts',
            pipeline: [
                {
                    $search: {
                        index: 'post_indicies',
                        text: {
                            query: _query,
                            path: {
                                wildcard: '*',
                            },
                        },
                        tracking: {
                            searchTerms: _query,
                        },
                        sort: {
                            createdAt: -1,
                        },
                    },
                },
                {
                    $limit: 20,
                },
            ],
            cursor: {},
            explain: false,
        });
        res.status(200).json(response.cursor['firstBatch']);
    }
    catch (error) {
        res.status(404).send('Not Found');
        next(error);
    }
});
router.get('/article/:slug', async (req, res, next) => {
    try {
        const { slug } = req.params;
        const article = await PostsService.getArticle(slug);
        delete article.author.passwordHash;
        res.status(200).json(article);
    }
    catch (err) {
        next(err);
    }
});
router.post('/post_view_count', isAuthenticated, async (req, res, next) => {
    try {
        const { postId, userId } = req.body;
        if (!(postId || userId)) {
            return res.status(400).send("MIssing some Cred's");
        }
        const current_view = await PostsService.countPostView(postId, userId);
        res.status(200).json(current_view);
    }
    catch (err) {
        next(err);
    }
});
router.get('/article/for/:authorId', async (req, res, next) => {
    try {
        const { authorId } = req.params;
        const article = await PostsService.getPostByAuthor(authorId);
        res.status(200).json(article);
    }
    catch (err) {
        next(err);
    }
});
router.post('/article/upload', async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.files);
        await runMiddleware(req, res, uploadMiddleware);
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const cldRes = await handleUpload(dataURI);
        var imageUrl = cldRes.secure_url;
        console.log(imageUrl);
        res.status(200).json(imageUrl);
    }
    catch (err) {
        console.log('error', err);
        res.status(400).json({ message: err.message });
    }
});
router.post('/article/create', async (req, res) => {
    try {
        const { data, tags } = req.body;
        const { title, content, slug, published, authorId, imageUrl } = data;
        const current_user = await UsersServices.findUserById(authorId);
        if (!current_user)
            return res.status(401).send('Un-Authorized request.');
        if (!(title || content || authorId)) {
            return res.status(400).send('Missing required fields');
        }
        const _data = {
            imageUrl: imageUrl ?? '',
            title,
            slug: `${slug}-${uuidv4().slice(6)}`,
            content,
            published,
            authorId,
        };
        const article = await PostsService.createArticle(_data, tags);
        res.status(200).json(article);
    }
    catch (err) {
        console.log('error', err);
        res.status(400).json({ message: err.message });
    }
});
export { router as default };
//# sourceMappingURL=posts.routes.js.map