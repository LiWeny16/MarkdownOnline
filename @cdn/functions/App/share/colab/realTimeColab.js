class RealTimeColab {
    constructor() {
        Object.defineProperty(this, "ws", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "userId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.userId = this.generateUUID();
    }
    async isConnected() {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }
    async connect(url, setMsgFromSharing) {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(url);
            this.ws.onopen = () => {
                console.log("WebSocket connection opened");
                resolve();
            };
            this.ws.onmessage = (event) => {
                setMsgFromSharing(event.data);
                this.handleMessage(event.data);
            };
            this.ws.onclose = () => {
                console.log("WebSocket connection closed");
            };
            this.ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                reject(error);
            };
        });
    }
    async disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
    async sendPrivateMessage(targetId, message) {
        console.log(`Send private message to ${targetId}: ${message}`);
    }
    async sendBroadCastMessage(message) {
        let msg = {
            type: "broadcast",
            message: message,
        };
        this.ws?.send(JSON.stringify(msg));
    }
    getUserId() {
        return this.userId;
    }
    async getAllUsers() {
        if (await this.isConnected()) {
            const message = JSON.stringify({ type: "getAllUsers" });
            this.ws.send(message);
        }
        else {
            console.error("WebSocket is not connected");
        }
    }
    generateUUID() {
        return "ID" + Math.random().toString(36).substring(2, 11);
    }
    async handleMessage(message) {
        console.log(`Message received: ${message}`);
        // alert(message)
        let data;
        try {
            data = JSON.parse(message);
        }
        catch (e) {
            console.error("Invalid JSON data");
            return;
        }
        if (data.type === "broadcast") {
            await this.receiveBroadCastMsg(data.message);
        }
        else if (data.type === "private" && data.targetId) {
            await this.sendPrivateMessage(data.targetId, data.message);
        }
        else if (data.type === "allUsers") {
        }
        else {
            console.log("Invalid message type");
        }
    }
    async receiveBroadCastMsg(message) {
        // console.log(`Broadcast message: ${message}`)
        // alert(message)
        // Implement broadcasting logic if needed
    }
}
const urlTest = "ws://127.0.0.1:9000";
const url = "wss://webrtc-wabmmfcxmo.cn-shanghai.fcapp.run";
const realTimeColab = new RealTimeColab();
export default realTimeColab;
