export declare const fireDb: import("@firebase/firestore/lite").Firestore;
export declare function uploadMdToFireDB(content: any, author?: any): Promise<void>;
export declare function getMdFromFireDB(): Promise<string>;
export declare function generateShareLink(docId: string): string;
