import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Path in the physical filesystem
        const uploadDir = join(process.cwd(), 'public', 'uploads');

        // Ensure directory exists
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
        }

        // Create a unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, '-')}`;
        const path = join(uploadDir, filename);

        // Write file to public/uploads
        await writeFile(path, buffer);

        // Return the public URL path
        const publicUrl = `/uploads/${filename}`;

        return NextResponse.json({ url: publicUrl });
    } catch (error: any) {
        console.error('File upload error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
