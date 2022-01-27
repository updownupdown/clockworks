import React from "react";
import {
  defaultHandsSettings,
  defaultSettings,
  GearProps,
  SettingsProps,
} from "../Gear/Gearsets";
import { HandsProps } from "../Gear/Gearsets";

interface ContextProps {
  gears: GearProps[];
  setGears: (gears: GearProps[]) => void;
  pendulumIncrement: number;
  hands: HandsProps;
  setHands: (value: HandsProps) => void;
  settings: SettingsProps;
  setSettings: (value: SettingsProps) => void;
}

export const ClockworksContext = React.createContext<ContextProps>({
  gears: [],
  setGears: () => {},
  pendulumIncrement: 0,
  hands: defaultHandsSettings,
  setHands: () => {},
  settings: defaultSettings,
  setSettings: () => {},
});
