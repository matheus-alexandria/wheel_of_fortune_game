import { createContext, useState } from "react";

import { WheelOptionModel } from "../model/WheelOptionModel";

type WheelContext = {
  wheelOptions: WheelOptionModel[];
  setWheelOptions: (options: WheelOptionModel[]) => void;
};

export const WheelOptionsContext = createContext<WheelContext | null>(null);

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
} else {
  currentSavedWheelOptions = [
    { title: "Yes", percentage: 100, active: true },
    { title: "No", percentage: 100, active: true },
    { title: "Yes", percentage: 100, active: true },
    { title: "No", percentage: 100, active: true },
    { title: "Yes", percentage: 100, active: true },
    { title: "No", percentage: 100, active: true },
    { title: "Yes", percentage: 100, active: true },
    { title: "No", percentage: 100, active: true }
  ];
}

export function WheelOptionsProvider({ children }): JSX.Element {
  const [wheelOptions, setWheelOptions] = useState(currentSavedWheelOptions);
  return (
    <WheelOptionsContext.Provider value={{ wheelOptions, setWheelOptions }}>
      {children}
    </WheelOptionsContext.Provider>
  );
}
