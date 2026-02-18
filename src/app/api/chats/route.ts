import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Chat from '@/models/Chat';
import Employee from '@/models/Employee';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const chats = await Chat.find({
            participants: userId
        })
            .populate('participants', 'name image avatar role')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

        return NextResponse.json(chats);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { participants, isGroup, name } = body;

        if (!participants || !Array.isArray(participants) || participants.length < 2) {
            return NextResponse.json({ error: 'At least 2 participants are required' }, { status: 400 });
        }

        // If not a group, check if a chat already exists between these two
        if (!isGroup && participants.length === 2) {
            const existingChat = await Chat.findOne({
                isGroup: false,
                participants: { $all: participants, $size: 2 }
            });

            if (existingChat) {
                const populatedExist = await existingChat.populate('participants', 'name image avatar role');
                return NextResponse.json(populatedExist);
            }
        }

        const chat = await Chat.create({
            participants,
            isGroup: isGroup || false,
            name: name || '',
        });

        const populatedChat = await chat.populate('participants', 'name image avatar role');

        return NextResponse.json(populatedChat, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
