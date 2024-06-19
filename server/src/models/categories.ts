import { PrismaClient, Post } from '@prisma/client'; 

const prisma = new PrismaClient();

export interface Category {
  id: number;
  name: string;
  posts: Post[];
}


export const categoryModel = prisma.category;