import React from "react";
import {
  defaultHandsSettings,
  defaultSettings,
  GearProps,
  SettingsProps,
} from "../Gear/GearSets";
import { HandsProps } from "../Gear/GearSets";

interface ContextProps {
  gears: GearProps[];
  setGears: (gears: GearProps[]) => void;
  hands: HandsProps;
  setHands: (value: HandsProps) => void;
  settings: SettingsProps;
  setSettings: (value: SettingsProps) => void;
  pendulumIncrement: number;
  setPendulumIncrement: (value: number) => void;
}

export const ClockworksContext = React.createContext<ContextProps>({
  gears: [],
  setGears: () => {},
  hands: defaultHandsSettings,
  setHands: () => {},
  settings: defaultSettings,
  setSettings: () => {},
  pendulumIncrement: 0,
  setPendulumIncrement: () => {},
});
