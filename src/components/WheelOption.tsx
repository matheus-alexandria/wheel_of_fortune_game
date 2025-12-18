import { Eye, EyeClosed, X } from "phosphor-react";
import { useState } from "react";

import { WheelOptionModel } from "../model/WheelOptionModel";

interface WheelOptionProps {
  option: WheelOptionModel;
  updateOption: (
    index: number,
    updateData: {
      percentage?: number;
      title?: string;
      active?: boolean;
    }
  ) => void;
  removeOption: (index: number) => void;
  index: number;
}

export function WheelOption({
  option,
  updateOption,
  removeOption,
  index
}: WheelOptionProps) {
  const [isActive, setIsActive] = useState(true);

  return (
    <div
      className={`w-[98%] min-h-[37px] flex justify-between items-center p-2 bg-gray-900 rounded-md ${
        isActive ? "opacity-100" : "opacity-50"
      }`}
    >
      <div className="flex items-center">
        <input
          type={"text"}
          defaultValue={option.percentage}
          value={option.percentage}
          onChange={(e) => {
            const valueAsNumber = Number(e.target.value);
            if (!Number.isNaN(valueAsNumber)) {
              updateOption(index, { percentage: valueAsNumber });
            } else {
              updateOption(index, { percentage: option.percentage });
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
            updateOption(index, { title: newTitle });
          }}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            const newState = !isActive;
            updateOption(index, { active: newState });
            setIsActive(newState);
          }}
        >
          {isActive ? (
            <Eye color="white" size={19} />
          ) : (
            <EyeClosed color="white" size={19} />
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            removeOption(index);
          }}
        >
          <X size={16} color="white" />
        </button>
      </div>
    </div>
  );
}
