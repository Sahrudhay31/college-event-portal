import { NextRequest } from 'next/server';
import { User, IUser } from '@/models/User';
import { connectDB } from '@/lib/db/mongoose';
import { verifyToken, getTokenFromRequest } from './jwt';

export async function getCurrentUser(req: NextRequest): Promise<IUser | null> {
    const token = getTokenFromRequest(req);
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    await connectDB();
    const user = await User.findById(payload.userId).select('-password');
    return user;
}

export async function requireAuth(req: NextRequest): Promise<IUser> {
    const user = await getCurrentUser(req);
    if (!user) {
        throw new Error('Unauthorized');
    }
    return user;
}

export async function requireAdmin(req: NextRequest): Promise<IUser> {
    const user = await getCurrentUser(req);
    if (!user || user.role !== 'admin') {
        throw new Error('Forbidden: Admin access required');
    }
    return user;
}
