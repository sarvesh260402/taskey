import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
import Chat from '@/models/Chat';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDB();

        const messages = await Message.find({ chatId: id })
            .populate('sender', 'name image avatar')
            .sort({ createdAt: 1 });

        return NextResponse.json(messages);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDB();
        const body = await request.json();
        const { sender, content } = body;

        if (!sender || !content) {
            return NextResponse.json({ error: 'Sender and content are required' }, { status: 400 });
        }

        const message = await Message.create({
            chatId: id,
            sender,
            content,
        });

        // Update the last message in the chat
        await Chat.findByIdAndUpdate(id, {
            lastMessage: message._id,
        });

        const populatedMessage = await message.populate('sender', 'name image avatar');

        return NextResponse.json(populatedMessage, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
