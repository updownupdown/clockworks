import clsx from "clsx";
import React, { useState, useEffect, useLayoutEffect } from "react";
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
    } else {
      // center/origin offset
      if (!gear.fixed) {
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
      } else {
        rotateBy = prevGear.rotationOffset!;
      }

      totalRatio = ratio * prevGear.totalRatio!;
      if (gear.fixed) totalRatio = totalRatio * -1;
    }

    // set ratios
    gear.ratio = ratio;
    gear.totalRatio = totalRatio;

    // set position
    gear.centerOffset = offsetBy;

    // set rotation
    gear.rotationOffset = rotateBy;

    return gear;
  }

  function calculateGears(theGears: GearProps[]) {
    // console.log("calc gears");
    // console.log(theGears);
    let newGears: GearProps[] = [];

    for (let i = 0; i < theGears.length; i++) {
      const gear = addGearDimensions(i, theGears[i], newGears[i - 1]);

      newGears.push(gear);
    }

    setGears(newGears);
  }

  useEffect(() => {
    calculateGears(defaultGears);
  }, []);

  function addGear(gear: GearProps) {
    calculateGears([...gears, gear]);
  }

  function removeGear(gear: number) {
    const newGears = gears.filter((element, index) => index !== gear);
    calculateGears(newGears);
  }

  const DrawGears = (animate: number) => {
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
          className={`gear gear-${index}`}
          style={{
            left: `${newOrigin.x}px`,
            top: `${newOrigin.y}px`,
            transform: `translateX(-50%) translateY(-50%) rotate(${
              (gear.rotationOffset +
                animate * gear.totalRatio * (index % 2 ? 1 : -1)) %
                360 ?? 0
            }deg)`,
          }}
        >
          {GearSvg(gear, index)}
        </span>
      );
    });
  };

  const handleTeethChange = (index: number, value: number) => {
    const newGears = gears;
    newGears[index].teeth = value;
    calculateGears(newGears);
  };

  const handleOffsetChange = (index: number, value: number) => {
    const newGears = [...gears];
    newGears[index].angleOffset = value;
    calculateGears(newGears);
  };

  function handleFixChange(index: number, fixed: boolean) {
    const newGears = [...gears];
    newGears[index].fixed = !fixed;
    calculateGears(newGears);
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

  const [count, setCount] = React.useState(0);

  const requestRef = React.useRef();
  const previousTimeRef = React.useRef();

  const animate = (time: any) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;

      setCount((prevCount) => prevCount + deltaTime * 0.02);
    }
    previousTimeRef.current = time;
    // @ts-ignore
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // @ts-ignore
    requestRef.current = requestAnimationFrame(animate);
    // @ts-ignore
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once

  return (
    <div className="paper">
      {DrawGears(count)}

      <div className="menu">
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
