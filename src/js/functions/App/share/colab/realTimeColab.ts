import { changeStatesMemorable, getStatesMemorable } from "@App/config/change"

class RealTimeColab {
  private static instance: RealTimeColab | null = null
  private static userId: string | null = null
  private static peers: Map<string, RTCPeerConnection> = new Map()
  private dataChannels: Map<string, RTCDataChannel> = new Map()
  private ws: WebSocket | null = null

  private constructor() {
    const currentState = getStatesMemorable().memorable
    RealTimeColab.userId =
      currentState.localLANId !== "none"
        ? currentState.localLANId
        : this.generateUUID()
    if (currentState.localLANId === "none") {
      changeStatesMemorable({ memorable: { localLANId: RealTimeColab.userId } })
    }
  }

  public static getInstance(): RealTimeColab {
    if (!RealTimeColab.instance) {
      RealTimeColab.instance = new RealTimeColab()
    }
    return RealTimeColab.instance
  }

  public getUniqId(): string | null {
    return RealTimeColab.userId
  }

  public async connect(
    url: string,
    setMsgFromSharing: Function,
    updateConnectedUsers: Function
  ): Promise<void> {
    const userId = this.getUniqId()
    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      this.broadcastSignal({ type: "discover", id: userId })
    }

    this.ws.onmessage = (event) =>
      this.handleSignal(event, setMsgFromSharing, updateConnectedUsers)

    this.ws.onclose = () => this.cleanUpConnections()

    this.ws.onerror = (error: Event) => console.error("WebSocket error:", error)
  }

  public async disconnect(): Promise<void> {
    this.cleanUpConnections()
  }

  private cleanUpConnections(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    RealTimeColab.peers.forEach((peer) => peer.close())
    RealTimeColab.peers.clear()
    this.dataChannels.clear()
  }

  private async handleSignal(
    event: any,
    setMsgFromSharing: Function,
    updateConnectedUsers: Function
  ): Promise<void> {
    let data
    const reader = new FileReader()
    reader.readAsText(event.data, "utf-8")
    reader.onload = async () => {
      // 非常致命的问题
      data = JSON.parse(reader.result as string) // 从 FileReader 中提取实际消息内容并解析为 JSON
      if (data) {
        switch (data.type) {
          case "offer":
            await this.handleOffer(data)
            break
          case "answer":
            await this.handleAnswer(data)
            break
          case "candidate":
            await this.handleCandidate(data)
            break
          case "discover":
            await this.connectToUser(data.id)

            await updateConnectedUsers(this.getAllUsers())
            break
          default:
            console.warn("Unknown message type", data.type)
        }
      }
    }
  }

  private createPeerConnection(id: string): RTCPeerConnection {
    const peer = new RTCPeerConnection()

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        this.broadcastSignal({
          type: "candidate",
          candidate: event.candidate,
          to: id,
        })
      }
    }

    peer.ondatachannel = (event) => {
      this.setupDataChannel(event.channel, id)
    }

    if (id) {
      RealTimeColab.peers.set(id, peer)
    }

    return peer
  }

  public broadcastSignal(signal: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(signal))
    }
  }

  public getAllUsers(): string[] {
    return Array.from(RealTimeColab.peers.keys()).filter(
      (id) => id !== this.getUniqId()
    )
  }

  private async handleOffer(data: any): Promise<void> {
    const peer = this.createPeerConnection(data.from)
    await peer.setRemoteDescription(new RTCSessionDescription(data.offer))
    const answer = await peer.createAnswer()
    await peer.setLocalDescription(answer)
    this.broadcastSignal({ type: "answer", answer, to: data.from })
  }

  private async handleAnswer(data: any): Promise<void> {
    const peer = RealTimeColab.peers.get(data.from)
    if (peer) {
      await peer.setRemoteDescription(new RTCSessionDescription(data.answer))
    }
  }

  private async handleCandidate(data: any): Promise<void> {
    const peer = RealTimeColab.peers.get(data.from)
    if (peer) {
      await peer.addIceCandidate(new RTCIceCandidate(data.candidate))
    }
  }

  private setupDataChannel(channel: RTCDataChannel, id: string): void {
    channel.onopen = () => {
      console.log(`Data channel with user ${id} is open`)
    }

    channel.onmessage = (event) => {
      console.log(`Received message from user ${id}:`, event.data)
      // 在这里处理接收到的消息，例如更新 UI，处理命令等
    }

    channel.onclose = () => {
      console.log(`Data channel with user ${id} is closed`)
      this.dataChannels.delete(id)
    }

    this.dataChannels.set(id, channel)
  }

  public async connectToUser(id: string): Promise<void> {
    if (!RealTimeColab.peers.has(id)) {
      const peer = this.createPeerConnection(id)
      const offer = await peer.createOffer()
      await peer.setLocalDescription(offer)
      this.broadcastSignal({
        type: "offer",
        offer: peer.localDescription,
        to: id,
      })
    }
  }

  public async sendMessageToUser(id: string, message: string): Promise<void> {
    const channel = this.dataChannels.get(id)
    if (channel && channel.readyState === "open") {
      channel.send(message)
    } else {
      console.warn(`Data channel with user ${id} is not open`)
    }
  }

  private generateUUID(): string {
    return "ID" + Math.random().toString(36).substring(2, 11)
  }

  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }

  public getConnectedUserIds(): string[] {
    return this.getAllUsers()
  }
}

const realTimeColab = RealTimeColab.getInstance()
export default realTimeColab
