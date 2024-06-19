import express from 'express';
import { likePost, unlikePost, getLikedPosts } from '../controllers/likeController';

const router = express.Router();

router.post('/posts/:postId/like', likePost);
router.post('/posts/:postId/unlike', unlikePost);
router.get('/posts/:userId', getLikedPosts);

export default router;
