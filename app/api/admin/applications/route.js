import { getUsers, updateUserStatus } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const users = await getUsers();
        return NextResponse.json({ users });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { id, status } = await request.json();
        const updatedUser = await updateUserStatus(id, status);
        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
