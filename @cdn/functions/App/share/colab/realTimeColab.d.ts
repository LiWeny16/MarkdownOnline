declare class RealTimeColab {
    private static instance;
    private static userId;
    private static peers;
    private dataChannels;
    private ws;
    private constructor();
    static getInstance(): RealTimeColab;
    getUniqId(): string | null;
    connect(url: string, setMsgFromSharing: Function, updateConnectedUsers: Function): Promise<void>;
    disconnect(): Promise<void>;
    private cleanUpConnections;
    private handleSignal;
    private createPeerConnection;
    broadcastSignal(signal: any): void;
    getAllUsers(): string[];
    private handleOffer;
    private handleAnswer;
    private handleCandidate;
    private setupDataChannel;
    connectToUser(id: string): Promise<void>;
    sendMessageToUser(id: string, message: string): Promise<void>;
    private generateUUID;
    isConnected(): boolean;
    getConnectedUserIds(): string[];
}
declare const realTimeColab: RealTimeColab;
export default realTimeColab;
