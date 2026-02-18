import mongoose, { Schema, model, models } from 'mongoose';

const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['backlog', 'todo', 'in-progress', 'done'], default: 'todo' },
    dueDate: { type: String },
    assignee: { type: String },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'Employee' },
}, { timestamps: true });

const Task = models.Task || model('Task', TaskSchema);

export default Task;
