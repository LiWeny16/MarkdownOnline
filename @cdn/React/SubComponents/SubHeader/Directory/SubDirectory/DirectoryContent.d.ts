export interface DirectoryItem {
    id: string;
    labelKey: string;
    children?: DirectoryItem[];
}
export interface ContentSection {
    title: string;
    content: string[];
}
export declare const directoryStructure: DirectoryItem[];
export declare const contentMapZh: {
    [key: string]: ContentSection;
};
export declare const contentMapEn: {
    [key: string]: ContentSection;
};
export declare function getContentMap(language: string): {
    [key: string]: ContentSection;
};
export declare function renderContent(sections: ContentSection[]): string[];
