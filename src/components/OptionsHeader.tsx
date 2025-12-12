import { DotsThree, Eye, FloppyDisk, Shuffle } from "phosphor-react";
import { useEffect, useState } from "react";

import { WheelOptionModel } from "../model/WheelOptionModel";
import { api } from "../utils/api";
import { ColorPicker } from "./ColorPicker";
import { DeleteAllOptions } from "./DeleteAllOptions";
import { ImportFormDropzone } from "./ImportFormDropzone";

interface OptionsHeaderProps {
  isModalOpen: boolean;
  wheelOptions: WheelOptionModel[];
  wheelColors: string[];
  handleWheelOptions: (options: WheelOptionModel[]) => void;
  handleOptionsModal: (state: boolean) => void;
  handleWheelColors: (colors: string[]) => void;
}

export function OptionsHeader({
  isModalOpen,
  wheelOptions,
  wheelColors,
  handleWheelOptions,
  handleOptionsModal,
  handleWheelColors
}: OptionsHeaderProps) {
  const [isServerOnline, setIsServerOnline] = useState(true);

  function handleOptionsSaveFile() {
    const now = new Date();
    const saveOptionsData = {
      name: now.getTime(),
      options: wheelOptions
    };
    api
      .post("/export", saveOptionsData, { responseType: "blob" })
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${saveOptionsData.name}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }

  function handleShuffleOptions() {
    const rearrengedOptions = wheelOptions;
    for (let i = rearrengedOptions.length - 1; i > 0; i -= 1) {
      const toChange = Math.floor(Math.random() * (i + 1));
      [rearrengedOptions[i], rearrengedOptions[toChange]] = [
        rearrengedOptions[toChange],
        rearrengedOptions[i]
      ];
    }

    handleWheelOptions(rearrengedOptions);
  }

  useEffect(() => {
    api
      .get("/healthcheck")
      .then((res) => console.log(res))
      .catch(() => {
        setIsServerOnline(false);
      });
  }, []);

  return (
    <header className="w-full flex justify-between items-start">
      <b className="text-white text-xl">Options</b>
      <div className="flex gap-4">
        <button onClick={() => handleOptionsModal(false)}>
          <Eye size={20} weight="bold" className="text-white" />
        </button>
        <button onClick={() => handleShuffleOptions()}>
          <Shuffle size={20} weight="bold" className="text-white" />
        </button>
        {/* <button>
          <DotsThree className="text-white" size={26} weight="bold" />
        </button> */}
        <ColorPicker
          handleWheelColors={handleWheelColors}
          wheelColors={wheelColors}
        />
        {isServerOnline && (
          <>
            <ImportFormDropzone
              handleWheelOptions={handleWheelOptions}
              isModalOpen={isModalOpen}
            />
            <button
              disabled={!wheelOptions.length}
              onClick={() => handleOptionsSaveFile()}
            >
              <FloppyDisk
                size={20}
                weight="bold"
                className={`text-white ${
                  wheelOptions.length ? "opacity-100" : "opacity-30"
                }`}
              />
            </button>
          </>
        )}
        <DeleteAllOptions
          wheelOptions={wheelOptions}
          handleWheelOptions={handleWheelOptions}
        />
      </div>
    </header>
  );
}
