import express from 'express';
import { register, login, getUserStatus } from '../controllers/userController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user-status/:userId', getUserStatus);

export default router;
