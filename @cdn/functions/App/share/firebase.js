// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAvb1zCnWP-LkvOxK6pWxwt42V3mhmVtpE",
    authDomain: "markdown-online-6e8ef.firebaseapp.com",
    projectId: "markdown-online-6e8ef",
    messagingSenderId: "892848521773",
    appId: "1:892848521773:web:4129a54498a818d64aaea4",
    measurementId: "G-DGW2ERW2C5",
    storageBucket: "gs://markdown-online-6e8ef.appspot.com",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const fireDb = getFirestore(app);
const storage = getStorage();
// 上传 Markdown 文档到 Firestore
export async function uploadMdToFireDB(content, author) {
    const storageRef = ref(storage, "shared.md");
    // Raw string is the default if no format is provided
    const message = content;
    uploadString(storageRef, message).then((snapshot) => {
        console.log("Uploaded a raw string!");
    });
}
export async function getMdFromFireDB() {
    getDownloadURL(ref(storage, "shared.md"))
        .then((url) => {
        console.log(url);
    })
        .catch((error) => {
        // Handle any errors
    });
}
// 生成 Markdown 文档的分享链接
export function generateShareLink(docId) {
    return `${window.location.origin}/share/${docId}`;
}
