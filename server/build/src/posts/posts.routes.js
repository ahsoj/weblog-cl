"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
const express_1 = __importDefault(require("express"));
const posts_services_1 = __importStar(require("./posts.services"));
const cloudinary_1 = require("../utils/cloudinary");
const users_services_1 = __importDefault(require("../users/users.services"));
const middleware_1 = __importDefault(require("../middleware"));
const uuid_1 = require("uuid");
const prisma_1 = require("../utils/prisma");
const router = express_1.default.Router();
exports.default = router;
router.get('/articles', async (_req, res, next) => {
    try {
        const articles = await posts_services_1.default.getAllArticles();
        return res.status(200).json(articles);
    }
    catch (err) {
        next(err);
    }
});
router.get('/articles/search/:_query', async (req, res, next) => {
    try {
        const { _query } = req.params;
        const response = await prisma_1.prisma.$runCommandRaw({
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
        const article = await posts_services_1.default.getArticle(slug);
        delete article.author.passwordHash;
        res.status(200).json(article);
    }
    catch (err) {
        next(err);
    }
});
router.post('/post_view_count', middleware_1.default, async (req, res, next) => {
    try {
        const { postId, userId } = req.body;
        if (!(postId || userId)) {
            return res.status(400).send("MIssing some Cred's");
        }
        const current_view = await posts_services_1.default.countPostView(postId, userId);
        res.status(200).json(current_view);
    }
    catch (err) {
        next(err);
    }
});
router.get('/article/for/:authorId', async (req, res, next) => {
    try {
        const { authorId } = req.params;
        const article = await posts_services_1.default.getPostByAuthor(authorId);
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
        await (0, posts_services_1.runMiddleware)(req, res, posts_services_1.uploadMiddleware);
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const cldRes = await (0, cloudinary_1.handleUpload)(dataURI);
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
        const current_user = await users_services_1.default.findUserById(authorId);
        if (!current_user)
            return res.status(401).send('Un-Authorized request.');
        if (!(title || content || authorId)) {
            return res.status(400).send('Missing required fields');
        }
        const _data = {
            imageUrl: imageUrl ?? '',
            title,
            slug: `${slug}-${(0, uuid_1.v4)().slice(6)}`,
            content,
            published,
            authorId,
        };
        const article = await posts_services_1.default.createArticle(_data, tags);
        res.status(200).json(article);
    }
    catch (err) {
        console.log('error', err);
        res.status(400).json({ message: err.message });
    }
});
//# sourceMappingURL=posts.routes.js.map