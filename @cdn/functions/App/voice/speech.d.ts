declare let speechRecognition: (lang: string, startIt: boolean | undefined, callBack: Function) => {
    recognition: any;
    recognizing: Boolean;
};
declare const speechLanguageMap: any;
export { speechLanguageMap };
export default speechRecognition;
