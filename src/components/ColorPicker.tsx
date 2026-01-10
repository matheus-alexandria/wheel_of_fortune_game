import { PaintBrush } from "phosphor-react";

import { useDetectClickOut } from "../hooks/useDetectClickOut";
import { ColorPickerMenu } from "./ColorPickerMenu";

interface ColorPickerProps {
  wheelColors: string[];
  handleWheelColors: (colors: string[]) => void;
}

export function ColorPicker({
  handleWheelColors,
  wheelColors
}: ColorPickerProps) {
  const {
    nodeRef,
    triggerRef,
    show: isColorMenuOpen,
    setShow
  } = useDetectClickOut(false);

  const iconsSize = window.innerWidth > 1280 ? 20 : 16;

  return (
    <>
      <button ref={triggerRef}>
        <PaintBrush size={iconsSize} weight="bold" className="text-white" />
      </button>
      {isColorMenuOpen && (
        <ColorPickerMenu
          wheelColors={wheelColors}
          handleWheelColors={handleWheelColors}
          customRef={nodeRef}
        />
      )}
    </>
  );
}
