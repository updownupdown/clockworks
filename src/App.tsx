import clsx from "clsx";
import React, { useState, useEffect, useMemo } from "react";
import { DrawGear } from "./components/Gear/DrawGear";
import { calculateGears } from "./components/Gear/Gear";
import { defaultGears } from "./components/Gear/defaultGears";
import { Menu } from "./components/Menu/Menu";

function App() {
  const [gears, setGears] = useState<any[]>([]);
  const [globalRpm, setGlobalRpm] = React.useState(3);
  const [globalHertz, setGlobalHertz] = React.useState(1);
  const [isPaused, setIsPaused] = React.useState(false);
  const [selectedGear, setSelectedGear] = useState(0);
  const [isSmooth, setIsSmooth] = useState(false);
  const pendulumTime = 1000;
  const [pendulumIncrement, setPendulumIncrement] = useState(0);

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

      const pendulumAngleIncrement = isSmooth ? 0 : gear.pendulumAngleIncrement;

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
            transform: `translateX(-50%) translateY(-50%) rotate(${
              gear.rotationOffset + pendulumAngleIncrement * pendulumIncrement
            }deg)`,
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

  useEffect(() => {
    if (!isSmooth && !isPaused) {
      const tick = setInterval(() => {
        setPendulumIncrement(pendulumIncrement + 1);
      }, 1000 / globalHertz);

      return () => clearInterval(tick);
    }
  }, [DrawGears, isSmooth, globalRpm]);

  const memoedGears = useMemo(
    () => DrawGears(globalRpm),
    [gears, globalRpm, selectedGear, pendulumIncrement]
  );

  return (
    <div
      className={clsx(
        "canvas",
        isPaused && "canvas--paused",
        isSmooth ? "canvas--smooth" : "canvas--pendulum"
      )}
    >
      {memoedGears}

      <Menu
        gears={gears}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        globalRpm={globalRpm}
        setGlobalRpm={setGlobalRpm}
        globalHertz={globalHertz}
        setGlobalHertz={setGlobalHertz}
        setGears={setGears}
        selectedGear={selectedGear}
        setSelectedGear={setSelectedGear}
        isSmooth={isSmooth}
        setIsSmooth={setIsSmooth}
      />
    </div>
  );
}

export default App;
