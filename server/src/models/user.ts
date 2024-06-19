import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  admin: boolean; 
  blocked: boolean; 
}



export const userModel = prisma.user;