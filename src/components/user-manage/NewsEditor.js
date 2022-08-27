import React, { useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, ContentState, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {
  const [editorState, seteditorState] = useState("")

  useEffect(()=>{
    const html = props.content
    //console.log(html)
    if(html===undefined){
      return
    }else{
      //console.log(html)
      const contentBlock = htmlToDraft(html)
      if(contentBlock){
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        seteditorState(editorState)
      }
    }
  },[props.content])

  return (
    <div>
        <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={(editorState)=>{
                seteditorState(editorState)
            }}

            onBlur={()=>{
                //console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
            }}
        />
    </div>
  )
}
