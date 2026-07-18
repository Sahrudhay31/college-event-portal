import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
    throw new Error('Please define the JWT_SECRET environment variable');
}

const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}

export async function signToken(user: { _id: any; email: string; role: string }): Promise<string> {
    const payload: JWTPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    };
    
    return new SignJWT(payload as any)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secretKey);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload as unknown as JWTPayload;
    } catch (error) {
        return null;
    }
}

export function getTokenFromRequest(req: NextRequest): string | null {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    const cookieToken = req.cookies.get('token')?.value;
    if (cookieToken) {
        return cookieToken;
    }
    return null;
}