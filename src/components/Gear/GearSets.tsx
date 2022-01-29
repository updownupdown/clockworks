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
  hands?: HandsProps;
  settings?: SettingsProps;
}

export const newGearSettings: GearProps = {
  teeth: 20,
  orientation: 0,
};

export const gearsetNames = {
  Demo: "Demo",
  Forks: "Forking gears",
  AccurateClock: "Accurate clock",
} as const;

export const defaultGearsetName = gearsetNames.Demo;

export const gearSets: GearSetProps[] = [
  {
    name: gearsetNames.Demo,
    hands: {
      hours: undefined,
      minutes: 7,
      seconds: 0,
    },
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
    hands: {
      hours: 12,
      minutes: 6,
      seconds: 1,
    },
    settings: {
      tolerance: 0,
      globalRpm: 1,
      globalHertz: 0.5,
      isPaused: false,
      isPendulum: false,
      selectedGear: undefined,
    },
    gears: [
      {
        teeth: 30,
        orientation: 0,
      },
      {
        teeth: 10,
        orientation: 0,
        fixed: true,
      },
      {
        teeth: 33,
        orientation: 120,
      },
      {
        teeth: 10,
        orientation: 120,
        fixed: true,
      },
      {
        teeth: 50,
        orientation: 30,
      },
      {
        teeth: 11,
        orientation: 0,
        fixed: true,
      },
      {
        teeth: 40,
        orientation: 0,
      },
      {
        teeth: 8,
        orientation: -90,
      },
      {
        teeth: 39,
        orientation: -75,
      },
      {
        teeth: 6,
        orientation: 0,
        fixed: true,
      },
      {
        teeth: 37,
        orientation: -130,
      },
      {
        teeth: 6,
        orientation: 90,
        fixed: true,
      },
      {
        teeth: 12,
        orientation: 90,
      },
    ],
  },
  {
    name: gearsetNames.Forks,
    hands: {
      hours: 6,
      minutes: 9,
      seconds: 0,
    },
    gears: [
      {
        teeth: 20,
        orientation: 0,
      },
      {
        teeth: 10,
        orientation: 0,
      },
      {
        teeth: 8,
        orientation: 0,
      },
      {
        teeth: 30,
        orientation: 0,
      },
      {
        teeth: 20,
        orientation: 90,
        parent: 3,
      },
      {
        teeth: 10,
        orientation: 0,
      },
      {
        teeth: 10,
        orientation: 0,
      },
      {
        teeth: 20,
        orientation: -90,
        parent: 3,
      },
      {
        teeth: 10,
        orientation: 0,
      },
      {
        teeth: 10,
        orientation: 0,
      },
    ],
  },
];

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
