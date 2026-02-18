import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Call from '@/models/Call';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const poll = searchParams.get('poll');
        const callId = searchParams.get('callId');

        if (callId) {
            const call = await Call.findById(callId);
            return NextResponse.json(call);
        }

        if (poll && userId) {
            // Check for incoming calls that are ringing
            const incomingCall = await Call.findOne({ to: userId, status: 'ringing' })
                .populate('from', 'name avatar image')
                .sort({ createdAt: -1 });
            return NextResponse.json(incomingCall || null);
        }

        return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { from, to, type, chatId, isGroup, action, callId } = body;

        // Start a new call
        if (!action) {
            const call = await Call.create({ from, to, type, chatId, isGroup, status: 'ringing' });
            return NextResponse.json(call, { status: 201 });
        }

        // Handle actions: accept, reject, end
        if (action === 'accept') {
            const call = await Call.findByIdAndUpdate(callId, { status: 'active' }, { new: true });
            return NextResponse.json(call);
        }

        if (action === 'reject') {
            const call = await Call.findByIdAndUpdate(callId, { status: 'rejected' }, { new: true });
            return NextResponse.json(call);
        }

        if (action === 'end') {
            const call = await Call.findByIdAndUpdate(callId, { status: 'ended' }, { new: true });
            return NextResponse.json(call);
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
