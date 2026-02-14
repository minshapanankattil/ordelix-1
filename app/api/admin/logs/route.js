import { getAuditLogs } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const logs = await getAuditLogs();
        return NextResponse.json({ success: true, logs });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
