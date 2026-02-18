import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';

export async function GET() {
    try {
        await connectDB();
        const employees = await Employee.find({}).sort({ createdAt: -1 });
        return NextResponse.json(employees);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const employee = await Employee.create(body);
        return NextResponse.json(employee, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
