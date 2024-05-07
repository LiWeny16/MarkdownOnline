declare let speechRecognition: (lang: string, startIt: boolean | undefined, callBack: Function) => {
    recognition: any;
    recognizing: Boolean;
};
declare const speechLanguageMap: string[][];
export { speechLanguageMap };
export default speechRecognition;
