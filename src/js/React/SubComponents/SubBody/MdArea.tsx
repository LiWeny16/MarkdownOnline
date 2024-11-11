import React from "react"
import MonacoEditor from "@Com/myCom/Monaco/monaco"
export default function MdArea({ setMarkdownViewerWidth }: any) {
  return (
    <>
      <MonacoEditor setMarkdownViewerWidth={setMarkdownViewerWidth} />
    </>
  )
}
