import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DrawGear } from "./components/Gear/DrawGear";
import { calculateGears } from "./components/Gear/Gear";
import {
  defaultHandsSettings,
  defaultSettings,
  SettingsProps,
} from "./components/Gear/Gearsets";
import Escapement from "./components/Gear/Escapement";
import { Menu } from "./components/Menu/Menu";
import clsx from "clsx";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ZoomIn from "./components/Icons/ZoomIn";
import ZoomOut from "./components/Icons/ZoomOut";
import ZoomReset from "./components/Icons/ZoomReset";
import { HandsProps } from "./components/Gear/Gearsets";
import HandHours from "./components/Hands/HandHours";
import HandMinutes from "./components/Hands/HandMinutes";
import HandSeconds from "./components/Hands/HandSeconds";
import { getGearWrapStyles, getGearStyles } from "./components/Gear/GearUtils";
import { ClockworksContext } from "./components/context/context";

const canvasWidth = 4000;
const canvasRatio = 0.75;
const canvasHeight = canvasWidth * canvasRatio;

export const firstGearOrigin = { x: canvasWidth / 2, y: canvasHeight / 3 };

function App() {
  const [gears, setGears] = useState<any[]>([]);
  const [hands, setHands] = useState<HandsProps>(defaultHandsSettings);
  const [settings, setSettings] = useState<SettingsProps>(defaultSettings);

  const [pendulumIncrement, setPendulumIncrement] = useState(0);
  const [halfStep, setHalfStep] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleGearClick = useCallback(
    (index: number) => {
      if (settings.selectedGear === index) {
        if (
          gears[index - 1] !== undefined &&
          Object.entries(gears[index].positionOffset).toString() ===
            Object.entries(gears[index - 1].positionOffset).toString()
        ) {
          setSettings({ ...settings, selectedGear: index - 1 });
        } else if (
          gears[index + 1] !== undefined &&
          Object.entries(gears[index].positionOffset).toString() ===
            Object.entries(gears[index + 1].positionOffset).toString()
        ) {
          setSettings({ ...settings, selectedGear: index + 1 });
        }
      } else {
        setSettings({ ...settings, selectedGear: index });
      }
    },
    [gears, settings]
  );

  const DrawGears = useCallback(
    (globalRpm: number) => {
      calculateGears(gears, settings);

      // Prevent transitions when editing gears in smooth mode
      // Need solution for pendulum mode
      if (!settings.isPendulum) {
        document.body.classList.add("disable-animations");
        setTimeout(() => {
          document.body.classList.remove("disable-animations");
        }, 0);
      }

      return gears.map((gear, index) => {
        const isSelected = index === settings.selectedGear;

        return (
          <span
            key={index}
            className={clsx(
              `gear-wrap gear-wrap-${index}`,
              isSelected && "gear-wrap--selected"
            )}
            style={getGearWrapStyles(gear, pendulumIncrement, settings)}
            onClick={() => {
              handleGearClick(index);
            }}
          >
            {DrawGear(gear, index, isSelected, settings)}
          </span>
        );
      });
    },
    [gears, settings, hands, handleGearClick, pendulumIncrement]
  );

  useEffect(() => {
    if (settings.isPendulum && !settings.isPaused) {
      const intervalDelay = 1000 / settings.globalHertz / 2;

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
  }, [DrawGears, settings, halfStep, pendulumIncrement]);

  const memoedGears = useMemo(
    () => DrawGears(settings.globalRpm),
    [settings, DrawGears]
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
            transitionDuration: `${1 / settings.globalHertz / 2}s`,
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
          style={getGearWrapStyles(gears[index], pendulumIncrement, settings)}
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

  const memoedHands = useMemo(() => DrawHands(), [DrawGears, hands]);

  useEffect(() => {
    if (showMenu) {
      document.body.classList.add("show-menu");
    } else {
      document.body.classList.remove("show-menu");
    }
  }, [showMenu]);

  return (
    <ClockworksContext.Provider
      value={{
        gears,
        setGears,
        pendulumIncrement,
        hands,
        setHands,
        settings,
        setSettings,
      }}
    >
      <button className="menu-trigger" onClick={() => setShowMenu(!showMenu)}>
        Show Menu
      </button>

      <div className="layout">
        <div className="layout__menu">
          <Menu />
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
                        settings.isPaused && "canvas--paused",
                        !settings.isPendulum
                          ? "canvas--smooth"
                          : "canvas--pendulum"
                      )}
                      style={{
                        width: `${canvasWidth}px`,
                        height: `${canvasHeight}px`,
                      }}
                    >
                      {memoedGears}
                      {memoedHands}
                      {settings.isPendulum && DrawPendulum()}
                    </div>
                  </div>
                </TransformComponent>
              </React.Fragment>
            )}
          </TransformWrapper>
        </div>
      </div>
    </ClockworksContext.Provider>
  );
}

export default App;
