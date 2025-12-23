import { MeetingRecord } from "@Mobx/AIMeeting"

const DB_NAME = "MarkdownOL_Meeting"
const DB_VERSION = 1
const STORE_NAME = "meetings"

/**
 * 打开或创建会议数据库
 */
function openMeetingDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(new Error("无法打开会议数据库"))
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result

      // 创建会议对象存储
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: "id" })
        // 创建索引
        objectStore.createIndex("startTime", "startTime", { unique: false })
        objectStore.createIndex("title", "title", { unique: false })
      }
    }
  })
}

/**
 * 保存会议记录
 */
export async function saveMeetingRecord(
  meeting: MeetingRecord
): Promise<void> {
  try {
    const db = await openMeetingDB()
    const transaction = db.transaction([STORE_NAME], "readwrite")
    const objectStore = transaction.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
      const request = objectStore.put(meeting)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error("保存会议记录失败"))
      }

      transaction.oncomplete = () => {
        db.close()
      }
    })
  } catch (error) {
    console.error("保存会议记录错误:", error)
    throw error
  }
}

/**
 * 获取所有会议记录
 */
export async function getAllMeetingRecords(): Promise<MeetingRecord[]> {
  try {
    const db = await openMeetingDB()
    const transaction = db.transaction([STORE_NAME], "readonly")
    const objectStore = transaction.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
      const request = objectStore.getAll()

      request.onsuccess = () => {
        const meetings = request.result as MeetingRecord[]
        // 按时间倒序排列
        meetings.sort((a, b) => b.startTime - a.startTime)
        resolve(meetings)
      }

      request.onerror = () => {
        reject(new Error("获取会议记录失败"))
      }

      transaction.oncomplete = () => {
        db.close()
      }
    })
  } catch (error) {
    console.error("获取会议记录错误:", error)
    throw error
  }
}

/**
 * 根据ID获取会议记录
 */
export async function getMeetingRecordById(
  id: string
): Promise<MeetingRecord | null> {
  try {
    const db = await openMeetingDB()
    const transaction = db.transaction([STORE_NAME], "readonly")
    const objectStore = transaction.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
      const request = objectStore.get(id)

      request.onsuccess = () => {
        resolve(request.result || null)
      }

      request.onerror = () => {
        reject(new Error("获取会议记录失败"))
      }

      transaction.oncomplete = () => {
        db.close()
      }
    })
  } catch (error) {
    console.error("获取会议记录错误:", error)
    throw error
  }
}

/**
 * 删除会议记录
 */
export async function deleteMeetingRecord(id: string): Promise<void> {
  try {
    const db = await openMeetingDB()
    const transaction = db.transaction([STORE_NAME], "readwrite")
    const objectStore = transaction.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
      const request = objectStore.delete(id)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error("删除会议记录失败"))
      }

      transaction.oncomplete = () => {
        db.close()
      }
    })
  } catch (error) {
    console.error("删除会议记录错误:", error)
    throw error
  }
}

/**
 * 更新会议记录
 */
export async function updateMeetingRecord(
  meeting: MeetingRecord
): Promise<void> {
  return saveMeetingRecord(meeting)
}

/**
 * 清空所有会议记录
 */
export async function clearAllMeetingRecords(): Promise<void> {
  try {
    const db = await openMeetingDB()
    const transaction = db.transaction([STORE_NAME], "readwrite")
    const objectStore = transaction.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
      const request = objectStore.clear()

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error("清空会议记录失败"))
      }

      transaction.oncomplete = () => {
        db.close()
      }
    })
  } catch (error) {
    console.error("清空会议记录错误:", error)
    throw error
  }
}

/**
 * 搜索会议记录
 */
export async function searchMeetingRecords(
  keyword: string
): Promise<MeetingRecord[]> {
  try {
    const allMeetings = await getAllMeetingRecords()
    const lowerKeyword = keyword.toLowerCase()

    return allMeetings.filter((meeting) => {
      // 搜索标题、消息内容、总结
      return (
        meeting.title.toLowerCase().includes(lowerKeyword) ||
        meeting.summary?.toLowerCase().includes(lowerKeyword) ||
        meeting.messages.some((msg) =>
          msg.text.toLowerCase().includes(lowerKeyword)
        )
      )
    })
  } catch (error) {
    console.error("搜索会议记录错误:", error)
    throw error
  }
}

export default {
  saveMeetingRecord,
  getAllMeetingRecords,
  getMeetingRecordById,
  deleteMeetingRecord,
  updateMeetingRecord,
  clearAllMeetingRecords,
  searchMeetingRecords,
}

