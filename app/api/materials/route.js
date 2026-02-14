import { getMaterials, saveMaterial } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const materials = await getMaterials();
        return NextResponse.json({ materials });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const newMaterial = await saveMaterial(body);
        return NextResponse.json({ success: true, material: newMaterial });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
