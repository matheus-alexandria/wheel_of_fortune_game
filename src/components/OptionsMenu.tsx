import { ArrowLeft } from "phosphor-react";

import { WheelOptionModel } from "../model/WheelOptionModel";
import { AddOptionForm } from "./AddOptionForm";
import { OptionsHeader } from "./OptionsHeader";
import { WheelOption } from "./WheelOption";

interface OptionMenuProps {
  wheelOptions: WheelOptionModel[];
  isModalOpen: boolean;
  wheelColors: string[];
  handleWheelOptions: (options: WheelOptionModel[]) => void;
  handleOptionsModal: (state: boolean) => void;
  handleWheelColors: (colors: string[]) => void;
}

export function OptionsMenu({
  wheelOptions,
  isModalOpen,
  wheelColors,
  handleWheelOptions,
  handleOptionsModal,
  handleWheelColors
}: OptionMenuProps) {
  function handleNewOption(option: WheelOptionModel) {
    handleWheelOptions([...wheelOptions, option]);
  }

  function handleUpdateOption(
    index: number,
    updateData: {
      percentage?: number;
      title?: string;
      active?: boolean;
    }
  ) {
    const optionsToUpdate = [...wheelOptions];
    if (updateData.percentage)
      optionsToUpdate[index].percentage = updateData.percentage;
    if (updateData.title) optionsToUpdate[index].title = updateData.title;
    if (updateData.active !== undefined)
      optionsToUpdate[index].active = updateData.active;

    handleWheelOptions(optionsToUpdate);
  }

  function handleRemoveOption(index: number) {
    const updatedOptions = wheelOptions.filter(
      (option) => wheelOptions.indexOf(option) !== index
    );
    handleWheelOptions(updatedOptions);
  }

  return (
    <>
      <div
        className={`flex h-[600px] flex-col justify-start items-center p-5 bg-zinc-600 border-white border-[3px] rounded-md transition-all duration-300 ease-out ${
          isModalOpen ? "opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <OptionsHeader
          isModalOpen={isModalOpen}
          wheelOptions={wheelOptions}
          wheelColors={wheelColors}
          handleWheelOptions={handleWheelOptions}
          handleOptionsModal={handleOptionsModal}
          handleWheelColors={handleWheelColors}
        />

        <AddOptionForm saveOption={handleNewOption} />
        <div className="w-full flex flex-col items-start gap-2 overflow-y-auto">
          {wheelOptions.map((option, index) => (
            <WheelOption
              key={`option-${index}`}
              index={index}
              option={option}
              updateOption={handleUpdateOption}
              removeOption={handleRemoveOption}
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
