import React from "react";
import { GearProps, SettingsProps } from "./GearSets";

export function getGearWrapStyles(
  currentGear: GearProps,
  pendulumIncrement: number,
  settings: SettingsProps,
  isClockface?: boolean
) {
  if (
    currentGear.positionOffset === undefined ||
    currentGear.rotationOffset === undefined ||
    currentGear.pendulumAngleIncrement === undefined
  )
    return {};

  const pendulumAngleIncrement = !settings.isPendulum
    ? 0
    : currentGear.pendulumAngleIncrement;

  return {
    top: isClockface ? "0px" : `${currentGear.positionOffset.y}px`,
    left: isClockface ? "0px" : `${currentGear.positionOffset.x}px`,
    transform: `translateX(-50%) translateY(-50%) rotate(${
      currentGear.rotationOffset + pendulumAngleIncrement * pendulumIncrement
    }deg)`,
    transitionDuration: `${1 / settings.globalHertz}s`,
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
