import React from "react";
export interface GearProps {
  /** parent gear **/
  parent?: number | undefined;
  /** number of teeth **/
  teeth: number;
  /** angle offset relative to parent gear **/
  orientation: number;
  /** center position **/
  positionOffset?: { x: number; y: number };
  /** rotation position **/
  rotationOffset?: number;
  /** fixed to parent gear **/
  fixed?: boolean;
  /** ratio relative to parent gear **/
  ratio?: number;
  /** ratio relative to first gear **/
  totalRatio?: number;
  /** rotation per minute **/
  rpm?: number;
  /** rotation direction **/
  clockwise?: boolean;
  /** pendulum rotation angle increment **/
  pendulumAngleIncrement?: number;
  /** radius of pitch circle **/
  p?: number;
  /** radius of outer circle **/
  c?: number;
  /** radius of base circle **/
  b?: number;
  /** radius of root circle **/
  r?: number;
  /** tooth thickness at pitch circle **/
  t?: number;
  /** angle where involute meets base circle on side of tooth **/
  k?: number;
}

export interface HandsProps {
  seconds: number | undefined;
  minutes: number | undefined;
  hours: number | undefined;
}

export interface SettingsProps {
  globalRpm: number;
  globalHertz: number;
  isPaused: boolean;
  isPendulum: boolean;
  tolerance: number;
  selectedGear: number | undefined;
}
export interface GearSetProps {
  name: string;
  gears: GearProps[];
  hands: HandsProps;
  settings: SettingsProps;
}

export const newGearSettings: GearProps = {
  teeth: 20,
  orientation: 0,
};

export const gearsetNames = {
  Demo: "Simple Demo",
  AccurateClock: "Accurate clock",
  Forks: "Forking gears",
} as const;

export const defaultGearsetName = gearsetNames.Demo;

export const defaultHandsSettings = {
  hours: undefined,
  minutes: undefined,
  seconds: undefined,
};

export const defaultSettings = {
  globalRpm: 1,
  globalHertz: 0.5,
  isPaused: false,
  tolerance: 10,
  isPendulum: false,
  selectedGear: undefined,
};

export const gearSets: GearSetProps[] = [
  {
    name: gearsetNames.Demo,
    hands: {
      hours: undefined,
      minutes: 7,
      seconds: 0,
    },
    settings: defaultSettings,
    gears: [
      {
        teeth: 30,
        orientation: 0,
      },
      {
        teeth: 16,
        orientation: 45,
      },
      {
        teeth: 62,
        orientation: 45,
      },
      {
        teeth: 8,
        orientation: 0,
        fixed: true,
      },
      {
        teeth: 60,
        orientation: -60,
      },
      {
        teeth: 10,
        orientation: -90,
        fixed: true,
      },
      {
        teeth: 40,
        orientation: -125,
      },
      {
        teeth: 10,
        orientation: 0,
        fixed: true,
      },
    ],
  },
  {
    name: gearsetNames.AccurateClock,
    hands: { hours: 11, minutes: 7, seconds: 1 },
    settings: {
      tolerance: 26,
      globalRpm: 1,
      globalHertz: 0.5,
      isPaused: false,
      isPendulum: false,
      selectedGear: 7,
    },
    gears: [
      { teeth: 30, orientation: 0 },
      { teeth: 10, orientation: 0, fixed: true, parent: 0 },
      { teeth: 33, orientation: 45, parent: 1 },
      { teeth: 10, orientation: 120, fixed: true, parent: 2 },
      { teeth: 50, orientation: 19, parent: 3 },
      { teeth: 11, orientation: 0, fixed: true, parent: 4 },
      { teeth: 11, orientation: -117, parent: 5 },
      { teeth: 39, orientation: -36, parent: 6 },
      { teeth: 6, orientation: 0, fixed: true, parent: 7 },
      { teeth: 37, orientation: -117, parent: 8 },
      { teeth: 6, orientation: 90, fixed: true, parent: 9 },
      { teeth: 12, orientation: -144, parent: 10 },
    ],
  },
  {
    name: gearsetNames.Forks,
    hands: { hours: 5, minutes: 8, seconds: 0 },
    settings: {
      globalRpm: 1,
      globalHertz: 0.5,
      isPaused: false,
      tolerance: 10,
      isPendulum: false,
      selectedGear: 8,
    },
    gears: [
      { teeth: 30, orientation: 0 },
      { teeth: 19, orientation: 0, parent: 0 },
      { teeth: 12, orientation: 0, fixed: true, parent: 1 },
      { teeth: 10, orientation: -85, parent: 1 },
      { teeth: 12, orientation: -60, parent: 3 },
      { teeth: 10, orientation: 0, parent: 4 },
      { teeth: 10, orientation: 85, parent: 1 },
      { teeth: 12, orientation: 50, parent: 6 },
      { teeth: 10, orientation: 0, parent: 7 },
      { teeth: 19, orientation: 0, parent: 2 },
      { teeth: 10, orientation: -35, parent: 9 },
      { teeth: 10, orientation: 36, parent: 9 },
      { teeth: 14, orientation: 0, parent: 11 },
      { teeth: 14, orientation: 0, parent: 10 },
    ],
  },
];

export function getGearsetGears(gearsetName: string) {
  const set = gearSets.find(({ name }) => name === gearsetName);

  return set === undefined ? [] : set.gears;
}

export function getGearsetHands(gearsetName: string) {
  const handsSettings = gearSets.find(({ name }) => name === gearsetName);

  return handsSettings === undefined || handsSettings.hands === undefined
    ? defaultHandsSettings
    : handsSettings.hands;
}

export function getGearset(gearsetName: string) {
  return gearSets.find(({ name }) => name === gearsetName);
}
