import React from "react";
import { GearProps } from "./Gear";

export const defaultNewGear: GearProps = {
  teeth: 20,
  parentOffset: 27,
};

export const defaultGears: GearProps[] = [
  {
    teeth: 28,
    parentOffset: 0,
  },
  {
    teeth: 5,
    parentOffset: 40,
  },
  {
    teeth: 18,
    parentOffset: 120,
  },
  {
    teeth: 35,
    parentOffset: 120,
  },
  {
    teeth: 8,
    parentOffset: 45,
    fixed: true,
  },
  {
    teeth: 22,
    parentOffset: 10,
  },
  {
    teeth: 19,
    parentOffset: -40,
  },
  {
    teeth: 11,
    parentOffset: -50,
  },
  {
    teeth: 29,
    parentOffset: 120,
    fixed: true,
  },
  {
    teeth: 24,
    parentOffset: -90,
  },
];
