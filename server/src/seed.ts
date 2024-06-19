import { PrismaClient } from '@prisma/client';
import { userModel } from './models/user';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    const seedData = [
        { email: 'admin@example.com', username: 'Admin', password: '$2a$10$FU46pNnJ7XhVQvpNKeZNLuhGqArYtn45ePcN.QRHPEWQkQgF3gNOS', admin: true }, //admin123
        { email: 'user@example.com', username: 'User', password: '$2a$10$7bKoVnUfoxoaSfp00HlCy.uFd7/MttZc3NurJoLCFX4YC5GsksxHW' } //useris123
    ];

    for (const data of seedData) {
      await userModel.create({
        data,
      });
    }

    console.log('Seed data inserted successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();