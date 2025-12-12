import { FileArrowDown } from "phosphor-react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { useDetectClickOut } from "../hooks/useDetectClickOut";
import { WheelOptionModel } from "../model/WheelOptionModel";
import { api } from "../utils/api";

interface ImportFormDropzoneProps {
  handleWheelOptions: (options: WheelOptionModel[]) => void;
  isModalOpen: boolean;
}

export function ImportFormDropzone({
  handleWheelOptions,
  isModalOpen
}: ImportFormDropzoneProps) {
  const {
    triggerRef,
    nodeRef,
    show: isDropzoneOpen,
    setShow: setIsDropzoneOpen
  } = useDetectClickOut(false);
  const [isDrozoneDisabled, setIsDropzoneDisabled] = useState(false);
  const [file, setFile] = useState<File>();
  const [fileComponent, setFileComponent] = useState<JSX.Element>();
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "text/csv": [".csv"]
    },
    maxFiles: 1
  });

  function handleSendCsvFile() {
    if (fileComponent) {
      api
        .post(
          "/import",
          {
            file
          },
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        )
        .then((res) => res.data)
        .then((data: WheelOptionModel[]) => {
          handleWheelOptions(data);
          setFileComponent(undefined);
          setIsDropzoneOpen(false);
          setIsDropzoneDisabled(false);
        })
        .catch((reason) => {
          console.log("Error while importing: ", reason.message);
        });
    }
  }

  function handleChangeFile() {
    setFileComponent(undefined);
    setIsDropzoneDisabled(false);
  }

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const currentFile = acceptedFiles[0];
      setFile(currentFile);
      setFileComponent(
        <p className="text-white text-lg" key={currentFile.name}>
          {currentFile.name}
        </p>
      );
      setIsDropzoneDisabled(true);
    }
  }, [acceptedFiles]);

  useEffect(() => {
    setIsDropzoneOpen(false);
  }, [isModalOpen]);

  return (
    <>
      <button ref={triggerRef}>
        <FileArrowDown size={20} weight="bold" className="text-white" />
      </button>

      {isDropzoneOpen && (
        <div
          {...getRootProps({
            className: `fixed w-1/2 h-1/4 flex flex-col items-center justify-center border-2 border-dashed bg-slate-600 inset-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
              fileComponent ? "border-green-400" : "border-gray-400"
            }`,
            ref: nodeRef
          })}
        >
          <input {...getInputProps({ disabled: isDrozoneDisabled })} />
          {fileComponent || (
            <p className="text-white text-lg">
              Drag 'n' drop a csv file here, or click to select one
            </p>
          )}

          {fileComponent && (
            <div className="flex items-center gap-5">
              <button
                onClick={handleChangeFile}
                className="px-4 bg-zinc-200 text-black rounded-md mt-6 hover:bg-zinc-300 transition-colors opacity-100"
              >
                Change file
              </button>
              <button
                onClick={handleSendCsvFile}
                className="px-4 bg-zinc-200 text-black rounded-md mt-6 hover:bg-zinc-300 transition-colors opacity-100"
              >
                Load options
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
