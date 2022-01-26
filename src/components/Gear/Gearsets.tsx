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
        teeth: 30,
        orientation: 0,
      },
      {
        teeth: 30,
        orientation: 0,
      },
      {
        teeth: 30,
        orientation: 0,
      },
    ],
  },
  {
    name: "Medium Set",
    gearset: [
      {
        teeth: 30,
        orientation: 0,
      },
      {
        teeth: 30,
        orientation: 0,
      },
      {
        teeth: 30,
        orientation: 0,
      },
      {
        teeth: 30,
        orientation: 0,
      },
      {
        teeth: 30,
        orientation: 0,
      },
    ],
  },
  {
    name: "Large Set",
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

export function getGearset(gearsetName: string) {
  const set = gearSets.find(({ name }) => name === gearsetName);

  return set === undefined ? [] : set.gearset;
}
