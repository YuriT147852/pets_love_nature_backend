import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { SocketUser } from '@/types/socket';
import CustomerModel from '@/models/customer';
import jsonWebToken, { type JwtPayload } from 'jsonwebtoken';

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
        //加入個別房間
        socket.on('join room', async data => {
            const { userId, role } = data as SocketUser;

            if (!userId || role !== 'client') {
                return;
            }
            await socket.join(userId);
        });

        socket.on('chat message', (msg: string) => {
            console.log(msg);
            io.emit('chat message', `回傳${msg}`);
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
