import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { loader } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';
loader.config({
  paths: {
    vs: "https://md.bigonion.cn/source/assets/cdn/min/vs/",
  },
})
const files:any = {
  'script.js': {
    name: 'script.js',
    language: 'javascript',
    value: "nihao",
  },
  'style.css': {
    name: 'style.css',
    language: 'css',
    value: "nihao",
  },
  'index.md': {
    name: 'index.md',
    language: 'markdown',
    value:  "# nihao 你是谁",
  },
};
export default function MonacoEditor() {
  const [fileName, setFileName] = useState('script.js');
  const file = files[fileName];

  return (
    <>
      <div style={{position:"absolute",left:"36%",top:"20%",height:"50vh"}}>
      {/* <button disabled={fileName === 'script.js'} onClick={() => setFileName('script.js')}>
        script.js
      </button>
      <button disabled={fileName === 'style.css'} onClick={() => setFileName('style.css')}>
        style.css
      </button>
      <button disabled={fileName === 'index.md'} onClick={() => setFileName('index.md')}>
        index.md
      </button> */}
      <Editor
        height="50vh"
        width={"40vw"}
        theme="vs-dark"
        path={file.name}
        defaultLanguage={file.language}
        defaultValue={file.value}
      />
      </div>
    </>
  );
}

