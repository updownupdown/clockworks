import React from "react";
import { GearProps } from "./Gear";

export function getGearWrapStyles(
  currentGear: GearProps,
  pendulumIncrement: number,
  isPendulum: boolean,
  globalHertz: number
) {
  if (
    currentGear.positionOffset === undefined ||
    currentGear.rotationOffset === undefined ||
    currentGear.pendulumAngleIncrement === undefined
  )
    return {};

  const pendulumAngleIncrement = !isPendulum
    ? 0
    : currentGear.pendulumAngleIncrement;

  return {
    left: `${currentGear.positionOffset.x}px`,
    top: `${currentGear.positionOffset.y}px`,
    transform: `translateX(-50%) translateY(-50%) rotate(${
      currentGear.rotationOffset + pendulumAngleIncrement * pendulumIncrement
    }deg)`,
    transitionDuration: `${1 / globalHertz}s`,
  };
}

export function getGearStyles(
  rpm: number | undefined,
  clockwise: boolean | undefined
) {
  if (rpm === undefined || clockwise === undefined) return;

  return {
    animationDuration: `${Math.abs(60 / rpm)}s`,
    animationDirection: clockwise ? "normal" : "reverse",
  };
}
