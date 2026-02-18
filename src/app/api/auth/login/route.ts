import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';

export async function POST(request: Request) {
    try {
        await connectDB();
        const { employeeId, password } = await request.json();

        // Find employee with matching credentials (check both new and old field names)
        const employee = await Employee.findOne({
            $or: [
                { employeeId: employeeId },
                { loginId: employeeId }
            ],
            password
        });

        if (!employee) {
            return NextResponse.json({ error: 'Invalid ID or Password' }, { status: 401 });
        }

        // Success - return user info (excluding password)
        const { password: _, ...employeeData } = employee.toObject();

        return NextResponse.json({
            message: 'Login successful',
            user: employeeData
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
