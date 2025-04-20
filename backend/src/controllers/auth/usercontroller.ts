import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function createUser(email: string, password: string, name: string) {
  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    
    console.log(`User created successfully with id: ${user.id}`);
    return user;
  } catch (err) {
    console.error('Error creating user:', err);
    // Better error handling for debugging
    if ((err as any).code === 'P2002') {
      // This is the Prisma error code for unique constraint violation
      throw new Error('User already exists with this email');
    }
    if (err instanceof Error) {
      throw new Error(`Failed to create user in database: ${err.message}`);
    }
    throw new Error('Failed to create user in database due to an unknown error');
  }
}

export async function findByEmail(email: string) {
  try {
    // console.log(`Looking for user with firebaseUserId: ${firebaseUserId}`);
    
    const user = await prisma.user.findFirst({
      where: {
        email
      },
    });
    
    if (user) {
      console.log(`Found user with id: ${user.id}`);
    } else {
      console.log('No user found with this Firebase ID');
    }
    
    return user;
  } catch (err) {
    console.error('Error finding user by Firebase ID:', err);
    if (err instanceof Error) {
      throw new Error(`Failed to find user: ${err.message}`);
    }
    throw new Error('Failed to find user due to an unknown error');
  }
}