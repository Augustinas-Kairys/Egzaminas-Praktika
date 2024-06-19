import express from 'express';
import { getAllUsers, getBlockedUsers,blockUser, unblockUser } from '../controllers/userController';

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/users/blocked', getBlockedUsers);
router.put('/users/:userId/block', blockUser);
router.put('/users/:userId/unblock', unblockUser); 

export default router;
