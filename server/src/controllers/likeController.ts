import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const likePost = async (req: Request, res: Response) => {
  const { postId, userId } = req.body;

  try {
    console.log(`Attempting to like post ${postId} by user ${userId}`);

    // Validate postId and userId
    if (!postId || typeof postId !== 'number' || !userId || typeof userId !== 'string') {
      console.error('Invalid postId or userId:', postId, userId);
      return res.status(400).json({ error: 'Invalid postId or userId' });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      console.error('User not found for userId:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      console.error('Post not found for postId:', postId);
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user has already liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      console.error('User has already liked this post:', userId, postId);
      return res.status(400).json({ error: 'User has already liked this post' });
    }

    // Run all operations in a transaction for consistency
    await prisma.$transaction([
      prisma.like.create({
        data: {
          userId,
          postId,
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          likesCount: {
            increment: 1,
          },
        },
      }),
    ]);

    console.log(`Post ${postId} liked successfully by user ${userId}`);
    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  const { postId, userId } = req.body;

  try {
    // Validate postId and userId
    if (!postId || typeof postId !== 'number' || !userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid postId or userId' });
    }

    // Check if the like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!existingLike) {
      return res.status(404).json({ error: 'Like not found' });
    }

    // Run all operations in a transaction for consistency
    await prisma.$transaction([
      prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
      }),
    ]);

    res.status(200).json({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const getLikedPosts = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const likedPosts = await prisma.like.findMany({
      where: {
        userId: userId,
      },
      select: {
        postId: true,
      },
    });

    const likedPostIds = likedPosts.map((like) => like.postId);

    res.status(200).json({ likedPostIds });
  } catch (error) {
    console.error('Error fetching liked posts:', error);
    res.status(500).json({ error: 'Failed to fetch liked posts' });
  }
};