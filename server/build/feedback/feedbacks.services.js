import { prisma } from '@/utils/prisma.js';
class Feedback {
    async createComment(comment) {
        const newComment = await prisma.comment.create({
            data: comment,
        });
        return newComment.id;
    }
    async deleteComment(commentId) {
        try {
            await prisma.comment.delete({
                where: { id: commentId },
            });
            return true;
        }
        catch (err) {
            return err;
        }
    }
    async createLike(like) {
        const newLike = await prisma.like.create({
            data: like,
        });
        return newLike.id;
    }
    async disLike(likeId) {
        try {
            await prisma.like.delete({
                where: { id: likeId },
            });
            return true;
        }
        catch (err) {
            return err;
        }
    }
    async createCommentLike(comment_like) {
        const newCommentLike = await prisma.commentLike.create({
            data: comment_like,
        });
        return newCommentLike.id;
    }
    async commentDislike(commentLike_id) {
        try {
            await prisma.commentLike.delete({
                where: { id: commentLike_id },
            });
            return true;
        }
        catch (err) {
            return err;
        }
    }
    async getAllCommentsByPostId(postId) {
        const current_comment = await prisma.comment.findMany({
            where: { postId },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return current_comment;
    }
}
export default new Feedback();
//# sourceMappingURL=feedbacks.services.js.map