import mongoose, { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    senderName: { type: String, required: true },
    content: { type: String, required: true },
}, { timestamps: true });

const Message = models.Message || model('Message', MessageSchema);

export default Message;
