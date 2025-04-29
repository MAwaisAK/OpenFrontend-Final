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

export const TextEditor = ({ onChange, initialValue = "" }) => {
  const editorRef = useRef(null);
  const [value, setValue] = useState(initialValue);

  // Update local state if initialValue prop changes.
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onChangeHandler = (content) => {
    setValue(content);
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <div>
      <SunEditor
  key={initialValue} // Forces re-mount when initialValue changes.
  ref={editorRef}
  setOptions={editorOptions}
  lang="en"
  onChange={onChangeHandler}
  defaultValue={initialValue}
/>

    </div>
  );
};
