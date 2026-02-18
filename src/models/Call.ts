import mongoose, { Schema, model, models } from 'mongoose';

const CallSchema = new Schema({
    from: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    to: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    type: { type: String, enum: ['voice', 'video'], required: true },
    status: { type: String, enum: ['ringing', 'active', 'rejected', 'ended'], default: 'ringing' },
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    isGroup: { type: Boolean, default: false },
}, { timestamps: true });

const Call = models.Call || model('Call', CallSchema);

export default Call;
