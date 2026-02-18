import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        await connectDB();
        const employee = await Employee.findById(resolvedParams.id);
        if (!employee) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }
        return NextResponse.json(employee);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        await connectDB();
        const body = await request.json();
        const employee = await Employee.findByIdAndUpdate(resolvedParams.id, body, { new: true });
        return NextResponse.json(employee);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        await connectDB();
        await Employee.findByIdAndDelete(resolvedParams.id);
        return NextResponse.json({ message: 'Employee deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
