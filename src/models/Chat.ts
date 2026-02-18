import mongoose, { Schema, model, models } from 'mongoose';

const ChatSchema = new Schema({
    name: { type: String }, // For group chats
    isGroup: { type: Boolean, default: false },
    participants: [{ type: Schema.Types.ObjectId, ref: 'Employee', required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true });

const Chat = models.Chat || model('Chat', ChatSchema);

export default Chat;
