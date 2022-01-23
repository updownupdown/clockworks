import React from "react";
import { GearProps } from "./Gear";

export const defaultNewGear: GearProps = {
  teeth: 20,
  parentOffset: 27,
};

export const defaultGears: GearProps[] = [
  {
    teeth: 20,
    parentOffset: 0,
  },
  {
    teeth: 10,
    parentOffset: 0,
  },
  {
    teeth: 10,
    parentOffset: 0,
  },
  {
    teeth: 10,
    parentOffset: 90,
    parent: 2,
  },
  {
    teeth: 10,
    parentOffset: 90,
  },
  {
    teeth: 20,
    parentOffset: 90,
  },
  {
    teeth: 10,
    parentOffset: 90,
    fixed: true,
  },
  {
    teeth: 12,
    parentOffset: 90,
  },
  {
    teeth: 20,
    parentOffset: -90,
    parent: 2,
  },
  {
    teeth: 10,
    parentOffset: -90,
    fixed: true,
  },
  {
    teeth: 10,
    parentOffset: -40,
  },
  {
    teeth: 10,
    parentOffset: -90,
  },
  {
    teeth: 20,
    parentOffset: 20,
    parent: 2,
  },
  {
    teeth: 10,
    fixed: true,
    parentOffset: 0,
  },
  {
    teeth: 10,
    parentOffset: 0,
  },
];
