import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/user';

const SECRET_KEY = '61zt9hSR0FQoZcM1EN1zJFV7dRCHR61EqJbycyv9lkg2x8-XQhv6aqRbsOi93S9W';

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      data: {
        username,
        email,
        password: hashedPassword,
        admin: false,
        blocked: false,
      },
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error: any) {
    if (error && 'code' in error && error.code === 'P2002') {
      console.error('Email already exists:', error);
      res.status(409).json({ error: 'Email already exists' });
    } else {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.blocked) {
      return res.status(403).json({ error: 'User is blocked' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const tokenPayload = { userId: user.id, isAdmin: user.admin, isBlocked: user.blocked };

    const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getUserStatus = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {

    const user = await userModel.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ isBlocked: user.blocked });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// ADMIN LOG

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getBlockedUsers = async (req: Request, res: Response) => {
  try {
    const blockedUsers = await userModel.findMany({
      where: {
        blocked: true,
      },
    });
    res.status(200).json(blockedUsers);
  } catch (error) {
    console.error('Error fetching blocked users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Block a user 
export const blockUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const updatedUser = await userModel.update({
      where: { id: userId },
      data: {
        blocked: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const unblockUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const updatedUser = await userModel.update({
      where: { id: userId },
      data: {
        blocked: false,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


