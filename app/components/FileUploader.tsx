import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      if (onFileSelect) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/pdf": [".pdf"] },
      maxSize: 20 * 1024 * 1024, // 20MB
    });

  const file = acceptedFiles.length > 0 ? acceptedFiles[0] : null;
  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="cursor-pointer space-y-6">
          <div className="mx-auto w-16 h-16 flex items-center justify-center">
            <img src="/icons/info.svg" alt="upload icon" className="size-18" />
          </div>
          {file ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="uploader-selected-file"
            >
              <img src="/images/pdf.png" alt="pdf" className="size-10" />
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2) + " MB"}
                  </p>
                </div>
              </div>
              <button
                className="cursor-pointer p-2 "
                onClick={(e) => {
                  onFileSelect?.(null as unknown as File);
                }}
              >
                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <p className="text-lg text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-lg text-gray-400">PDF to 20MB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
