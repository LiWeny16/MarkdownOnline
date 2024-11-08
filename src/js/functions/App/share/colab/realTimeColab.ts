import { env } from "process"

class RealTimeColab {
  private ws: WebSocket | null = null
  private userId: string

  constructor() {
    this.userId = this.generateUUID()
  }

  public async isConnected(): Promise<boolean> {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }

  public async connect(
    url: string,
    setMsgFromSharing: Function
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
        console.log("WebSocket connection opened")
        resolve()
      }

      this.ws.onmessage = (event: MessageEvent) => {
        setMsgFromSharing(event.data)
        this.handleMessage(event.data)
      }

      this.ws.onclose = () => {
        console.log("WebSocket connection closed")
      }

      this.ws.onerror = (error: Event) => {
        console.error("WebSocket error:", error)
        reject(error)
      }
    })
  }

  public async disconnect(): Promise<void> {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
  public async sendPrivateMessage(
    targetId: string,
    message: string
  ): Promise<void> {
    console.log(`Send private message to ${targetId}: ${message}`)
  }
  public async sendBroadCastMessage(message: string) {
    let msg = {
      type: "broadcast",
      message: message,
    }
    this.ws?.send(JSON.stringify(msg))
  }
  public getUserId(): string {
    return this.userId
  }
  public async getAllUsers(): Promise<void> {
    if (await this.isConnected()) {
      const message = JSON.stringify({ type: "getAllUsers" })
      this.ws!.send(message)
    } else {
      console.error("WebSocket is not connected")
    }
  }

  private generateUUID(): string {
    return "ID" + Math.random().toString(36).substring(2, 11)
  }

  private async handleMessage(message: string): Promise<void> {
    console.log(`Message received: ${message}`)
    // alert(message)
    let data
    try {
      data = JSON.parse(message)
    } catch (e) {
      console.error("Invalid JSON data")
      return
    }

    if (data.type === "broadcast") {
      await this.receiveBroadCastMsg(data.message)
    } else if (data.type === "private" && data.targetId) {
      await this.sendPrivateMessage(data.targetId, data.message)
    } else if (data.type === "allUsers") {
    } else {
      console.log("Invalid message type")
    }
  }

  private async receiveBroadCastMsg(message: string): Promise<void> {
    // console.log(`Broadcast message: ${message}`)
    // alert(message)
    // Implement broadcasting logic if needed
  }
}

const urlTest = "ws://127.0.0.1:9000"
const url = "wss://webrtc-wabmmfcxmo.cn-shanghai.fcapp.run"
const realTimeColab = new RealTimeColab()
export default realTimeColab
