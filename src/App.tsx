import React, { Component, useState, useEffect, useMemo } from "react";
import { DrawGear } from "./components/Gear/DrawGear";
import { calculateGears } from "./components/Gear/Gear";
import { defaultGears } from "./components/Gear/defaultGears";
import Escapement from "./components/Gear/Escapement";
import { Menu } from "./components/Menu/Menu";
import clsx from "clsx";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const canvasWidth = 4000;
const canvasRatio = 0.75;
const canvasHeight = canvasWidth * canvasRatio;

export const firstGearOrigin = { x: canvasWidth / 2, y: canvasHeight / 2 };

function App() {
  const [gears, setGears] = useState<any[]>([]);
  const [globalRpm, setGlobalRpm] = React.useState(3);
  const [globalHertz, setGlobalHertz] = React.useState(0.5);
  const [isPaused, setIsPaused] = React.useState(false);
  const [selectedGear, setSelectedGear] = useState<number | undefined>(
    undefined
  );
  const [isSmooth, setIsSmooth] = useState(true);
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
    calculateGears(gears, globalRpm, globalHertz, isSmooth);

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
            transitionDuration: `${1 / globalHertz}s`,
          }}
          onClick={() => {
            handleGearClick(index);
          }}
        >
          {DrawGear(gear, index, isSelected, isSmooth)}
        </span>
      );
    });
  };

  const [halfStep, setHalfStep] = useState(false);

  useEffect(() => {
    if (!isSmooth && !isPaused) {
      const intervalDelay = 1000 / globalHertz / 2;

      const tick = setInterval(() => {
        if (!halfStep) {
          setPendulumIncrement(pendulumIncrement + 1);
        } else {
        }

        setHalfStep(!halfStep);
      }, intervalDelay);

      return () => {
        clearInterval(tick);
      };
    }
  }, [DrawGears, isSmooth, globalHertz, isPaused]);

  const memoedGears = useMemo(
    () => DrawGears(globalRpm),
    [gears, globalRpm, selectedGear, pendulumIncrement, isSmooth]
  );

  // Pendulum
  const DrawPendulum = () => {
    if (gears[0] === undefined) return <span />;

    const firstGear = gears[0];
    const rotateTo = (halfStep ? 1 : -1) * 5;

    return (
      <div
        className="pendulum"
        style={{
          left: `${firstGearOrigin.x}px`,
          top: `${firstGearOrigin.y - firstGear.r * 1.7}px`,
          width: `${firstGear.r * 2}px`,
        }}
      >
        <div
          className="pendulum__assembly"
          style={{
            transform: `rotate(${rotateTo}deg)`,
            transitionDuration: `${1 / globalHertz / 2}s`,
            // transitionDelay: `${(1 / globalHertz / 2) * 0.5}s`,
          }}
        >
          <div className="pendulum__assembly__bar" />
          <div className="pendulum__assembly__weight" />
          <Escapement />
        </div>
      </div>
    );
  };

  return (
    <>
      <TransformWrapper
        initialScale={1}
        minScale={0.2}
        initialPositionX={-canvasWidth / 2 + window.innerWidth / 2}
        initialPositionY={-canvasHeight / 2 + window.innerHeight / 2}
        limitToBounds={false}
        panning={{ excluded: ["gear-wrap", "gear"] }}
      >
        <TransformComponent>
          <div
            className={clsx(
              "canvas",
              isPaused && "canvas--paused",
              isSmooth ? "canvas--smooth" : "canvas--pendulum"
            )}
            style={{
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
            }}
          >
            {memoedGears}
            {!isSmooth && DrawPendulum()}
          </div>
        </TransformComponent>
      </TransformWrapper>

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
    </>
  );
}

export default App;
