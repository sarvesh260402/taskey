import mongoose, { Schema, model, models } from 'mongoose';

const EmployeeSchema = new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, required: true },
    image: { type: String },
    status: { type: String, default: 'Active' },
    isAdmin: { type: Boolean, default: false },
    location: { type: String, default: 'Unknown' },
    joined: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) },
    phone: { type: String },
    department: { type: String, required: true },
    bio: { type: String },
    employeeId: { type: String, unique: true, sparse: true },
    loginId: { type: String, unique: true, sparse: true },
    password: { type: String },
}, { timestamps: true });

const Employee = models.Employee || model('Employee', EmployeeSchema);

export default Employee;
