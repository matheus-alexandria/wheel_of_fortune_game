import { Trash } from "phosphor-react";
import { useContext, useState } from "react";

import { WheelOptionsContext } from "../contexts/WheelOptionsContext";

export function DeleteAllOptions() {
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  const optionsContext = useContext(WheelOptionsContext);

  const iconsSize = window.innerWidth > 1280 ? 20 : 16;

  return (
    <>
      <button
        disabled={!optionsContext.wheelOptions.length}
        onClick={() => setIsDeleteConfirmationOpen(true)}
      >
        <Trash
          size={iconsSize}
          weight="bold"
          className={`text-white ${
            optionsContext.wheelOptions.length ? "opacity-100" : "opacity-30"
          }`}
        />
      </button>
      {isDeleteConfirmationOpen && (
        <div className="fixed w-[35%] h-[20%] flex flex-col items-center justify-center border-2 rounded-lg bg-slate-600 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p className="text-white text-xl">
            Are you sure you want to delete all current options?
          </p>
          <div className="w-1/2 flex items-center justify-between">
            <button
              onClick={() => setIsDeleteConfirmationOpen(false)}
              className="px-4 bg-zinc-200 text-black text-lg rounded-md mt-6 hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                optionsContext.setWheelOptions([]);
                setIsDeleteConfirmationOpen(false);
              }}
              className="px-4 bg-red-500 text-white text-lg rounded-md mt-6 hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </>
  );
}
