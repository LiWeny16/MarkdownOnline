import { MeetingRecord } from "@Mobx/AIMeeting";
/**
 * 保存会议记录
 */
export declare function saveMeetingRecord(meeting: MeetingRecord): Promise<void>;
/**
 * 获取所有会议记录
 */
export declare function getAllMeetingRecords(): Promise<MeetingRecord[]>;
/**
 * 根据ID获取会议记录
 */
export declare function getMeetingRecordById(id: string): Promise<MeetingRecord | null>;
/**
 * 删除会议记录
 */
export declare function deleteMeetingRecord(id: string): Promise<void>;
/**
 * 更新会议记录
 */
export declare function updateMeetingRecord(meeting: MeetingRecord): Promise<void>;
/**
 * 清空所有会议记录
 */
export declare function clearAllMeetingRecords(): Promise<void>;
/**
 * 搜索会议记录
 */
export declare function searchMeetingRecords(keyword: string): Promise<MeetingRecord[]>;
declare const _default: {
    saveMeetingRecord: typeof saveMeetingRecord;
    getAllMeetingRecords: typeof getAllMeetingRecords;
    getMeetingRecordById: typeof getMeetingRecordById;
    deleteMeetingRecord: typeof deleteMeetingRecord;
    updateMeetingRecord: typeof updateMeetingRecord;
    clearAllMeetingRecords: typeof clearAllMeetingRecords;
    searchMeetingRecords: typeof searchMeetingRecords;
};
export default _default;
