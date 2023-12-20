import React from "react";

// import fastKeyEvent from "@Root/js/functions/fastKey"
import { kit, enObj } from "@Root/js/index";
import fastKeyEvent from "@Func/Events/fastKey";
import pasteEvent from "@Func/Events/pasteEvent";
import dragFileEvent from "@Func/Events/dragFile";
import MdArea from "./SubBody/MdArea";

function enEvents(doIt: boolean): void {
  if (doIt) {
    enObj.enFastKey ? fastKeyEvent() : undefined;
    // enObj.enPasteEvent ? pasteEvent() : undefined;
    // enObj.enDragFile ? dragFileEvent() : undefined;
  }
}

export default function Body() {
  React.useEffect(() => {
    enEvents(true);
  }, []);
  return (
    <>
      <div id="topBox">
        <div id="editor">
          <MdArea />
          <article id="view-area-hidden" className="hidden-pre"></article>
          <article id="view-area" className="markdown-body"></article>
        </div>
      </div>

      <div id="aboutBox">
        <div id="markdownParser">
          <div id="aboutMd" className="aboutViewArea markdown-body">
            <span></span>
          </div>
        </div>
      </div>
    </>
  );
}
