import express from 'express';
import Feedback from './feedbacks.services.js';
import isAuthenticated from '@/middleware.js';
import { prisma } from '@/utils/prisma.js';
const router = express.Router();
router.get('/comments/:postId', async (req, res, next) => {
    try {
        const { postId } = req.params;
        const comments = await Feedback.getAllCommentsByPostId(postId);
        res.status(200).json(comments);
    }
    catch (err) {
        next(err);
    }
});
router.post('/likes-dislikes/', isAuthenticated, async (req, res, next) => {
    try {
        const { like } = req.body;
        const { postId, userId } = like;
        if (!(postId || userId)) {
            return res.status(400).send("Missing some Cred's");
        }
        console.log(like);
        const current_post = await prisma.like.findFirst({
            where: { postId: String(postId) },
        });
        if (current_post && userId === current_post.userId) {
            await Feedback.disLike(current_post.id);
        }
        else {
            await Feedback.createLike(like);
        }
        res.status(200).send('success');
    }
    catch (err) {
        res.status(400).send('Bad request');
        next(err);
    }
});
router.delete('/dislike/:likeId', isAuthenticated, async (req, res, next) => {
    try {
        const { likeId } = req.params;
        await Feedback.disLike(likeId);
        res.status(204).send('Dislike');
    }
    catch (err) {
        res.status(400).send('Bad request');
        next(err);
    }
});
router.delete('/delete_comment/:commentId', isAuthenticated, async (req, res, next) => {
    try {
        const { commentId } = req.params;
        await Feedback.deleteComment(commentId);
        res.status(204).send('Comment deleted');
    }
    catch (err) {
        res.status(400).send('Bad request');
        next(err);
    }
});
router.post('/comment_like', isAuthenticated, async (req, res, next) => {
    try {
        const { comment_like } = req.body;
        const { commentId, userId } = comment_like;
        if (!(commentId || userId)) {
            return res.status(400).send("MIssing some Cred's");
        }
        const commentLike = await Feedback.createCommentLike(comment_like);
        res.status(201).json(commentLike);
    }
    catch (err) {
        next(err);
    }
});
router.post('/comments', isAuthenticated, async (req, res, next) => {
    try {
        const { comment } = req.body;
        const { content, postId, userId } = comment;
        if (!(postId || userId || content)) {
            res.status(400).send("Missing required Cred's");
        }
        const createComment = await Feedback.createComment(comment);
        res.status(200).json(createComment);
    }
    catch (err) {
        res.status(400).send('Bad request');
        next(err);
    }
});
export { router as default };
//# sourceMappingURL=feedbacks.routes.js.map