// in signup.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function signup(email: string, password: string, name: string) {
  try {
    const prisma = new PrismaClient();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const exists = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    
    if (exists) {
      throw new Error('User already exists');
    }
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
    });
    
    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
    return jwtToken;
  } catch (err: any) {
    throw new Error(err.message);
  }
}