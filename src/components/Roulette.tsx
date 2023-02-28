import React, { useEffect, useMemo, useRef } from "react";
import { RoulleteOption } from "../model/RoulleteOption";

interface RouletteProps {
  options: RoulleteOption[];
}

export function Roulette({ options }: RouletteProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const optionsChancesSum = useMemo(() => {
    return options.reduce((prev, cur) => {
      return prev += cur.percentage;
    }, 0);
  }, [options]);

  useEffect(() => {
    if (canvasRef.current) {
      console.log(optionsChancesSum);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 200;
      let startAngle = 0;
      let endAngle = 2 * Math.PI;

      if (ctx) {
        options.forEach((option, i) => {
          console.log(i);
          console.log(startAngle);
          const optionAngle = (option.percentage / optionsChancesSum) * endAngle;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          if (i % 2 === 0) {
            ctx.fillStyle = "#FFFFFF";
          } else {
            ctx.fillStyle = "#000000";
          }
          ctx.arc(centerX, centerY, radius, startAngle, optionAngle);
          ctx.closePath();
          ctx.fill();
          startAngle = optionAngle;
        });

        ctx.fillStyle = "#000000";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "none";

        const angleInDegrees = 90;
        const angleInRadians = angleInDegrees * Math.PI / 180;
        ctx.rotate(angleInRadians);

        // Calculate the position of the text based on the angle and radius
        const x = radius * Math.cos(endAngle - angleInRadians / 2) + centerX;
        const y = radius * Math.sin(endAngle - angleInRadians / 2) + centerY;

        // centerX + x, -centerY + 90
        ctx.fillText("Hello, World!", centerX + x, -centerY);
        ctx.rotate(-angleInRadians);
      }
    }
  }, [optionsChancesSum]);

  return (
    <canvas ref={canvasRef} width={400} height={400} />
  )
}