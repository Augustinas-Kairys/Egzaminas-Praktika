import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  authorId: string;
  authorUsername: string;
  photoUrl?: string;
  isApproved: boolean;
  isBlocked: boolean;
  startingTime: Date;
  likes: number;
  categories?: [];
}




export const postModel = prisma.post;