import clsx from "clsx";
import React, { useState, useEffect, useMemo } from "react";
import {
  GearSvg,
  GearProps,
  degrees_to_radians,
  iang,
  defaultGears,
} from "./utils/gearGenerator";

function App() {
  const [origin, setOrigin] = useState({ x: 450, y: 450 });
  const [gears, setGears] = useState<any[]>([]);

  function addGearDimensions(
    index: number,
    gear: GearProps,
    prevGear: GearProps | undefined
  ) {
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

    let offsetBy = { x: 0, y: 0 };
    let rotateBy = 0;
    let ratio = 1;
    let totalRatio = 1;

    if (prevGear === undefined) {
      rotateBy = gear.angleOffset;
      rotateBy = rotateBy % 360;
      gear.rotationOffset = rotateBy;
      gear.clockwise = true;
    } else {
      // center/origin offset
      if (gear.fixed) {
        rotateBy = prevGear.rotationOffset!;
        gear.clockwise = prevGear.clockwise;
      } else {
        const r = gear.p + prevGear.p!;
        offsetBy.x = r * Math.sin(degrees_to_radians(gear.angleOffset!));
        offsetBy.y = r * Math.cos(degrees_to_radians(gear.angleOffset!));

        ratio = prevGear.teeth / gear.teeth;

        rotateBy =
          180 -
          (prevGear.rotationOffset! + gear.angleOffset) * ratio -
          gear.angleOffset; // correct for first

        // rotate gear by one tooth
        rotateBy += 360 / gear.teeth / 2;

        rotateBy = rotateBy;
        gear.clockwise = !prevGear.clockwise;
      }

      totalRatio = ratio * prevGear.totalRatio!;
      // if (gear.fixed) totalRatio = totalRatio * -1;
    }

    // set ratios
    gear.ratio = ratio;
    gear.totalRatio = totalRatio;

    // set position
    gear.centerOffset = offsetBy;

    // set rotation
    gear.rotationOffset = rotateBy;

    // set RPM
    gear.rpm = rpm * totalRatio;

    return gear;
  }

  function calculateGears(theGears: GearProps[]) {
    let newGears: GearProps[] = [];

    for (let i = 0; i < theGears.length; i++) {
      const gear = addGearDimensions(i, theGears[i], newGears[i - 1]);

      newGears.push(gear);
    }
  }

  useEffect(() => {
    setGears(defaultGears);
  }, []);

  function addGear(gear: GearProps) {
    setGears([...gears, gear]);
  }

  function removeGear(gear: number) {
    const newGears = gears.filter((element, index) => index !== gear);
    setGears(newGears);
  }

  const DrawGears = (animate: number, rpm: number) => {
    calculateGears(gears);

    let tempOrigin = origin;

    return gears.map((gear, index) => {
      let newOrigin = {
        x: tempOrigin.x + gear.centerOffset.x,
        y: tempOrigin.y + gear.centerOffset.y,
      };

      if (index !== 0) {
        tempOrigin = newOrigin;
      }

      return (
        <span
          key={index}
          className={`gear-wrap gear-wrap-${index}`}
          style={{
            left: `${newOrigin.x}px`,
            top: `${newOrigin.y}px`,
            /*transform: `translateX(-50%) translateY(-50%) rotate(${
              (gear.rotationOffset +
                animate * gear.totalRatio * (index % 2 ? 1 : -1)) %
                360 ?? 0
            }deg)`,*/
            transform: `translateX(-50%) translateY(-50%) rotate(${gear.rotationOffset}deg)`,
          }}
        >
          {GearSvg(gear, index)}
        </span>
      );
    });
  };

  const [rpm, setRpm] = React.useState(5);

  const [count, setCount] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const memoedGears = useMemo(() => DrawGears(count, rpm), [gears, rpm]);

  const handleTeethChange = (index: number, value: number) => {
    const newGears = [...gears];
    newGears[index].teeth = value;
    setGears(newGears);
  };

  const handleOffsetChange = (index: number, value: number) => {
    const newGears = [...gears];
    newGears[index].angleOffset = value;
    setGears(newGears);
  };

  function handleFixChange(index: number, fixed: boolean) {
    const newGears = [...gears];
    newGears[index].fixed = !fixed;
    setGears(newGears);
  }

  const DrawSliders = () => {
    return gears.map((gear, index) => {
      return (
        <div key={index} className="menu__gear">
          <div className="menu__gear__header">
            <span>Gear {index + 1}</span>
            {index > 0 && (
              <button
                onClick={() => handleFixChange(index, gear.fixed)}
                className={clsx("btn-fixed", gear.fixed && "btn-fixed--fixed")}
              >
                Fixed
              </button>
            )}
            <button onClick={() => removeGear(index)}>Rem</button>
          </div>

          <input
            className="slider"
            type="range"
            min="4"
            max="50"
            step="1"
            value={gears[index].teeth}
            onChange={(e) => handleTeethChange(index, Number(e.target.value))}
          />

          <input
            className="slider"
            type="range"
            min="-180"
            max="180"
            step="1"
            value={gears[index].angleOffset}
            onChange={(e) => handleOffsetChange(index, Number(e.target.value))}
            disabled={gear.fixed}
          />
        </div>
      );
    });
  };

  return (
    <div className={clsx("canvas", isPaused && "canvas--paused")}>
      {memoedGears}

      <div className="menu">
        <input
          type="range"
          min="1"
          max="20"
          step="1"
          value={rpm}
          onChange={(e) => {
            setRpm(Number(e.target.value));
          }}
        />
        <button className="button" onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? "Play" : "Pause"}
        </button>

        {DrawSliders()}

        <button
          className="button"
          onClick={() =>
            addGear({
              parent: 1,
              teeth: 10,
              angleOffset: 0,
            })
          }
        >
          Add Gear
        </button>
      </div>
    </div>
  );
}

export default App;
