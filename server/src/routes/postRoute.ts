import express from 'express';
import { getAllPosts, viewPost, createPost,userProfile,getUserPosts, updatePost, approvePost, getNonApprovedPosts, unapprovePost, deletePost } from '../controllers/postController';

const router = express.Router();

router.get('/posts', getAllPosts);
router.get('/posts/:postId', viewPost);
router.get('/api/users/:userId', userProfile);
router.get('/api/users/:userId/posts', getUserPosts);
router.get('/post/non-approved', getNonApprovedPosts);
router.put('/posts/:postId', updatePost);
router.put('/posts/:postId/approve', approvePost);
router.put('/posts/:postId/unapprove', unapprovePost);
router.post('/posts', createPost);
router.delete('/posts/:postId', deletePost);



export default router;
