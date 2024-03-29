import { X } from "phosphor-react";

import { WheelOptionModel } from "../model/WheelOptionModel";

interface WheelOptionProps {
  option: WheelOptionModel;
  updateOption: (percentage: number, title: string, index: number) => void;
  removeOption: (index: number) => void;
  index: number;
}

export function WheelOption({
  option,
  updateOption,
  removeOption,
  index
}: WheelOptionProps) {
  return (
    <div className="w-[98%] min-h-[37px] flex justify-between items-center p-2 bg-gray-900 rounded-md">
      <div className="flex items-center">
        <input
          type={"text"}
          defaultValue={option.percentage}
          value={option.percentage}
          onChange={(e) => {
            const valueAsNumber = Number(e.target.value);
            if (!Number.isNaN(valueAsNumber)) {
              updateOption(valueAsNumber, option.title, index);
            } else {
              updateOption(option.percentage, option.title, index);
            }
          }}
          className="font-extrabold text-white w-12 bg-gray-900"
        />
        <input
          type={"text"}
          defaultValue={option.title}
          value={option.title}
          className="font-extrabold w-full text-white bg-gray-900"
          onChange={(e) => {
            const newTitle = e.target.value.toString();
            updateOption(option.percentage, newTitle, index);
          }}
        />
      </div>
      <button
        type="button"
        onClick={() => {
          removeOption(index);
        }}
      >
        <X size={16} color="white" />
      </button>
    </div>
  );
}
