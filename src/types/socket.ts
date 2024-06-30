export interface SocketUser {
    role: string;
    customerId: string;
    customerName?: string;
}

export interface SocketMsg extends SocketUser {
    message: string;
}
