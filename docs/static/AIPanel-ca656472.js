import{i as F,a as R,v as J,S as L,t as _,w as z}from"./index-4ef0914f.js";import{o as K}from"./mobx-react-1c6baff6.js";import{s as Q,B as U,K as $,x as b,o as q,j as G,aH as B,aI as V,T,ah as X,aJ as Y}from"./@mui-608bc7a8.js";import"./react-dom-d3bdc6a0.js";import"./i18next-c75e253c.js";import"./bigonion-kit-f58b431d.js";import"./clsx-0839fdbe.js";import"./react-i18next-0e366d71.js";import"./@monaco-editor-863e66c9.js";import"./state-local-dd516420.js";import"./react-resizable-8f73e4ed.js";import"./react-draggable-b033082a.js";import"./prop-types-7395632d.js";import"./@babel-f8d566ba.js";import"./i18next-browser-languagedetector-ac00b891.js";import"./react-3f121ed2.js";import"./@emotion-d13e5fae.js";import"./hoist-non-react-statics-3f8ebaa8.js";import"./stylis-79144faa.js";import"./react-is-e5978b8b.js";import"./react-transition-group-bc100b23.js";import"./@popperjs-61ffd834.js";import"./mobx-3741033e.js";import"./mobx-react-lite-1ad052b5.js";import"./use-sync-external-store-b84fba6b.js";const D="409f1e38b0d8586919166aa6117243f7.AVQTIQqUbGI1g8B5",Z="https://open.bigmodel.cn/api/paas/v4/chat/completions";class ee{static token=D;async askAI(a,m,f,o){const h={model:"glm-4-plus",tool:"web-search-pro",stream:!0,messages:[{role:"user",content:a}]};try{const r=await fetch(Z,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`${D}`},body:JSON.stringify(h)});if(!r.body)throw new Error("ReadableStream not supported in this browser.");const v=r.body.getReader(),x=new TextDecoder("utf-8");let n=!1,s="";for(;!n;){const{value:g,done:S}=await v.read();if(n=S,g){const i=x.decode(g,{stream:!0}).split(`
`).filter(l=>l.trim()!=="");for(const l of i)if(l.startsWith("data:")){const c=l.replace("data:","").trim();if(c==="[DONE]"){f(s);return}try{const u=JSON.parse(c).choices[0].delta?.content;u&&(s+=u,m(u))}catch(p){console.error("JSON parse error:",p),o(p)}}}}}catch(r){console.error("Error:",r),o(r)}}}const te=new ee,e=window.React,E=window.React.useState,M=(await F("https://cdn.jsdmirror.com/npm/gsap@3.12/+esm")).gsap,P=".prompt-panel-content",k=e.memo(Q(U)(({theme:I,color:a,size:m})=>(a="inherit",m="small",{"&:hover":{backgroundColor:R()=="light"?"rgba(238, 238, 238, 0.9)":"rgba(66, 165, 245, 0.9)",borderColor:"#0062cc",boxShadow:"none",transition:"background-color 0.4s ease-in-out, opacity 0.4s ease-in-out"},"&":{transition:"background-color 0.4s ease-in-out, opacity 0.4s ease-in-out"},color:R()=="light"?"black":"white",height:"6svh",fontSize:"0.83rem"}))),Ce=K(function(a){const f=u(),o=e.useRef(null),[h,r]=e.useState(!1),[v,x]=e.useState(!1),n=e.useRef(null),s=e.useRef(null),[g,S]=e.useState(!1),[y,i]=E(""),[l,c]=E(!1),[p,w]=E(!1);function u(){let t=J().unmemorable.selectEndPos;return t.posy+64>window.document.body.clientHeight&&(t.posy=window.document.body.clientHeight-64),t}e.useEffect(()=>{n.current&&setTimeout(()=>{n.current.focus()},100),r(a.open),a.open?(x(!0),M.fromTo(P,{x:0},{x:20,opacity:1,duration:.6})):M.to(P,{opacity:0,duration:.4,onComplete:function(){x(!1)}})},[a.open]);const C=()=>{z({unmemorable:{aiPanelState:!1}})},N=t=>{o.current&&!o.current.contains(t.target)&&C()},O=t=>{o.current&&!o.current.contains(t.target)&&(C(),t.preventDefault())},W=t=>{t.ctrlKey&&t.key==="Enter"&&(A(),n.current.value="")},A=()=>{const t=n.current.value;t&&(S(!0),i(""),w(!0),c(!1),te.askAI(t,d=>{s.current&&s.current.scrollTo(0,1e4),i(j=>j+d),w(!1)},d=>{i(d),c(!0)},d=>{console.error("AI 请求错误:",d),i("抱歉，发生了错误。"),w(!1)}))},H=()=>{_(y,!1)};return e.createElement($,{invisible:!0,transitionDuration:{appear:500,enter:500,exit:1e3},sx:{zIndex:t=>t.zIndex.drawer+1,pointerEvents:h?"auto":"none"},open:h,onContextMenu:O,onMouseUp:N},e.createElement(b,{ref:o,className:"prompt-panel-content",onClick:t=>{t.preventDefault(),t.stopPropagation()},sx:{width:"50svw",position:"absolute",display:"flex",flexDirection:"column",top:f.posy-window.document.body.clientHeight*.1,left:f.posx-window.document.body.clientWidth*.02,borderRadius:"25px",boxShadow:"7px 6px 12px 7px rgb(0 0 0 / 21%)",backgroundColor:R()=="light"?"white":"#333"}},g?e.createElement(e.Fragment,null,e.createElement(b,{sx:{padding:"21px 2vw 4px 16px"}},e.createElement(L,{ref:s,sx:{height:"20svh",width:"48svw"}},e.createElement(q,{variant:"body1",gutterBottom:!0,sx:{whiteSpace:"pre-wrap"}},p?"AI 正在思考中...":y))),e.createElement(G,null)):e.createElement(e.Fragment,null),e.createElement(b,{className:"FLEX COW",sx:{alignItems:"flex-end"}},e.createElement(B,{autoFocus:!0,multiline:!0,className:"transparent-scrollbar",onKeyDown:W,fullWidth:!0,inputRef:n,sx:{padding:"21px 6px 4px 16px",ml:1,flex:1},maxRows:5,placeholder:"Search in GLM-4 AI Model",inputProps:{"aria-label":"search google maps"}}),e.createElement(k,{type:"button",sx:{p:"10px",borderRadius:"55px "},"aria-label":"search",onClick:A},e.createElement(V,null))),e.createElement(b,{className:"FLEX COW"},e.createElement(T,{title:"Ctrl+J"},e.createElement(k,{disableRipple:!0,sx:{padding:"0px 20px",fontWeight:"700",borderRadius:"25px "}},e.createElement(X,null),"Ask AI")),e.createElement(B,{multiline:!0,disabled:!0,fullWidth:!0,sx:{ml:1,flex:1},maxRows:5,autoFocus:!0,placeholder:"Press Ctrl + Enter To Send",inputProps:{"aria-label":"search google maps"}}),e.createElement(T,{title:"接受AI并插入编辑器"},e.createElement(k,{disabled:!l,color:"primary",onClick:H,sx:{padding:"0px 20px",fontWeight:"700",borderRadius:"25px"},"aria-label":"directions"},e.createElement(Y,null))))))});export{Ce as default};