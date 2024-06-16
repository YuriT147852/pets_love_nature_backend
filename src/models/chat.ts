import { Schema, model, Document, Types } from 'mongoose';

interface IMessage extends Document {
    role: 'admin' | 'client';
    read: boolean;
    message: string;
    userId: Schema.Types.ObjectId;
    chatId: Schema.Types.ObjectId;
}

interface IChatRoom extends Document {
    userId: Schema.Types.ObjectId;
    messageList: IMessage[];
}

// 消息的 Schema
const MessageSchema = new Schema<IMessage>(
    {
        role: { type: String, enum: ['admin', 'client'], required: true },
        read: { type: Boolean, required: true },
        message: { type: String, required: true },
        chatId: { type: Types.ObjectId, required: true }
    },
    {
        _id: false,
        timestamps: { createdAt: true, updatedAt: false }
    }
);

// 聊天室的 Schema
const ChatRoomSchema = new Schema<IChatRoom>(
    {
        userId: { type: Types.ObjectId, required: false },
        messageList: { type: [MessageSchema], required: false }
    },
    {
        versionKey: false,
        timestamps: { createdAt: true, updatedAt: false }
    }
);

export default model('chat', ChatRoomSchema);