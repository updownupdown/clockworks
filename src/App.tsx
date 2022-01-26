import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DrawGear } from "./components/Gear/DrawGear";
import { calculateGears } from "./components/Gear/Gear";
import {
  defaultGearsetName,
  defaultHandsSettings,
  getGearset,
  getHandsSettings,
} from "./components/Gear/Gearsets";
import Escapement from "./components/Gear/Escapement";
import { Menu } from "./components/Menu/Menu";
import clsx from "clsx";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ZoomIn from "./components/Icons/ZoomIn";
import ZoomOut from "./components/Icons/ZoomOut";
import ZoomReset from "./components/Icons/ZoomReset";
import { HandsProps } from "./components/Menu/Menu";
import HandHours from "./components/Hands/HandHours";
import HandMinutes from "./components/Hands/HandMinutes";
import HandSeconds from "./components/Hands/HandSeconds";
import { getGearWrapStyles, getGearStyles } from "./components/Gear/GearUtils";

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
  const [hands, setHands] = useState<HandsProps>(defaultHandsSettings);

  function loadSettings(gearsetName: string) {
    setGears(getGearset(gearsetName));
    setHands(getHandsSettings(gearsetName));
  }

  useEffect(() => {
    loadSettings(defaultGearsetName);
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

        return (
          <span
            key={index}
            className={clsx(
              `gear-wrap gear-wrap-${index}`,
              isSelected && "gear-wrap--selected"
            )}
            style={getGearWrapStyles(
              gear,
              pendulumIncrement,
              isPendulum,
              globalHertz
            )}
            onClick={() => {
              handleGearClick(index);
            }}
          >
            {DrawGear(gear, index, isSelected, isPendulum)}
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

  const DrawHands = () => {
    let handsOutput: HTMLElement | any = [];

    function drawHand(index: number | undefined, hand: React.ReactNode) {
      if (index === undefined || gears[index] === undefined) return;

      handsOutput.push(
        <span
          className="clock-hand"
          style={getGearWrapStyles(
            gears[index],
            pendulumIncrement,
            isPendulum,
            globalHertz
          )}
        >
          <div
            className="hand"
            style={getGearStyles(gears[index].rpm, gears[index].clockwise)}
          >
            {hand}
          </div>
        </span>
      );
    }

    drawHand(hands.hours, <HandHours />);
    drawHand(hands.minutes, <HandMinutes />);
    drawHand(hands.seconds, <HandSeconds />);

    return handsOutput.map((hand: HTMLElement, index: number) => (
      <span key={index}>{hand}</span>
    ));
  };

  function resetHands() {
    setHands(defaultHandsSettings);
  }

  const memoedHands = useMemo(() => DrawHands(), [DrawGears, hands]);

  return (
    <div className="layout">
      <div className="layout__menu">
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
          resetHands={resetHands}
          loadSettings={loadSettings}
        />
      </div>

      <div className="layout__canvas">
        <TransformWrapper
          initialScale={1}
          minScale={0.2}
          initialPositionX={-canvasWidth / 2 + window.innerWidth / 2}
          initialPositionY={-canvasHeight / 3 + window.innerHeight / 2 - 200}
          limitToBounds={false}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
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
                    {memoedHands}
                    {isPendulum && DrawPendulum()}
                  </div>
                </div>
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
}

export default App;
