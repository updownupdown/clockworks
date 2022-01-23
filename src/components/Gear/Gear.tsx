import { degrees_to_radians, iang } from "./utils";
import { firstGearOrigin } from "../../App";
import "./Gear.scss";

export interface GearProps {
  /** parent gear **/
  parent?: number;
  /** number of teeth **/
  teeth: number;
  /** angle offset relative to parent gear **/
  parentOffset: number;
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

// Calculate all gears
export function calculateGears(
  theGears: GearProps[],
  globalRpm: number,
  globalHertz: number,
  isSmooth: boolean
) {
  let newGears: GearProps[] = [];

  for (let i = 0; i < theGears.length; i++) {
    const gear = calculateGear(
      i,
      theGears[i],
      newGears[i - 1],
      globalRpm,
      globalHertz,
      isSmooth,
      theGears
    );

    newGears.push(gear);
  }
}

// Calculate single gear
export function calculateGear(
  index: number,
  gear: GearProps,
  prevGear: GearProps | undefined,
  globalRpm: number,
  globalHertz: number,
  isSmooth: boolean,
  gears: GearProps[]
) {
  const isFirstGear = prevGear === undefined;
  const isEscapementGear = !isSmooth && index === 0;
  if (isEscapementGear) gear.teeth = 30;

  // Parent gear
  if (gear.parent === undefined) gear.parent = index === 0 ? 0 : index - 1;

  const parentGear = gears[gear.parent];

  // Fixed
  if (!isSmooth && index === 1) gear.fixed = true;

  // Shape parameters
  const toothSize = 40;
  const pressure_angle = 25;
  const backlash = 6;
  const clearance = 4;

  gear.p = (toothSize * gear.teeth) / Math.PI / 2;
  gear.c = gear.p + toothSize / Math.PI - clearance;
  gear.b = gear.p * Math.cos(degrees_to_radians(pressure_angle));
  gear.r = gear.p - (gear.c - gear.p) - clearance;
  gear.t = toothSize / 2 - backlash / 2;
  gear.k = -iang(gear.b, gear.p) - gear.t / 2 / gear.p;

  // Rotation direction
  if (isFirstGear) {
    gear.clockwise = true;
  } else {
    gear.clockwise = gear.fixed ? parentGear.clockwise : !parentGear.clockwise;
  }

  // Position offset
  if (isFirstGear) {
    gear.positionOffset = firstGearOrigin;
  } else {
    const r = gear.p + parentGear.p!;

    let gearPosition = {
      x: parentGear.positionOffset!.x,
      y: parentGear.positionOffset!.y,
    };

    if (!gear.fixed) {
      gearPosition.x += r * Math.sin(degrees_to_radians(gear.parentOffset!));
      gearPosition.y += r * Math.cos(degrees_to_radians(gear.parentOffset!));
    }

    gear.positionOffset = {
      x: gearPosition.x,
      y: gearPosition.y,
    };
  }

  // Ratios
  const ratio = isFirstGear || gear.fixed ? 1 : parentGear.teeth / gear.teeth;
  const totalRatio = isFirstGear ? 1 : ratio * parentGear.totalRatio!;
  gear.ratio = ratio;
  gear.totalRatio = totalRatio;

  // RPM

  // RPM
  if (isSmooth) {
    gear.rpm = globalRpm * totalRatio;
  } else {
    gear.rpm = globalHertz * totalRatio * 2;
  }

  // Rotation offset
  let rotateBy = 0;

  if (isFirstGear) {
    rotateBy = gear.parentOffset;
  } else if (gear.fixed) {
    rotateBy = parentGear.rotationOffset!;
  } else {
    rotateBy =
      180 -
      (parentGear.rotationOffset! + gear.parentOffset) * ratio -
      gear.parentOffset +
      360 / gear.teeth / 2;
  }
  gear.rotationOffset = rotateBy % 360;

  // Pendulum increment
  let pendulumAngleIncrement = 0;
  if (isFirstGear) {
    pendulumAngleIncrement = 360 / gear.teeth;
  } else if (gear.fixed) {
    pendulumAngleIncrement = parentGear!.pendulumAngleIncrement!;
  } else {
    const prevGearTeethTurn =
      (parentGear!.pendulumAngleIncrement! * parentGear.teeth) / 360;
    pendulumAngleIncrement = (360 / gear.teeth) * Math.abs(prevGearTeethTurn);

    if (!gear.clockwise) {
      pendulumAngleIncrement = pendulumAngleIncrement * -1;
    }
  }
  gear.pendulumAngleIncrement = pendulumAngleIncrement;

  return gear;
}
