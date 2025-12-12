import { createContext } from "react";

import { WheelOptionModel } from "../model/WheelOptionModel";

type WheelContext = {
  wheelOptions: WheelOptionModel[];
  setWheelOptions: (options: WheelOptionModel[]) => void;
};

export const WheelOptionsContext = createContext<WheelContext | null>(null);
