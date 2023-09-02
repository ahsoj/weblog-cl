"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
const express_1 = __importDefault(require("express"));
const feedbacks_services_1 = __importDefault(require("./feedbacks.services"));
const middleware_1 = __importDefault(require("../middleware"));
const prisma_1 = require("../utils/prisma");
const router = express_1.default.Router();
exports.default = router;
router.get('/comments/:postId', async (req, res, next) => {
    try {
        const { postId } = req.params;
        const comments = await feedbacks_services_1.default.getAllCommentsByPostId(postId);
        res.status(200).json(comments);
    }
    catch (err) {
        next(err);
    }
});
router.post('/likes-dislikes/', middleware_1.default, async (req, res, next) => {
    try {
        const { like } = req.body;
        const { postId, userId } = like;
        if (!(postId || userId)) {
            return res.status(400).send("Missing some Cred's");
        }
        console.log(like);
        const current_post = await prisma_1.prisma.like.findFirst({
            where: { postId: String(postId) },
        });
        if (current_post && userId === current_post.userId) {
            await feedbacks_services_1.default.disLike(current_post.id);
        }
        else {
            await feedbacks_services_1.default.createLike(like);
        }
        res.status(200).send('success');
    }
    catch (err) {
        res.status(400).send('Bad request');
        next(err);
    }
});
router.delete('/dislike/:likeId', middleware_1.default, async (req, res, next) => {
    try {
        const { likeId } = req.params;
        await feedbacks_services_1.default.disLike(likeId);
        res.status(204).send('Dislike');
    }
    catch (err) {
        res.status(400).send('Bad request');
        next(err);
    }
});
router.delete('/delete_comment/:commentId', middleware_1.default, async (req, res, next) => {
    try {
        const { commentId } = req.params;
        await feedbacks_services_1.default.deleteComment(commentId);
        res.status(204).send('Comment deleted');
    }
    catch (err) {
        res.status(400).send('Bad request');
        next(err);
    }
});
router.post('/comment_like', middleware_1.default, async (req, res, next) => {
    try {
        const { comment_like } = req.body;
        const { commentId, userId } = comment_like;
        if (!(commentId || userId)) {
            return res.status(400).send("MIssing some Cred's");
        }
        const commentLike = await feedbacks_services_1.default.createCommentLike(comment_like);
        res.status(201).json(commentLike);
    }
    catch (err) {
        next(err);
    }
});
router.post('/comments', middleware_1.default, async (req, res, next) => {
    try {
        const { comment } = req.body;
        const { content, postId, userId } = comment;
        if (!(postId || userId || content)) {
            res.status(400).send("Missing required Cred's");
        }
        const createComment = await feedbacks_services_1.default.createComment(comment);
        res.status(200).json(createComment);
    }
    catch (err) {
        res.status(400).send('Bad request');
        next(err);
    }
});
//# sourceMappingURL=feedbacks.routes.js.map