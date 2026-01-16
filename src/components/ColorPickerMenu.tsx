import { useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

interface ColorPickerMenuProps {
  wheelColors: string[];
  handleWheelColors: (colors: string[]) => void;
  customRef: React.RefObject<HTMLDivElement>;
}

export function ColorPickerMenu({
  wheelColors,
  handleWheelColors,
  customRef
}: ColorPickerMenuProps) {
  const [colors, setColors] = useState(wheelColors);
  const [colorOptionSelected, setColorOptionSelected] = useState(0);

  function handleApplyNewColors() {
    localStorage.setItem("savedWheelColors", JSON.stringify(colors));
    handleWheelColors(colors);
  }

  function handlePickerColors(newColor: string) {
    const newColors = wheelColors.map((c, i) => {
      if (i === colorOptionSelected) return newColor;
      return c;
    });

    setColors(newColors);
  }

  return (
    <div
      className={`
      fixed flex-col bg-gray-500 p-4 rounded-md
      max-xl:-translate-x-28
    `}
      ref={customRef}
    >
      <div className="flex items-start gap-3">
        {wheelColors.map((_, index) => {
          return (
            <button
              key={index}
              className={`h-8 w-8 flex items-center justify-center rounded-full p-3 text-white text-xl bg-black ${
                colorOptionSelected === index
                  ? "opacity-100"
                  : "opacity-70 bg-gray-800"
              }`}
              onClick={() => setColorOptionSelected(index)}
            >
              {index}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col items-start gap-5">
        <HexColorPicker
          className="top-2"
          color={wheelColors[colorOptionSelected]}
          onChange={handlePickerColors}
        />

        <HexColorInput
          className="w-[200px] rounded-sm border-none bg-gray-200"
          color={wheelColors[colorOptionSelected]}
          onChange={handlePickerColors}
        />
      </div>
      <button
        className="w-full p-2 rounded-md bg-green-500 text-white font-bold hover:bg-green-600 transition-colors mt-3"
        onClick={() => handleApplyNewColors()}
      >
        Apply
      </button>
    </div>
  );
}
