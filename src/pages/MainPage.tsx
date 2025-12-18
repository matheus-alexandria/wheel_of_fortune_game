// import { Howl } from "howler";
import { SpeakerHigh, SpeakerX } from "phosphor-react";
import { useEffect, useState } from "react";

import { OptionsMenu } from "../components/OptionsMenu";
import { WheelOfFortune } from "../components/WheelOfFortune";
import { WheelOptionsContext } from "../contexts/WheelOptionsContext";
import { WheelOptionModel } from "../model/WheelOptionModel";
import { changeSoundVolume } from "../sounds";

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

export function MainPage() {
  const [wheelOptions, setWheelOptions] = useState<WheelOptionModel[]>(
    currentSavedWheelOptions
  );
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(true);
  const [colors, setColors] = useState(["#000000", "#ffffff", "#808080"]);
  const [audioVolume, setAudioVolume] = useState(0.2);

  function handleWheelOptions(options: WheelOptionModel[]) {
    setWheelOptions([...options]);
  }

  function handleOptionsModal(state: boolean) {
    setIsOptionsModalOpen(state);
  }

  function handleWheelColors(colors: string[]) {
    setColors([...colors]);
  }

  function adaptScreen() {
    if (window.innerWidth < 1250) {
      setIsOptionsModalOpen(false);
    }
  }

  useEffect(() => {
    const storageColors = localStorage.getItem("savedWheelColors");
    if (storageColors) {
      const cs = JSON.parse(storageColors);
      setColors(cs);
    }

    window.addEventListener("resize", adaptScreen);

    return () => {
      window.removeEventListener("resize", adaptScreen);
    };
  }, []);

  function handleAudioVolume() {
    if (audioVolume > 0) {
      changeSoundVolume(0);
      setAudioVolume(0);
    } else {
      changeSoundVolume(0.1);
      setAudioVolume(1);
    }
  }

  useEffect(() => {
    localStorage.setItem("savedOptions", JSON.stringify(wheelOptions));
  }, [wheelOptions]);

  return (
    <WheelOptionsContext.Provider value={{ wheelOptions, setWheelOptions }}>
      <div className="w-screen h-screen flex items-center justify-center bg-zinc-700 overflow-hidden">
        <button
          onClick={() => handleAudioVolume()}
          className="fixed p-1 rounded-full bg-gray-500 bottom-10 left-[5%] hover:bg-gray-600 transition-colors"
        >
          {audioVolume > 0 ? (
            <SpeakerHigh size={32} className="text-white" />
          ) : (
            <SpeakerX size={32} className="text-white" />
          )}
        </button>
        <div
          className={`flex w-1/2 flex-col items-center justify-center gap-2 mr-4 transition-all duration-300 ${
            isOptionsModalOpen ? "translate-x-0" : "translate-x-1/4"
          }`}
        >
          <WheelOfFortune
            canvasSize={700}
            colors={colors}
            options={wheelOptions.length > 0 ? wheelOptions : undefined}
          />
        </div>

        <OptionsMenu
          wheelOptions={wheelOptions}
          isModalOpen={isOptionsModalOpen}
          wheelColors={colors}
          handleWheelOptions={handleWheelOptions}
          handleOptionsModal={handleOptionsModal}
          handleWheelColors={handleWheelColors}
        />
      </div>
    </WheelOptionsContext.Provider>
  );
}
