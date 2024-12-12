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
        Object.defineProperty(this, "knownUsers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "setMsgFromSharing", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => { }
        });
        const currentState = getStatesMemorable().memorable;
        RealTimeColab.userId =
            currentState.localLANId !== "none"
                ? currentState.localLANId
                : this.generateUUID();
        if (currentState.localLANId === "none") {
            changeStatesMemorable({ memorable: { localLANId: RealTimeColab.userId } });
        }
        this.knownUsers.add(RealTimeColab.userId); // Add self to known users
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
            this.setMsgFromSharing = setMsgFromSharing;
            const userId = this.getUniqId();
            this.ws = new WebSocket(url);
            this.ws.onopen = () => {
                this.broadcastSignal({ type: "discover", id: userId });
            };
            this.ws.onmessage = (event) => this.handleSignal(event, setMsgFromSharing, updateConnectedUsers);
            this.ws.onclose = () => this.cleanUpConnections(updateConnectedUsers);
            this.ws.onerror = (error) => console.error("WebSocket error:", error);
            // 当页面关闭或刷新时主动通知其他用户离线
            window.addEventListener("beforeunload", () => this.disconnect());
            window.addEventListener("pagehide", () => this.disconnect());
        }
        catch (error) {
            console.log(error);
        }
    }
    async disconnect() {
        // 向其他用户广播leave消息，让他们清除自己
        this.broadcastSignal({ type: "leave", id: this.getUniqId() });
        this.cleanUpConnections();
    }
    cleanUpConnections(updateConnectedUsers) {
        if (this.ws) {
            this.ws.onclose = null; // 避免重复触发 cleanUpConnections
            this.ws.close();
            this.ws = null;
        }
        RealTimeColab.peers.forEach((peer) => peer.close());
        RealTimeColab.peers.clear();
        this.dataChannels.clear();
        this.knownUsers.clear();
        this.knownUsers.add(RealTimeColab.userId);
        if (updateConnectedUsers) {
            updateConnectedUsers(this.getAllUsers());
        }
    }
    async handleSignal(event, setMsgFromSharing, updateConnectedUsers) {
        const reader = new FileReader();
        reader.readAsText(event.data, "utf-8");
        reader.onload = async () => {
            const data = JSON.parse(reader.result);
            if (!data)
                return;
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
                    await this.handleDiscover(data, updateConnectedUsers);
                    break;
                case "leave":
                    this.handleLeave(data, updateConnectedUsers);
                    break;
                default:
                    console.warn("Unknown message type", data.type);
            }
        };
    }
    async handleDiscover(data, updateConnectedUsers) {
        const fromId = data.id;
        if (!this.knownUsers.has(fromId)) {
            this.knownUsers.add(fromId);
            await this.connectToUser(fromId);
            updateConnectedUsers(this.getAllUsers());
            this.broadcastSignal({ type: "discover", id: this.getUniqId() });
        }
    }
    handleLeave(data, updateConnectedUsers) {
        const leavingUserId = data.id;
        if (this.knownUsers.has(leavingUserId)) {
            this.knownUsers.delete(leavingUserId);
            // 关闭相关连接和数据通道
            const peer = RealTimeColab.peers.get(leavingUserId);
            if (peer) {
                peer.close();
                RealTimeColab.peers.delete(leavingUserId);
            }
            const channel = this.dataChannels.get(leavingUserId);
            if (channel) {
                channel.close();
                this.dataChannels.delete(leavingUserId);
            }
            updateConnectedUsers(this.getAllUsers());
            console.log(`User ${leavingUserId} has left, cleaned up resources.`);
        }
    }
    createPeerConnection(id) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:stun.metered.ca:3478",
                        "stun:stun.cloudflare.com:3478"
                    ],
                },
                {
                    urls: "turn:md.metered.live:3478", // 添加端口
                    username: "f003818b5eed7f4ff58ba654", // 替换为 Metered 提供的用户名
                    credential: "bvU4/Kv9FXr6lT6O", // 替换为 Metered 提供的密码
                },
            ],
        });
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
            const fullSignal = {
                ...signal,
                from: RealTimeColab.userId,
            };
            this.ws.send(JSON.stringify(fullSignal));
        }
    }
    getAllUsers() {
        return Array.from(this.knownUsers).filter((id) => id !== this.getUniqId());
    }
    async handleOffer(data) {
        const peer = this.createPeerConnection(data.from);
        await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        this.broadcastSignal({
            type: "answer",
            answer: peer.localDescription,
            to: data.from,
        });
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
        // tag
        channel.onmessage = (event) => {
            this.setMsgFromSharing(event.data);
            console.log(`Message from ${id}:`, event.data);
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
            const dataChannel = peer.createDataChannel("chat");
            this.setupDataChannel(dataChannel, id);
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
        if (channel?.readyState === "open") {
            channel.send(message);
        }
        else {
            console.error(`Data channel with user ${id} is not available.`);
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
