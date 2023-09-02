import { prisma } from '../utils/prisma';
import type { Comment, CommentLike, Like } from '@prisma/client';

type CommentProps = Pick<Comment, 'postId' | 'userId' | 'content'>;
type LikeProps = Pick<Like, 'postId' | 'userId'>;
type CommentLikeProps = Pick<CommentLike, 'commentId' | 'userId'>;

class Feedback {
  async createComment(comment: CommentProps) {
    const newComment = await prisma.comment.create({
      data: comment,
    });
    return newComment.id;
  }
  async deleteComment(commentId: string) {
    try {
      await prisma.comment.delete({
        where: { id: commentId },
      });
      return true;
    } catch (err) {
      return err;
    }
  }
  async createLike(like: LikeProps) {
    const newLike = await prisma.like.create({
      data: like,
    });
    return newLike.id;
  }
  async disLike(likeId: string) {
    try {
      await prisma.like.delete({
        where: { id: likeId },
      });
      return true;
    } catch (err) {
      return err;
    }
  }
  async createCommentLike(comment_like: CommentLikeProps) {
    const newCommentLike = await prisma.commentLike.create({
      data: comment_like,
    });
    return newCommentLike.id;
  }
  async commentDislike(commentLike_id: string) {
    try {
      await prisma.commentLike.delete({
        where: { id: commentLike_id },
      });
      return true;
    } catch (err) {
      return err;
    }
  }
  async getAllCommentsByPostId(postId: string) {
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
