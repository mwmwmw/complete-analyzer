import React from "react";

const DragAndDrop = ({ children, data, change }) => {
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let files = [...e.dataTransfer.files];

    // if (files && files.length > 0) {
    //   const existingFiles = data.fileList.map((f) => f.name);
    //   files = files.filter((f) => !existingFiles.includes(f.name));
    //   e.dataTransfer.clearData();
    // }

    change(files);
  };

  return (
    <div
      className={"drag-drop-zone"}
      onDrop={(e) => handleDrop(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDragEnter={(e) => handleDragEnter(e)}
      onDragLeave={(e) => handleDragLeave(e)}
    >
      {children}
    </div>
  );
};
export default DragAndDrop;
