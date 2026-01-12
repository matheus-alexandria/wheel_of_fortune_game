import { ArrowLeft } from "phosphor-react";
import { useContext } from "react";

import { WheelOptionsContext } from "../contexts/WheelOptionsContext";
import { AddOptionForm } from "./AddOptionForm";
import { OptionsHeader } from "./OptionsHeader";
import { WheelOption } from "./WheelOption";

interface OptionMenuProps {
  isModalOpen: boolean;
  wheelColors: string[];
  handleOptionsModal: (state: boolean) => void;
  handleWheelColors: (colors: string[]) => void;
}

export function OptionsMenu({
  isModalOpen,
  wheelColors,
  handleOptionsModal,
  handleWheelColors
}: OptionMenuProps) {
  const optionsContext = useContext(WheelOptionsContext);

  return (
    <>
      <div
        className={`
            flex h-[600px] flex-col justify-start items-center p-5 bg-zinc-600 border-white border-[3px] rounded-md transition-all duration-300 ease-out 
            ${isModalOpen ? "opacity-100" : "translate-x-full opacity-0"}
            max-xl:mt-10 max-xl:w-[80%] max-xl:h-[350px]
          `}
      >
        <OptionsHeader
          isModalOpen={isModalOpen}
          wheelColors={wheelColors}
          handleOptionsModal={handleOptionsModal}
          handleWheelColors={handleWheelColors}
        />

        <AddOptionForm saveOption={optionsContext.handleNewOption} />
        <div className="w-full flex flex-col items-start gap-2 overflow-y-auto max-xl:text-[15px]">
          {optionsContext.wheelOptions.map((option, index) => (
            <WheelOption
              key={`option-${index}`}
              index={index}
              option={option}
            />
          ))}
        </div>
      </div>

      <button
        className={`fixed right-28 transition-all ease-in transform ${
          isModalOpen
            ? "duration-300 translate-x-full opacity-0"
            : "duration-500 translate-x-0 opacity-100"
        }`}
        onClick={() => handleOptionsModal(true)}
        disabled={isModalOpen}
      >
        <ArrowLeft size={32} className="text-white" />
      </button>
    </>
  );
}
