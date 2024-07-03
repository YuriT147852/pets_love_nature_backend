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
    io = new SocketIOServer(server, {
        cors: {
            origin: '*'
        }
    });

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
                role: 'admin',
                customerId: ''
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

                const user: SocketUser = {
                    customerId: decoded.userId,
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
                const { customerId, role } = data as SocketUser;

                if (!customerId || role !== 'client') {
                    emitErrorMsg(socket, 'userId與role錯誤');
                    return;
                }

                const roomResult = await ChatModel.findOne({ customerId });

                //如果不到就創一個新的
                if (!roomResult) {
                    await ChatModel.create({ customerId, messageList: [] });
                }
                await socket.join(customerId);
            } catch (error) {
                emitErrorMsg(socket, '加入房間失敗');
            }
        });

        //傳訊息
        socket.on('message', async data => {
            try {
                const { message, customerId, role } = data as SocketMsg;

                const status = DataHandler(customerId, role);

                if (!status.status) {
                    emitErrorMsg(socket, status.message);
                    return;
                }

                const newMessage = {
                    role,
                    read: false,
                    message,
                    chatId: new mongoose.Types.ObjectId()
                };

                // await ChatModel.findOneAndUpdate({ customerId }, { $push: { messageList: newMessage } });
                await ChatModel.findOneAndUpdate(
                    { customerId },
                    {
                        $push: { messageList: newMessage },
                        $setOnInsert: {
                            customerId: customerId
                        }
                    },
                    { upsert: true }
                );

                if (role === 'client') {
                    io.emit('admin message', { ...newMessage, customerId });
                } else if (role === 'admin') {
                    io.to(customerId).emit('message', newMessage);
                }
            } catch (error) {
                emitErrorMsg(socket, '傳送訊息失敗');
            }
        });

        //已讀
        socket.on('read', async data => {
            try {
                const { customerId, role } = data as SocketMsg;
                const status = DataHandler(customerId, role);
                if (!status.status) {
                    emitErrorMsg(socket, status.message);
                    return;
                }

                //只更新該userId 並且把裡面的messageList根據role篩選後把read變成true
                await ChatModel.updateMany(
                    { customerId },
                    { $set: { 'messageList.$[elem].read': true } },
                    {
                        arrayFilters: [{ 'elem.role': role === 'client' ? 'admin' : 'client' }],
                        multi: true
                    }
                );

                if (role === 'client') {
                    io.emit('admin read', { status: 'success', customerId, message: '已成功標記為已讀' });
                } else if (role === 'admin') {
                    io.to(customerId).emit('read', { status: 'success', message: '已成功標記為已讀' });
                }
            } catch (error) {
                emitErrorMsg(socket, '標記訊息為已讀失敗');
            }
        });
    });
}

function DataHandler(customerId: string, role: string) {
    if (!customerId) {
        return {
            status: false,
            message: 'customerId不存在'
        };
    } else if (!role) {
        return {
            status: false,
            message: 'customerId不存在'
        };
    } else {
        return {
            status: true,
            message: '驗證通過'
        };
    }
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
