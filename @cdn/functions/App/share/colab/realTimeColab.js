import { changeStatesMemorable, getStatesMemorable } from "@App/config/change";
class RealTimeColab {
    constructor() {
        Object.defineProperty(this, "dataChannels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "ws", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        const currentState = getStatesMemorable().memorable;
        RealTimeColab.userId =
            currentState.localLANId !== "none"
                ? currentState.localLANId
                : this.generateUUID();
        if (currentState.localLANId === "none") {
            changeStatesMemorable({ memorable: { localLANId: RealTimeColab.userId } });
        }
    }
    static getInstance() {
        if (!RealTimeColab.instance) {
            RealTimeColab.instance = new RealTimeColab();
        }
        return RealTimeColab.instance;
    }
    getUniqId() {
        return RealTimeColab.userId;
    }
    async connect(url, setMsgFromSharing, updateConnectedUsers) {
        try {
            const userId = this.getUniqId();
            this.ws = new WebSocket(url);
            this.ws.onopen = () => {
                this.broadcastSignal({ type: "discover", id: userId });
            };
            this.ws.onmessage = (event) => this.handleSignal(event, setMsgFromSharing, updateConnectedUsers);
            this.ws.onclose = () => this.cleanUpConnections();
            this.ws.onerror = (error) => console.error("WebSocket error:", error);
        }
        catch (error) {
            console.log(error);
        }
    }
    async disconnect() {
        this.cleanUpConnections();
    }
    cleanUpConnections() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        RealTimeColab.peers.forEach((peer) => peer.close());
        RealTimeColab.peers.clear();
        this.dataChannels.clear();
    }
    async handleSignal(event, setMsgFromSharing, updateConnectedUsers) {
        let data;
        const reader = new FileReader();
        reader.readAsText(event.data, "utf-8");
        reader.onload = async () => {
            // 非常致命的问题
            data = JSON.parse(reader.result); // 从 FileReader 中提取实际消息内容并解析为 JSON
            if (data) {
                switch (data.type) {
                    case "offer":
                        await this.handleOffer(data);
                        break;
                    case "answer":
                        await this.handleAnswer(data);
                        break;
                    case "candidate":
                        await this.handleCandidate(data);
                        break;
                    case "discover":
                        await this.connectToUser(data.id);
                        await updateConnectedUsers(this.getAllUsers());
                        break;
                    default:
                        console.warn("Unknown message type", data.type);
                }
            }
        };
    }
    createPeerConnection(id) {
        const peer = new RTCPeerConnection();
        peer.onicecandidate = (event) => {
            if (event.candidate) {
                this.broadcastSignal({
                    type: "candidate",
                    candidate: event.candidate,
                    to: id,
                });
            }
        };
        peer.ondatachannel = (event) => {
            this.setupDataChannel(event.channel, id);
        };
        if (id) {
            RealTimeColab.peers.set(id, peer);
        }
        return peer;
    }
    broadcastSignal(signal) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(signal));
        }
    }
    getAllUsers() {
        return Array.from(RealTimeColab.peers.keys()).filter((id) => id !== this.getUniqId());
    }
    async handleOffer(data) {
        const peer = this.createPeerConnection(data.from);
        await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        this.broadcastSignal({ type: "answer", answer, to: data.from });
    }
    async handleAnswer(data) {
        const peer = RealTimeColab.peers.get(data.from);
        if (peer) {
            await peer.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
    }
    async handleCandidate(data) {
        const peer = RealTimeColab.peers.get(data.from);
        if (peer) {
            await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    }
    setupDataChannel(channel, id) {
        channel.onopen = () => {
            console.log(`Data channel with user ${id} is open`);
        };
        channel.onmessage = (event) => {
            console.log(`Received message from user ${id}:`, event.data);
            // 在这里处理接收到的消息，例如更新 UI，处理命令等
        };
        channel.onclose = () => {
            console.log(`Data channel with user ${id} is closed`);
            this.dataChannels.delete(id);
        };
        this.dataChannels.set(id, channel);
    }
    async connectToUser(id) {
        if (!RealTimeColab.peers.has(id)) {
            const peer = this.createPeerConnection(id);
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            this.broadcastSignal({
                type: "offer",
                offer: peer.localDescription,
                to: id,
            });
        }
    }
    async sendMessageToUser(id, message) {
        const channel = this.dataChannels.get(id);
        if (channel && channel.readyState === "open") {
            channel.send(message);
        }
        else {
            console.warn(`Data channel with user ${id} is not open`);
        }
    }
    generateUUID() {
        return "ID" + Math.random().toString(36).substring(2, 11);
    }
    isConnected() {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }
    getConnectedUserIds() {
        return this.getAllUsers();
    }
}
Object.defineProperty(RealTimeColab, "instance", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: null
});
Object.defineProperty(RealTimeColab, "userId", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: null
});
Object.defineProperty(RealTimeColab, "peers", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Map()
});
const realTimeColab = RealTimeColab.getInstance();
export default realTimeColab;
