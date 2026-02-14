import { getUsers } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        // Admin hardcoded login
        if (username === 'ordelix' && password === 'Shamil@2005') {
            const adminUser = { id: 'admin', username: 'ordelix', role: 'admin', status: 'approved' };
            return NextResponse.json({ success: true, user: adminUser, redirectTo: '/admin' });
        }

        const users = await getUsers();

        const user = users.find(u => (u.username === username || u.email === username) && u.password === password);

        if (!user) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }

        // Default redirect to dashboard
        let redirectTo = '/dashboard';

        return NextResponse.json({ success: true, user, redirectTo });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
