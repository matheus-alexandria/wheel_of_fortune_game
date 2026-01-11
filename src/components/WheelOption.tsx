import { Eye, EyeClosed, X } from "phosphor-react";
import { useContext } from "react";

import { WheelOptionsContext } from "../contexts/WheelOptionsContext";
import { WheelOptionModel } from "../model/WheelOptionModel";

interface WheelOptionProps {
  option: WheelOptionModel;
  index: number;
}

export function WheelOption({ option, index }: WheelOptionProps) {
  const optionsContext = useContext(WheelOptionsContext);

  const iconsSize = window.innerWidth > 1280 ? 19 : 15;

  return (
    <div
      className={`w-[98%] min-h-[37px] flex justify-between items-center p-2 bg-gray-900 rounded-md ${
        option.active ? "opacity-100" : "opacity-50"
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
              optionsContext.handleUpdateOption(index, {
                percentage: valueAsNumber
              });
            } else {
              optionsContext.handleUpdateOption(index, {
                percentage: option.percentage
              });
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
            optionsContext.handleUpdateOption(index, { title: newTitle });
          }}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            const newState = !option.active;
            optionsContext.handleUpdateOption(index, { active: newState });
          }}
        >
          {option.active ? (
            <Eye color="white" size={iconsSize} />
          ) : (
            <EyeClosed color="white" size={iconsSize} />
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            optionsContext.handleRemoveOption(index);
          }}
        >
          <X size={iconsSize} color="white" />
        </button>
      </div>
    </div>
  );
}
