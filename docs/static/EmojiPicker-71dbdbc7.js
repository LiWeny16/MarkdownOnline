import{i as p,t as l,v as a,w as u}from"./index-1e21776c.js";import{$ as w}from"./@emoji-mart-3805b488.js";import{o as E}from"./mobx-react-1c6baff6.js";import{H as g,v as h}from"./@mui-05e09542.js";import"./react-dom-d3bdc6a0.js";import"./monaco-editor-5cf1114e.js";/* empty css                      */import"./i18next-c75e253c.js";import"./clsx-0839fdbe.js";import"./react-i18next-0e366d71.js";import"./@monaco-editor-863e66c9.js";import"./state-local-dd516420.js";import"./react-resizable-95d32b79.js";import"./react-draggable-e660ef73.js";import"./prop-types-4dcdfe56.js";import"./@babel-bc930cec.js";import"./i18next-browser-languagedetector-ac00b891.js";import"./react-2b221fbb.js";import"./@emotion-22635a5b.js";import"./hoist-non-react-statics-23d96a9a.js";import"./react-is-e8e5dbb3.js";import"./stylis-79144faa.js";import"./react-transition-group-45d74422.js";import"./@popperjs-61ffd834.js";import"./mobx-3741033e.js";import"./mobx-react-lite-1ad052b5.js";import"./use-sync-external-store-b84fba6b.js";import"./emoji-mart-029374f1.js";const x=(await p("https://cdn.jsdmirror.com/npm/@emoji-mart/data@1.1.2/+esm")).default,e=window.React,m=(await p("https://cdn.jsdmirror.com/npm/gsap@3.12/+esm")).gsap,X=E(function(o){const n=d(),s=e.useRef(),[i,c]=e.useState(!1),[k,r]=e.useState(!1);function d(){let t=l();return t.posy+435>window.document.body.clientHeight&&(t.posy=window.document.body.clientHeight-435),t}function f(t){u(t.native,!0)}return e.useEffect(()=>{c(o.open),o.open?(r(o.open),m.fromTo(".emojiPicker",{x:0},{x:20,opacity:1,duration:.6})):m.to(".emojiPicker",{opacity:0,duration:.4,onComplete:function(){r(i)}})},[o.open]),e.createElement(e.Fragment,null,e.createElement(g,{invisible:!0,ref:s,transitionDuration:{appear:500,enter:500,exit:1e3},sx:{zIndex:t=>t.zIndex.drawer+1,pointerEvents:i?"":"none"},open:i,onContextMenu:t=>{t.target.tagName!="EM-EMOJI-PICKER"&&(a("off"),t.preventDefault())},onMouseUp:t=>{t.button==2||t.button==0&&t.target.tagName!="EM-EMOJI-PICKER"&&a("off")}},e.createElement(h,{sx:{position:"absolute",top:n.posy-window.document.body.clientHeight*.1,left:n.posx+window.document.body.clientWidth*.02},className:"MIN emojiPicker"},e.createElement(w,{data:x,onEmojiSelect:f}))))});export{X as default};