import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function createUser(email: string, password: string, name: string, firebaseUserId: string) {
  try {
    console.log(`Creating user with email: ${email}, firebaseUserId: ${firebaseUserId}`);
    
    // Hash the password before storing it (even for Firebase users)
    // For Firebase users with placeholder password, still hash it
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // Store hashed password
        name,
        firebaseUserId,
      },
    });
    
    console.log(`User created successfully with id: ${user.id}`);
    return user;
  } catch (err) {
    console.error('Error creating user:', err);
    // Better error handling for debugging
    if ((err as any).code === 'P2002') {
      // This is the Prisma error code for unique constraint violation
      if (typeof err === 'object' && err !== null && 'meta' in err) {
        throw new Error(`User already exists with this ${(err as any).meta?.target || 'property'}`);
      }
      throw new Error('User already exists with an unknown property');
    }
    if (err instanceof Error) {
      throw new Error(`Failed to create user in database: ${err.message}`);
    }
    throw new Error('Failed to create user in database due to an unknown error');
  }
}

export async function findUserByFirebaseId(firebaseUserId: string) {
  try {
    console.log(`Looking for user with firebaseUserId: ${firebaseUserId}`);
    
    const user = await prisma.user.findFirst({
      where: {
        firebaseUserId: firebaseUserId,
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