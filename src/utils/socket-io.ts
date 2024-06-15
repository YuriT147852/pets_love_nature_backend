import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { SocketUser, SocketMsg } from '@/types/socket';
import CustomerModel from '@/models/customer';
import ChatModel from '@/models/chat';
import jsonWebToken, { type JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

let io: SocketIOServer;
let token: string;
export function connectSocketIO(server: HTTPServer) {
    io = new SocketIOServer(server);

    //驗證header
    io.use(async (socket, next) => {
        token = '';
        if (socket.handshake.headers.authorization && socket.handshake.headers.authorization?.startsWith('Bearer')) {
            token = socket.handshake.headers.authorization.split(' ')[1];
        }

        try {
            const decoded = jsonWebToken.verify(token, process.env.JWt_BACK_SECRET) as JwtPayload;

            if (decoded.account !== 'admin') {
                emitErrorMsg(socket, '用戶驗證失敗');
                return next(new Error('User not found'));
            }

            // 第一次先驗證是否為後台管理員
            const user: SocketUser = {
                role: 'admin'
            };

            emitConnectStatus(socket, user);

            return next();
        } catch (err) {
            //第二次驗證是否為一般會員,如果都不是才報錯
            try {
                const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET) as JwtPayload;

                //拿取id
                const result = await CustomerModel.findOne({
                    _id: decoded.userId
                });

                //如果沒有該使用者報錯
                if (!result) {
                    emitErrorMsg(socket, '用戶驗證失敗');
                    return next(new Error('User not found'));
                }

                const user = {
                    userId: decoded.userId,
                    role: 'client',
                    customerName: result.customerName
                };

                emitConnectStatus(socket, user);

                next();
            } catch (error) {
                next(new Error('Authentication error'));
            }
        }
    });

    io.on('connection', (socket: Socket) => {
        //client加入個別房間
        socket.on('join room', async data => {
            try {
                const { userId, role } = data as SocketUser;

                if (!userId || role !== 'client') {
                    emitErrorMsg(socket, 'userId與role錯誤');
                    return;
                }

                const roomResult = await ChatModel.findOne({ userId });

                //如果不到就創一個新的
                if (!roomResult) {
                    await ChatModel.create({ userId, messageList: [] });
                }
                await socket.join(userId);
            } catch (error) {
                emitErrorMsg(socket, '加入房間失敗');
            }
        });

        socket.on('message', async data => {
            const { message, userId, role } = data as SocketMsg;

            if (!userId) {
                emitErrorMsg(socket, 'userId不存在');
                return;
            }

            if (role === 'client') {
                //製作message
                const newMessage = {
                    role: 'client',
                    read: false,
                    message,
                    chatId: new mongoose.Types.ObjectId('661a9a9fa892ea2a833a1009')
                };
                console.log(newMessage);
                await ChatModel.findOneAndUpdate({ userId }, { $push: { messageList: newMessage } });
                //只傳給admin
                io.emit('admin message', newMessage);
            }

            if (role === 'admin') {
                //製作message
                const newMessage = {
                    role: 'admin',
                    read: false,
                    message,
                    chatId: new mongoose.Types.ObjectId('661a9a9fa892ea2a833a1009')
                };
                await ChatModel.findOneAndUpdate({ userId }, { $push: { messageList: newMessage } });
                //只傳給特定人
                io.to(userId).emit('message', newMessage);
            }
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}

function emitConnectStatus(socket: Socket, user: SocketUser) {
    socket.emit('connectStatus', {
        status: 'success',
        message: '連線成功',
        user: user
    });
}

function emitErrorMsg(socket: Socket, message: string) {
    socket.emit('errorMsg', {
        status: 'error',
        message: message
    });
}
