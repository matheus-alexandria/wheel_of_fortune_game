import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { WheelOptionsContext } from "../contexts/WheelOptionsContext";
import { WheelOptionModel } from "../model/WheelOptionModel";
import { useSoundEffects } from "../sounds";
import { adaptWheelTitle } from "../utils/adaptWheelTitle";
import { tickSoundAngle } from "../utils/tickSoundAngle";

interface WheelOfFortuneProps {
  canvasSize: number;
  colors: string[];
  options?: WheelOptionModel[];
}

const defaultOptions = [
  { title: "Yes", percentage: 100, active: true },
  { title: "No", percentage: 100, active: true },
  { title: "Yes", percentage: 100, active: true },
  { title: "No", percentage: 100, active: true },
  { title: "Yes", percentage: 100, active: true },
  { title: "No", percentage: 100, active: true },
  { title: "Yes", percentage: 100, active: true },
  { title: "No", percentage: 100, active: true }
];

export function WheelOfFortune({
  canvasSize,
  colors,
  options = defaultOptions
}: WheelOfFortuneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spin, setSpin] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const earlyStop = useRef(false);
  const timeoutIds = useRef<number[]>([]);
  const { wheelTick: wheelTickSound, spinningMusic: spinningSong } =
    useSoundEffects({ sounds: ["spinningMusic", "wheelTick"] });

  const activeOptions = useMemo(() => {
    const activeOptions = options.filter((o) => {
      console.log(`Option: ${o.title}, ativa: ${o.active}`);
      return o.active === true;
    });
    return activeOptions;
  }, [options]);

  const optionsContext = useContext(WheelOptionsContext);

  const optionsChancesSum = useMemo(() => {
    return activeOptions.reduce((prev, cur) => {
      if (!cur.active) return prev;
      const sum = prev + cur.percentage;
      return sum;
    }, 0);
  }, [activeOptions]);

  function textColor(backgroundColor: string) {
    const red = parseInt(backgroundColor.slice(1, 3), 16);
    const green = parseInt(backgroundColor.slice(3, 5), 16);
    const blue = parseInt(backgroundColor.slice(5, 7), 16);

    const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

    if (brightness > 128) {
      return "#000000";
    }

    return "#ffffff";
  }

  const frame = useRef(0);
  const framesToSum = useRef(0.4);

  function wheelSlowDown() {
    const rate = 0.3;
    framesToSum.current = rate;
    spinningSong.current.play();
    const animationDurationInSeconds = Math.floor(Math.random() * 8 + 6);
    // const animationDurationInSeconds = 1;
    const smoothnessIndicator = 10;
    const slowdownTicks = animationDurationInSeconds * smoothnessIndicator;
    const speedToReduceByTick = rate / (slowdownTicks - 1);
    for (let t = 1; t <= slowdownTicks; t += 1) {
      const timeoutId = setTimeout(() => {
        if (framesToSum.current - speedToReduceByTick > 0) {
          timeoutIds.current.shift();
          framesToSum.current -= speedToReduceByTick;
        } else {
          spinningSong.current.stop();
          framesToSum.current = 0;
        }
      }, (t * 1000) / smoothnessIndicator);

      timeoutIds.current.push(timeoutId);
    }
  }

  function drawSpinButton(
    draw: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number
  ) {
    draw.beginPath();
    draw.moveTo(x, y);
    draw.fillStyle = "#ca75fb";
    draw.arc(x, y, radius, 0, 2 * Math.PI);
    draw.lineWidth = 6;
    draw.setLineDash([]);
    draw.strokeStyle = "#5f46a5";
    draw.stroke();
    draw.closePath();
    draw.fill();

    draw.beginPath();
    draw.moveTo(x, y - radius - 11);
    draw.lineTo(x - 10, y - radius + 1);
    draw.lineTo(x + 10, y - radius + 1);
    draw.closePath();
    draw.fill();

    draw.fillStyle = "white";
    draw.font = "bold 16px Arial";
    draw.textAlign = "center";
    draw.fillText("SPIN", x, y);

    draw.lineWidth = 1;
  }

  function addSpinButtonListener() {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const canvasHalf = canvas.width / 2;

      if (ctx) {
        const circle = new Path2D();
        circle.arc(
          canvasHalf,
          canvasHalf,
          (4 / 36) * canvasHalf,
          0,
          2 * Math.PI
        );

        canvas.addEventListener("click", (event) => {
          if (ctx.isPointInPath(circle, event.offsetX, event.offsetY)) {
            setSpin(true);
          }
        });
      }
    }
  }

  function drawBackground(
    draw: CanvasRenderingContext2D,
    w: number,
    h: number
  ) {
    draw.clearRect(0, 0, w, h);

    draw.fillStyle = "rgba(63,63,70,1)";
    draw.fillRect(0, 0, w, h);
  }

  const drawWheel = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = canvas.width / 2;
      const optionsAmount = activeOptions.length;
      const maxAngle = 2 * Math.PI;
      let startAngle = frame.current;
      const endAngle = maxAngle;
      let colorIndex = 0;

      if (ctx) {
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "none";
        drawBackground(ctx, canvas.width, canvas.height);

        for (let i = 0; i < optionsAmount; i += 1) {
          tickSoundAngle(
            startAngle,
            wheelTickSound.current,
            framesToSum.current
          );
          const optionAngle =
            (activeOptions[i].percentage / optionsChancesSum) * endAngle +
            startAngle;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);

          ctx.fillStyle = colors[colorIndex];
          colorIndex = (colorIndex + 1) % colors.length;
          if (i + 1 === activeOptions.length) {
            const [firstColor, secondColor] = colors;
            if (ctx.fillStyle === firstColor) {
              ctx.fillStyle = secondColor;
            }
          }

          ctx.arc(centerX, centerY, radius, startAngle, optionAngle);
          ctx.setLineDash([]);
          ctx.strokeStyle = "#000000";
          ctx.stroke();

          ctx.closePath();
          ctx.fill();

          if (framesToSum.current === 0 && spin) {
            const angleOffset =
              frame.current - Math.floor(frame.current / maxAngle) * maxAngle;
            const firstStartAngle = startAngle - frame.current;

            let finalArcStart = angleOffset + firstStartAngle;
            while (finalArcStart > maxAngle) {
              finalArcStart -= maxAngle;
            }
            const finalArcEnd = finalArcStart + (optionAngle - startAngle);
            if (
              finalArcStart < (3 / 4) * endAngle &&
              finalArcEnd > (3 / 4) * endAngle
            ) {
              if (!earlyStop.current) {
                setWinnerIndex(i);
              }
              setSpin(false);
            }
          }

          const [textAngle, textStart, adaptedFontSizeNumber] = adaptWheelTitle(
            activeOptions[i].title,
            startAngle,
            optionAngle,
            radius
          );
          ctx.font = `${adaptedFontSizeNumber}px Arial`;

          ctx.fillStyle = textColor(ctx.fillStyle);
          ctx.translate(centerX, centerY);
          ctx.rotate(textAngle);
          ctx.fillText(activeOptions[i].title, textStart, 0);
          ctx.rotate(-textAngle);
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          startAngle = optionAngle;
        }

        drawSpinButton(ctx, centerX, centerY, (4 / 36) * radius);

        if (spin && framesToSum.current !== 0) {
          frame.current += framesToSum.current;
          requestAnimationFrame(drawWheel);
        }
      }
    }
  }, [activeOptions, spin, framesToSum, colors]);

  function stopWheelEarly() {
    earlyStop.current = true;
    spinningSong.current.stop();
    framesToSum.current = 0;
    timeoutIds.current.forEach((id) => {
      clearTimeout(id);
    });
  }

  const removeWheelOption = (index: number) => {
    if (!optionsContext) return;
    const downsizedOptions = optionsContext.wheelOptions.filter(
      (_, i) => i !== index
    );
    optionsContext.setWheelOptions(downsizedOptions);
    setWinnerIndex(null);
  };

  useEffect(() => {
    if (spin) {
      earlyStop.current = false;
      wheelSlowDown();
    }
    drawWheel();
  }, [activeOptions, spin, colors]);

  useEffect(() => {
    if (spin) {
      stopWheelEarly();
    }
  }, [activeOptions, colors]);

  useEffect(() => {
    addSpinButtonListener();
  }, []);

  return (
    <>
      <canvas ref={canvasRef} width={canvasSize} height={canvasSize} />
      {winnerIndex !== null && (
        <section className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="px-44 py-20 whitespace-nowrap flex flex-col items-center justify-center rounded-lg bg-gray-800 shadow-lg shadow-gray-900">
            <span className="h-3/4 flex items-center justify-center text-7xl text-white font-extrabold">
              {activeOptions[winnerIndex].title}
            </span>
          </div>
          <div className="flex items-center justify-center mt-5 gap-3">
            <button
              type="button"
              className="bg-yellow-400 px-16 h-14 ring-yellow-500 hover:ring-1 p-2 rounded-lg font-medium text-xl hover:bg-yellow-500 transition-colors"
              onClick={() => setWinnerIndex(null)}
            >
              Close
            </button>
            <button
              type="button"
              className="bg-red-500 px-16 h-14 ring-red-600 hover:ring-1 p-2 rounded-lg font-medium text-sm hover:bg-red-600 transition-colors"
              onClick={() => removeWheelOption(winnerIndex)}
            >
              Remove Winner
            </button>
          </div>
        </section>
      )}
    </>
  );
}
