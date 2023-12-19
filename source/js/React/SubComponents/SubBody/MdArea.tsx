import React from 'react'
import MonacoEditor from '@Com/myCom/Monaco/monaco'
export default function MdArea() {
  return (
    <>
    <textarea placeholder="" id="md-area" ></textarea>
    <MonacoEditor/>
    </>
  )
}
