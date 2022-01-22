import clsx from "clsx";
import React, { useState, useEffect, useMemo } from "react";
import { DrawGear } from "./components/Gear/DrawGear";
import { calculateGears } from "./components/Gear/Gear";
import { defaultGears } from "./components/Gear/defaultGears";
import { Menu } from "./components/Menu/Menu";

function App() {
  const [gears, setGears] = useState<any[]>([]);
  const [globalRpm, setGlobalRpm] = React.useState(5);
  const [isPaused, setIsPaused] = React.useState(false);
  const [selectedGear, setSelectedGear] = useState(0);

  useEffect(() => {
    setGears(defaultGears);
  }, []);

  const handleGearClick = (index: number) => {
    if (selectedGear === index) {
      if (
        Object.entries(gears[index].positionOffset).toString() ===
        Object.entries(gears[index - 1].positionOffset).toString()
      ) {
        setSelectedGear(index - 1);
      } else if (
        Object.entries(gears[index].positionOffset).toString() ===
        Object.entries(gears[index + 1].positionOffset).toString()
      ) {
        setSelectedGear(index + 1);
      }
    } else {
      setSelectedGear(index);
    }
  };

  const DrawGears = (globalRpm: number) => {
    calculateGears(gears, globalRpm);

    return gears.map((gear, index) => {
      const isSelected = index === selectedGear;
      return (
        <span
          key={index}
          className={clsx(
            `gear-wrap gear-wrap-${index}`,
            isSelected && "gear-wrap--selected"
          )}
          style={{
            left: `${gear.positionOffset.x}px`,
            top: `${gear.positionOffset.y}px`,
            transform: `translateX(-50%) translateY(-50%) rotate(${gear.rotationOffset}deg)`,
          }}
          onClick={() => {
            handleGearClick(index);
          }}
        >
          {DrawGear(gear, index, isSelected)}
        </span>
      );
    });
  };

  const memoedGears = useMemo(
    () => DrawGears(globalRpm),
    [gears, globalRpm, selectedGear]
  );

  return (
    <div className={clsx("canvas", isPaused && "canvas--paused")}>
      {memoedGears}

      <Menu
        gears={gears}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        globalRpm={globalRpm}
        setGlobalRpm={setGlobalRpm}
        setGears={setGears}
        selectedGear={selectedGear}
        setSelectedGear={setSelectedGear}
      />
    </div>
  );
}

export default App;
