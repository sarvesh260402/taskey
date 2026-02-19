import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Employee from '../src/models/Employee';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI!);
        console.log('Connected successfully.');

        // Read debug data
        const debugDataPath = path.resolve(process.cwd(), 'employees_debug.json');

        // Let's check encoding first by reading a small chunk
        const buffer = fs.readFileSync(debugDataPath);
        const isUtf16 = buffer[0] === 0xff && buffer[1] === 0xfe;
        const encoding = isUtf16 ? 'utf16le' : 'utf8';

        console.log(`Detected encoding: ${encoding}`);
        const rawData = fs.readFileSync(debugDataPath, { encoding: encoding as any });
        const employees = JSON.parse(rawData);

        console.log(`Found ${employees.length} employees in debug data.`);

        // Clear existing employees
        console.log('Clearing existing employees...');
        await Employee.deleteMany({});

        // Insert new employees
        console.log('Seeding employees...');
        await Employee.insertMany(employees);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seedDatabase();
