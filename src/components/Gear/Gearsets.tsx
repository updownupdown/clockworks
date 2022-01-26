import { HandsProps } from "../Menu/Menu";

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

interface GearSet {
  name: string;
  gearset: GearProps[];
  hands?: HandsProps;
}

export const newGearSettings: GearProps = {
  teeth: 20,
  orientation: 0,
};

export const defaultGearsetName = "Large Set";

export const gearSets: GearSet[] = [
  {
    name: "Small Set",
    gearset: [
      {
        teeth: 30,
        orientation: 0,
      },
      {
        teeth: 10,
        orientation: 45,
      },
      {
        teeth: 20,
        orientation: 0,
        fixed: true,
      },
    ],
  },
  {
    name: "Medium Set",
    hands: {
      hours: undefined,
      minutes: 5,
      seconds: 0,
    },
    gearset: [
      {
        teeth: 30,
        orientation: 0,
      },
      {
        teeth: 10,
        orientation: 0,
      },
      {
        teeth: 10,
        orientation: 45,
      },
      {
        teeth: 20,
        orientation: 0,
        fixed: true,
      },
      {
        teeth: 30,
        orientation: -70,
      },
      {
        teeth: 20,
        orientation: 20,
      },
    ],
  },
  {
    name: "Large Set",
    hands: {
      hours: 12,
      minutes: 6,
      seconds: 1,
    },
    gearset: [
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
        teeth: 40,
        orientation: 120,
      },
      {
        teeth: 10,
        orientation: 120,
        fixed: true,
      },
      {
        teeth: 40,
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
        teeth: 40,
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
];

export const defaultHandsSettings = {
  hours: undefined,
  minutes: undefined,
  seconds: undefined,
};

export function getGearset(gearsetName: string) {
  const set = gearSets.find(({ name }) => name === gearsetName);

  return set === undefined ? [] : set.gearset;
}

export function getHandsSettings(gearsetName: string) {
  const handsSettings = gearSets.find(({ name }) => name === gearsetName);

  return handsSettings === undefined || handsSettings.hands === undefined
    ? defaultHandsSettings
    : handsSettings.hands;
}
