import { degrees_to_radians, iang } from "./utils";
import { firstGearOrigin } from "../../App";
import { GearProps } from "./Gearsets";
import "./Gear.scss";

// Calculate all gears
export function calculateGears(
  gears: GearProps[],
  globalRpm: number,
  globalHertz: number,
  isPendulum: boolean
) {
  let newGears: GearProps[] = [];

  for (let i = 0; i < gears.length; i++) {
    const gear = calculateGear(
      i,
      gears,
      gears[i],
      globalRpm,
      globalHertz,
      isPendulum
    );

    newGears.push(gear);
  }

  console.log(gears);
}

// Calculate single gear
export function calculateGear(
  index: number,
  gears: GearProps[],
  gear: GearProps,
  globalRpm: number,
  globalHertz: number,
  isPendulum: boolean
) {
  const isFirstGear = index === 0;
  const isEscapementGear = isPendulum && isFirstGear;
  if (isEscapementGear) gear.teeth = 30;

  // Parent gear
  if (gear.parent === undefined) {
    if (index === 0) {
      gear.parent = undefined;
    } else {
      gear.parent = index - 1;
    }
  } else if (gear.parent === index) {
    gear.parent = index - 1;
  }

  const parentGear = gears[gear.parent ?? 0];

  // Fixed
  if (isPendulum && index === 1) gear.fixed = true;

  // Shape parameters
  const toothSize = 28;
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
      gearPosition.x += r * Math.sin(degrees_to_radians(gear.orientation!));
      gearPosition.y += r * Math.cos(degrees_to_radians(gear.orientation!));
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
  if (isPendulum) {
    gear.rpm = globalHertz * totalRatio * 2;
  } else {
    gear.rpm = globalRpm * totalRatio;
  }

  // Rotation offset
  let rotateBy = 0;

  if (isFirstGear) {
    rotateBy = gear.orientation;
  } else if (gear.fixed) {
    rotateBy = parentGear.rotationOffset!;
  } else {
    rotateBy =
      180 -
      (parentGear.rotationOffset! + gear.orientation) * ratio -
      gear.orientation +
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
