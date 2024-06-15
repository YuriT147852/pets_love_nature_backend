export interface SocketUser {
    role: string;
    userId?: string;
    customerName?: string;
}

export interface SocketMsg extends SocketUser {
    message: string;
}
