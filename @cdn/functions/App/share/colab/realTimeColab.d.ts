declare class RealTimeColab {
    private ws;
    private userId;
    constructor();
    isConnected(): Promise<boolean>;
    connect(url: string, setMsgFromSharing: Function): Promise<void>;
    disconnect(): Promise<void>;
    sendPrivateMessage(targetId: string, message: string): Promise<void>;
    sendBroadCastMessage(message: string): Promise<void>;
    getUserId(): string;
    getAllUsers(): Promise<void>;
    private generateUUID;
    private handleMessage;
    private receiveBroadCastMsg;
}
declare const realTimeColab: RealTimeColab;
export default realTimeColab;
