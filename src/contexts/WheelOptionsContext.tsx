import { createContext, useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

import { WheelOptionModel } from "../model/WheelOptionModel";

type WheelContext = {
  wheelOptions: WheelOptionModel[];
  setWheelOptions: (options: WheelOptionModel[]) => void;
  handleNewOption: (option: WheelOptionModel) => void;
  handleUpdateOption: (
    index: number,
    updateData: {
      percentage?: number;
      title?: string;
      active?: boolean;
    }
  ) => void;
  handleRemoveOption: (index: number) => void;
  handleHideOption: (index: number) => void;
};

const initialContextValue = {
  wheelOptions: [
    { uuid: uuidV4(), title: "Yes", percentage: 100, active: true },
    { uuid: uuidV4(), title: "No", percentage: 100, active: true },
    { uuid: uuidV4(), title: "Yes", percentage: 100, active: true },
    { uuid: uuidV4(), title: "No", percentage: 100, active: true },
    { uuid: uuidV4(), title: "Yes", percentage: 100, active: true },
    { uuid: uuidV4(), title: "No", percentage: 100, active: true },
    { uuid: uuidV4(), title: "Yes", percentage: 100, active: true },
    { uuid: uuidV4(), title: "No", percentage: 100, active: true }
  ],
  setWheelOptions: () => 0,
  handleNewOption: () => 0,
  handleUpdateOption: () => 0,
  handleRemoveOption: () => 0,
  handleHideOption: () => 0
};

export const WheelOptionsContext =
  createContext<WheelContext>(initialContextValue);

const storageOptions = localStorage.getItem("savedOptions");
let currentSavedWheelOptions: WheelOptionModel[] = [];

if (storageOptions) {
  const parsedOptions = JSON.parse(storageOptions) as WheelOptionModel[];
  parsedOptions.forEach((value) => {
    if (value.active === undefined || value.active === null) {
      value.active = true;
    }
    return value;
  });
  currentSavedWheelOptions = parsedOptions;
}

export function WheelOptionsProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [wheelOptions, setWheelOptions] = useState(currentSavedWheelOptions);

  function handleNewOption(option: WheelOptionModel) {
    setWheelOptions([...wheelOptions, option]);
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

    setWheelOptions(optionsToUpdate);
  }

  function handleRemoveOption(index: number) {
    const updatedOptions = wheelOptions.filter(
      (option) => wheelOptions.indexOf(option) !== index
    );
    setWheelOptions(updatedOptions);
  }

  function handleHideOption(index: number) {
    if (wheelOptions.filter((o) => o.active === true).length === 1) return;
    const optionsCopyToUpdate = [...wheelOptions];
    if (optionsCopyToUpdate[index]?.active === true) {
      optionsCopyToUpdate[index].active = false;
    }
    setWheelOptions(optionsCopyToUpdate);
  }

  useEffect(() => {
    localStorage.setItem("savedOptions", JSON.stringify(wheelOptions));
  }, [wheelOptions]);

  return (
    <WheelOptionsContext.Provider
      value={{
        wheelOptions,
        setWheelOptions,
        handleNewOption,
        handleUpdateOption,
        handleRemoveOption,
        handleHideOption
      }}
    >
      {children}
    </WheelOptionsContext.Provider>
  );
}
