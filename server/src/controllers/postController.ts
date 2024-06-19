import { Request, Response } from 'express';
import { postModel } from '../models/post';
import { upload } from '../utils/upload';
import { userModel } from '../models/user';
import { categoryModel } from '../models/categories';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await postModel.findMany({
      include: {
        categories: true,
      },
    });

    res.json(posts);
  } catch (error) {
    console.error('Error retrieving posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const viewPost = async (req: Request, res: Response) => {
  const postId = Number(req.params.postId);

  try {
    const post = await postModel.findUnique({
      where: { id: postId },
    });

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error retrieving post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




export const createPost = async (req: Request, res: Response) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    const { title, content, authorId, categoryId, startingTime } = req.body;
    let photoUrl = '';

    if (req.file) {
      photoUrl = `${req.file.filename}`;
    }

    console.log('Request body:', req.body); 

    try {
      // Check if the author exists
      const author = await userModel.findUnique({
        where: { id: authorId },
      });

      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }

      console.log('Author found:', author);

      const categoryIdInt = parseInt(categoryId, 10);
      const category = await categoryModel.findUnique({
        where: {
          id: categoryIdInt,
        },
      });

      console.log('Category found:', category);

      if (!category) {
        return res.status(400).json({ error: 'Category not found' });
      }

      const newPostData = {
        title,
        content,
        createdAt: new Date(),
        authorId,
        authorUsername: author.username,
        photoUrl,
        isApproved: false,
        isBlocked: false,
        startingTime: startingTime ? new Date(startingTime) : null,
        categories: {
          connect: { id: category.id },
        },
      };

      const newPost = await postModel.create({
        data: newPostData,
        include: {
          categories: true,
        },
      });

      console.log('New post created:', newPost);

      res.json(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};


// Profile

export const userProfile = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const user = await userModel.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getUserPosts = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const posts = await postModel.findMany({
      where: { authorId: userId },
      include: {
        author: true, 
      },
    });

    if (posts.length === 0) {
      return res.status(404).json({ error: 'No posts found for this user' });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const updatePost = async (req: Request, res: Response) => {
  const postId = Number(req.params.postId);
  const { title, content, categoryId,startingTime  } = req.body;
  let { photoUrl } = req.body;

  try {
    const post = await postModel.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (categoryId !== undefined) {
      const category = await categoryModel.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return res.status(400).json({ error: 'Category not found' });
      }
    }

    upload(req, res, async (err: any) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).json({ error: 'Error uploading file' });
      }

      if (req.file) {
        photoUrl = req.file.filename; 
      }

      const updatedPost = await postModel.update({
        where: { id: postId },
        data: {
          title,
          content,
          startingTime: startingTime ? new Date(startingTime) : null, 
          categories: {
            set: categoryId !== undefined ? [{ id: categoryId }] : [],
          },
          photoUrl: photoUrl !== undefined ? photoUrl : post.photoUrl,
        },
      });

      res.json(updatedPost);
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const approvePost = async (req: Request, res: Response) => {
  const postId = Number(req.params.postId);

  try {
    const post = await postModel.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const updatedPost = await postModel.update({
      where: { id: postId },
      data: {
        isApproved: true,
      },
    });

    res.json(updatedPost);
  } catch (error) {
    console.error('Error approving post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const unapprovePost = async (req: Request, res: Response) => {
  const postId = Number(req.params.postId);

  try {
    const post = await postModel.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const updatedPost = await postModel.update({
      where: { id: postId },
      data: {
        isApproved: false,
      },
    });

    res.json(updatedPost);
  } catch (error) {
    console.error('Error approving post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getNonApprovedPosts = async (req: Request, res: Response) => {
  try {
    const nonApprovedPosts = await postModel.findMany({
      where: {
        isApproved: false,
      },
    });

    res.json(nonApprovedPosts);
  } catch (error) {
    console.error('Error fetching non-approved posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const deletePost = async (req: Request, res: Response) => {
  const postId = Number(req.params.postId);

  try {
    const post = await postModel.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const existingLikes = await prisma.like.findMany({
      where: { postId: postId },
    });

    if (existingLikes.length > 0) {
      await prisma.like.deleteMany({
        where: { postId: postId },
      });
    }

    await postModel.delete({
      where: { id: postId },
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


