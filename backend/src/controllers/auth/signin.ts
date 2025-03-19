import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export async function signin(email: string, password: string) {
    try{
        const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        throw new Error('No such user found');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        throw new Error('Invalid Username or password');
    }
    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
    return jwtToken;
    }catch(err:any){
        throw new Error(err.message);
    }
}