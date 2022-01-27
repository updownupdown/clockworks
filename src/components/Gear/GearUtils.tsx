import React from "react";
import { GearProps, SettingsProps } from "./Gearsets";

export function getGearWrapStyles(
  currentGear: GearProps,
  pendulumIncrement: number,
  settings: SettingsProps
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
    left: `${currentGear.positionOffset.x}px`,
    top: `${currentGear.positionOffset.y}px`,
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
