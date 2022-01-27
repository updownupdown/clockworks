import React from "react";
import { defaultHandsSettings, GearProps } from "../Gear/Gearsets";
import { HandsProps } from "../Gear/Gearsets";

interface ContextProps {
  gears: GearProps[];
  setGears: (gears: GearProps[]) => void;
  selectedGear: number | undefined;
  setSelectedGear: (value: number | undefined) => void;
  globalRpm: number;
  setGlobalRpm: (value: number) => void;
  globalHertz: number;
  setGlobalHertz: (value: number) => void;
  isPaused: boolean;
  setIsPaused: (value: boolean) => void;
  isPendulum: boolean;
  pendulumIncrement: number;
  setIsPendulum: (value: boolean) => void;
  hands: HandsProps;
  setHands: (value: HandsProps) => void;
  tolerance: number;
  setTolerance: (value: number) => void;
}

export const ClockworksContext = React.createContext<ContextProps>({
  gears: [],
  setGears: () => {},
  selectedGear: undefined,
  setSelectedGear: () => {},
  globalRpm: 0,
  setGlobalRpm: () => {},
  globalHertz: 0,
  setGlobalHertz: () => {},
  isPaused: false,
  setIsPaused: () => {},
  isPendulum: false,
  setIsPendulum: () => {},
  pendulumIncrement: 0,
  hands: defaultHandsSettings,
  setHands: () => {},
  tolerance: 0,
  setTolerance: () => {},
});
