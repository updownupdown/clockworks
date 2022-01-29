import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { DrawGear } from "../Gear/DrawGear";
import Escapement from "../Icons/Escapement";
import { getGearWrapStyles } from "../Gear/GearUtils";
import { ClockworksContext } from "../context/context";
import { DrawHands } from "../Hands/Hands";
import "./Canvas.scss";
import clsx from "clsx";

const canvasWidth = 4000;
const canvasRatio = 0.75;
const canvasHeight = canvasWidth * canvasRatio;

export const canvasSettings = {
  width: canvasWidth,
  height: canvasWidth * canvasRatio,
  ratio: canvasRatio,
  firstGearOrigin: { x: canvasWidth / 2, y: canvasHeight / 3 },
};

export const Canvas = () => {
  const {
    gears,
    setGears,
    hands,
    settings,
    setSettings,
    pendulumIncrement,
    setPendulumIncrement,
  } = useContext(ClockworksContext);

  const [halfStep, setHalfStep] = useState(false);

  const handleGearClick = useCallback(
    (index: number) => {
      if (settings.selectedGear === index) {
        if (
          gears[index - 1] !== undefined &&
          JSON.stringify(gears[index].positionOffset) ===
            JSON.stringify(gears[index - 1].positionOffset)
        ) {
          setSettings({ ...settings, selectedGear: index - 1 });
        } else if (
          gears[index + 1] !== undefined &&
          JSON.stringify(gears[index].positionOffset) ===
            JSON.stringify(gears[index + 1].positionOffset)
        ) {
          setSettings({ ...settings, selectedGear: index + 1 });
        }
      } else {
        setSettings({ ...settings, selectedGear: index });
      }
    },
    [gears, settings]
  );

  const DrawGears = useCallback(() => {
    localStorage.setItem("gears", JSON.stringify(gears));
    localStorage.setItem("hands", JSON.stringify(hands));
    localStorage.setItem("settings", JSON.stringify(settings));

    return gears.map((gear, index) => {
      return (
        <span
          key={index}
          className={clsx(
            `gear-wrap gear-wrap-${index}`,
            index === settings.selectedGear && "gear-wrap--selected"
          )}
          style={getGearWrapStyles(gear, pendulumIncrement, settings)}
          onClick={() => {
            handleGearClick(index);
          }}
        >
          {DrawGear(gear, index, settings)}
        </span>
      );
    });
  }, [gears, settings, hands, handleGearClick, pendulumIncrement]);

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
    () => DrawGears(),
    [settings, DrawGears, setGears]
  );

  // Pendulum
  const DrawPendulum = () => {
    if (gears[0] === undefined) return <span />;

    const firstGear = gears[0];
    const rotateTo = (halfStep ? -1 : 1) * 8;

    if (firstGear.r === undefined) return <span />;

    return (
      <div
        className="pendulum"
        style={{
          left: `${canvasSettings.firstGearOrigin.x}px`,
          top: `${canvasSettings.firstGearOrigin.y - firstGear.r * 1.8}px`,
          width: `${firstGear.r * 2.1}px`,
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

  const memoedHands = useMemo(
    () => (
      <DrawHands
        gears={gears}
        hands={hands}
        settings={settings}
        pendulumIncrement={pendulumIncrement}
      />
    ),
    [DrawGears, hands]
  );

  return (
    <div className="canvas-wrap">
      <div
        className={clsx(
          "canvas",
          settings.isPaused && "canvas--paused",
          !settings.isPendulum ? "canvas--smooth" : "canvas--pendulum"
        )}
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
        }}
      >
        {settings.isPendulum && DrawPendulum()}
        {memoedGears}
        {memoedHands}
      </div>
    </div>
  );
};
