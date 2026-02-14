import { getSettings, updateSettings, addAuditLog } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const settings = await getSettings();
        return NextResponse.json({ success: true, settings });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const updates = await request.json();
        const settings = await updateSettings(updates);

        await addAuditLog('Settings Updated', `System settings updated: ${Object.keys(updates).join(', ')}`, 'Admin');

        return NextResponse.json({ success: true, settings });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
