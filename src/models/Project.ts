import mongoose, { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    progress: { type: Number, default: 0 },
    members: { type: Number, default: 1 },
    dueDate: { type: String },
    status: { type: String, enum: ['On Track', 'At Risk', 'Delayed'], default: 'On Track' },
    description: { type: String },
}, { timestamps: true });

const Project = models.Project || model('Project', ProjectSchema);

export default Project;
