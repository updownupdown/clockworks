import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DrawGear } from "./components/Gear/DrawGear";
import { calculateGears } from "./components/Gear/Gear";
import { defaultGears } from "./components/Gear/defaultGears";
import Escapement from "./components/Gear/Escapement";
import { Menu } from "./components/Menu/Menu";
import clsx from "clsx";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ZoomIn from "./components/Icons/ZoomIn";
import ZoomOut from "./components/Icons/ZoomOut";
import ZoomReset from "./components/Icons/ZoomReset";
import { HandsProps } from "./components/Menu/Menu";

const canvasWidth = 4000;
const canvasRatio = 0.75;
const canvasHeight = canvasWidth * canvasRatio;

export const firstGearOrigin = { x: canvasWidth / 2, y: canvasHeight / 3 };

function App() {
  const [gears, setGears] = useState<any[]>([]);
  const [globalRpm, setGlobalRpm] = React.useState(1);
  const [globalHertz, setGlobalHertz] = React.useState(0.5);
  const [isPaused, setIsPaused] = React.useState(false);
  const [selectedGear, setSelectedGear] = useState<number | undefined>(
    undefined
  );
  const [isPendulum, setIsPendulum] = useState(false);
  const [pendulumIncrement, setPendulumIncrement] = useState(0);
  const [hands, setHands] = useState<HandsProps>({
    hours: 12,
    minutes: 6,
    seconds: 1,
  });

  useEffect(() => {
    setGears(defaultGears);
  }, []);

  const handleGearClick = useCallback(
    (index: number) => {
      if (selectedGear === index) {
        if (
          gears[index - 1] !== undefined &&
          Object.entries(gears[index].positionOffset).toString() ===
            Object.entries(gears[index - 1].positionOffset).toString()
        ) {
          setSelectedGear(index - 1);
        } else if (
          gears[index + 1] !== undefined &&
          Object.entries(gears[index].positionOffset).toString() ===
            Object.entries(gears[index + 1].positionOffset).toString()
        ) {
          setSelectedGear(index + 1);
        }
      } else {
        setSelectedGear(index);
      }
    },
    [gears, selectedGear]
  );

  const DrawGears = useCallback(
    (globalRpm: number) => {
      calculateGears(gears, globalRpm, globalHertz, isPendulum);

      // Prevent transitions when editing gears in smooth mode
      // Need solution for pendulum mode
      if (!isPendulum) {
        document.body.classList.add("disable-animations");
        setTimeout(() => {
          document.body.classList.remove("disable-animations");
        }, 0);
      }

      return gears.map((gear, index) => {
        const isSelected = index === selectedGear;

        const pendulumAngleIncrement = !isPendulum
          ? 0
          : gear.pendulumAngleIncrement;

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
            {DrawGear(gear, index, isSelected, isPendulum, hands)}
          </span>
        );
      });
    },
    [
      gears,
      globalHertz,
      handleGearClick,
      hands,
      isPendulum,
      pendulumIncrement,
      selectedGear,
    ]
  );

  const [halfStep, setHalfStep] = useState(false);

  useEffect(() => {
    if (isPendulum && !isPaused) {
      const intervalDelay = 1000 / globalHertz / 2;

      const tick = setInterval(() => {
        if (!halfStep) {
          setPendulumIncrement(pendulumIncrement + 1);
        }

        setHalfStep(!halfStep);
      }, intervalDelay);

      return () => {
        clearInterval(tick);
      };
    }
  }, [
    DrawGears,
    isPendulum,
    globalHertz,
    isPaused,
    halfStep,
    pendulumIncrement,
  ]);

  const memoedGears = useMemo(
    () => DrawGears(globalRpm),
    [globalRpm, DrawGears]
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
        initialPositionY={-canvasHeight / 3 + window.innerHeight / 2 - 200}
        limitToBounds={false}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <React.Fragment>
            <div className="canvas-actions">
              <button onClick={() => zoomOut()}>
                <ZoomOut />
              </button>
              <button onClick={() => zoomIn()}>
                <ZoomIn />
              </button>
              <button onClick={() => resetTransform()}>
                <ZoomReset />
              </button>
            </div>

            <TransformComponent>
              <div className="canvas-wrap">
                <div
                  className={clsx(
                    "canvas",
                    isPaused && "canvas--paused",
                    !isPendulum ? "canvas--smooth" : "canvas--pendulum"
                  )}
                  style={{
                    width: `${canvasWidth}px`,
                    height: `${canvasHeight}px`,
                  }}
                >
                  {memoedGears}
                  {isPendulum && DrawPendulum()}
                </div>
              </div>
            </TransformComponent>
          </React.Fragment>
        )}
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
        isPendulum={isPendulum}
        setIsPendulum={setIsPendulum}
        hands={hands}
        setHands={setHands}
      />
    </>
  );
}

export default App;
