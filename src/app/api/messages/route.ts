import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const chatId = searchParams.get('chatId');

        if (!chatId) {
            return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
        }

        const messages = await Message.find({ chatId })
            .sort({ createdAt: 1 });

        return NextResponse.json(messages);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { chatId, sender, senderName, content } = body;

        if (!chatId || !sender || !senderName || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const message = await Message.create({
            chatId,
            sender,
            senderName,
            content
        });

        return NextResponse.json(message, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
