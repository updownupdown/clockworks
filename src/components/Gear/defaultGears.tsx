import { GearProps } from "./Gear";

export const defaultNewGear: GearProps = {
  teeth: 20,
  parentOffset: 27,
};

export const defaultGears: GearProps[] = [
  {
    teeth: 30,
    parentOffset: 0,
  },
  {
    teeth: 10,
    parentOffset: 0,
    fixed: true,
  },
  {
    teeth: 40,
    parentOffset: 120,
  },
  {
    teeth: 10,
    parentOffset: 120,
    fixed: true,
  },
  {
    teeth: 40,
    parentOffset: 30,
  },
  {
    teeth: 11,
    parentOffset: 0,
    fixed: true,
  },
  {
    teeth: 40,
    parentOffset: 0,
  },
  {
    teeth: 8,
    parentOffset: -90,
  },
  {
    teeth: 40,
    parentOffset: -75,
  },
  {
    teeth: 6,
    parentOffset: 0,
    fixed: true,
  },
  {
    teeth: 37,
    parentOffset: -130,
  },
  {
    teeth: 6,
    parentOffset: 90,
    fixed: true,
  },
  {
    teeth: 12,
    parentOffset: 90,
  },
];
