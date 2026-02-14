import { saveUser } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const newUser = await saveUser(body);
        return NextResponse.json({ success: true, user: newUser });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
