import React from "react";
import { GearProps } from "./Gear";

export const defaultNewGear: GearProps = {
  teeth: 20,
  parentOffset: 27,
};

export const defaultGears: GearProps[] = [
  {
    teeth: 40,
    parentOffset: 27,
  },
  {
    teeth: 20,
    parentOffset: 118,
  },
  {
    teeth: 10,
    parentOffset: 10,
    fixed: true,
  },
  {
    teeth: 19,
    parentOffset: 20,
  },
  {
    teeth: 11,
    parentOffset: 20,
  },
  {
    teeth: 29,
    parentOffset: 120,
    fixed: true,
  },
  {
    teeth: 24,
    parentOffset: -20,
  },
];
