import { Eye, FloppyDisk, Shuffle } from "phosphor-react";
import { useContext, useEffect, useState } from "react";

import { WheelOptionsContext } from "../contexts/WheelOptionsContext";
import { api } from "../utils/api";
import { ColorPicker } from "./ColorPicker";
import { DeleteAllOptions } from "./DeleteAllOptions";
import { ImportFormDropzone } from "./ImportFormDropzone";

interface OptionsHeaderProps {
  isModalOpen: boolean;
  wheelColors: string[];
  handleOptionsModal: (state: boolean) => void;
  handleWheelColors: (colors: string[]) => void;
}

export function OptionsHeader({
  isModalOpen,
  wheelColors,
  handleOptionsModal,
  handleWheelColors
}: OptionsHeaderProps) {
  const [isServerOnline, setIsServerOnline] = useState(true);
  const optionsContext = useContext(WheelOptionsContext);

  function handleOptionsSaveFile() {
    const now = new Date();
    const saveOptionsData = {
      name: now.getTime(),
      options: optionsContext?.wheelOptions
    };
    api
      .post("/export", saveOptionsData, { responseType: "blob" })
      .then((response) => response.data)
      .then((data) => {
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
    if (!optionsContext) return;
    const rearrangedOptions = optionsContext.wheelOptions;
    for (let i = rearrangedOptions.length - 1; i > 0; i -= 1) {
      const toChange = Math.floor(Math.random() * (i + 1));
      [rearrangedOptions[i], rearrangedOptions[toChange]] = [
        rearrangedOptions[toChange],
        rearrangedOptions[i]
      ];
    }

    optionsContext.setWheelOptions(rearrangedOptions);
  }

  useEffect(() => {
    api
      .get("/healthcheck")
      .then((res) => console.log("Health check ok", res))
      .catch(() => {
        setIsServerOnline(false);
      });
  }, []);

  const iconsSize = window.innerWidth > 1280 ? 20 : 16;

  return (
    <header className="w-full flex justify-between items-center">
      <b className="text-white text-xl max-xl:text-[16px]">Options</b>
      <div className="flex gap-4 max-xl:gap-2">
        <button onClick={() => handleOptionsModal(false)}>
          <Eye size={iconsSize} weight="bold" className="text-white" />
        </button>
        <button onClick={() => handleShuffleOptions()}>
          <Shuffle size={iconsSize} weight="bold" className="text-white" />
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
            <ImportFormDropzone isModalOpen={isModalOpen} />
            <button
              disabled={!optionsContext.wheelOptions.length}
              onClick={() => handleOptionsSaveFile()}
            >
              <FloppyDisk
                size={iconsSize}
                weight="bold"
                className={`text-white ${
                  optionsContext.wheelOptions.length
                    ? "opacity-100"
                    : "opacity-30"
                }`}
              />
            </button>
          </>
        )}
        <DeleteAllOptions />
      </div>
    </header>
  );
}
