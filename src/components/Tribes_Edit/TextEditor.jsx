import React, { useEffect, useRef, useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

const editorOptions = {
  height: 200,
  buttonList: [
    ["undo", "redo"],
    ["removeFormat"],
    ["bold", "underline", "italic", "fontSize"],
    ["fontColor", "hiliteColor"],
    ["align", "horizontalRule", "list"],
    ["table", "link", "image", "imageGallery"],
    ["showBlocks", "codeView"]
  ],
  imageRotation: false,
  fontSize: [12, 14, 16, 18, 20],
  colorList: [
    [
      "#828282",
      "#FF5400",
      "#676464",
      "#F1F2F4",
      "#FF9B00",
      "#F00",
      "#fa6e30",
      "#000",
      "rgba(255, 153, 0, 0.1)",
      "#FF6600",
      "#0099FF",
      "#74CC6D",
      "#FF9900",
      "#CCCCCC"
    ]
  ],
  imageUploadUrl: "http://localhost:8080/chazki-gateway/orders/upload",
  imageGalleryUrl: "http://localhost:8080/chazki-gateway/orders/gallery"
};

export const TextEditor = ({ onChange, initialContent = "" }) => {
  const editorRef = useRef(null);
  const [value, setValue] = useState(initialContent);

  // Update local state and call the parent's onChange callback when the content changes.
  const onChangeHandler = (content) => {
    setValue(content);
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <div>
      <SunEditor
        ref={editorRef}
        setOptions={editorOptions}
        lang="es"
        onChange={onChangeHandler}
        defaultValue={initialContent}
      />
    </div>
  );
};
