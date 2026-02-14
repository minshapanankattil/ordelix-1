import { getUsers, updateUserStatus, addAuditLog } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const users = await getUsers();
        // Return only non-admin users
        const registeredUsers = users.filter(u => u.role !== 'admin');
        return NextResponse.json({ success: true, users: registeredUsers });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { userId, status } = await request.json();
        if (!userId || !status) {
            return NextResponse.json({ success: false, error: 'Missing userId or status' }, { status: 400 });
        }

        const updatedUser = await updateUserStatus(userId, status);
        if (!updatedUser) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        await addAuditLog('User Status Updated', `${updatedUser.businessName} set to ${status}`, 'Admin');

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
