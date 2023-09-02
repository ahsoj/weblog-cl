"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
class Feedback {
    async createComment(comment) {
        const newComment = await prisma_1.prisma.comment.create({
            data: comment,
        });
        return newComment.id;
    }
    async deleteComment(commentId) {
        try {
            await prisma_1.prisma.comment.delete({
                where: { id: commentId },
            });
            return true;
        }
        catch (err) {
            return err;
        }
    }
    async createLike(like) {
        const newLike = await prisma_1.prisma.like.create({
            data: like,
        });
        return newLike.id;
    }
    async disLike(likeId) {
        try {
            await prisma_1.prisma.like.delete({
                where: { id: likeId },
            });
            return true;
        }
        catch (err) {
            return err;
        }
    }
    async createCommentLike(comment_like) {
        const newCommentLike = await prisma_1.prisma.commentLike.create({
            data: comment_like,
        });
        return newCommentLike.id;
    }
    async commentDislike(commentLike_id) {
        try {
            await prisma_1.prisma.commentLike.delete({
                where: { id: commentLike_id },
            });
            return true;
        }
        catch (err) {
            return err;
        }
    }
    async getAllCommentsByPostId(postId) {
        const current_comment = await prisma_1.prisma.comment.findMany({
            where: { postId },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return current_comment;
    }
}
exports.default = new Feedback();
//# sourceMappingURL=feedbacks.services.js.map