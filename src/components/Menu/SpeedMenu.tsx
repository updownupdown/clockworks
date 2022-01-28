import React, { useContext } from "react";
import { ClockworksContext } from "../context/context";
import Play from "../Icons/Play";
import Pause from "../Icons/Pause";
import Pendulum from "../Icons/Pendulum";
import Battery from "../Icons/Battery";
import HandHours from "../Hands/HandHours";
import HandMinutes from "../Hands/HandMinutes";
import HandSeconds from "../Hands/HandSeconds";
import { GearProps } from "../Gear/GearSets";
import clsx from "clsx";
import "./SpeedMenu.scss";

export const SpeedMenu = () => {
  const { gears, pendulumIncrement, hands, settings, setSettings } =
    useContext(ClockworksContext);

  const now = new Date(),
    handPositions = {
      hours: ((now.getHours() % 12) / 12) * 360,
      minutes: (now.getMinutes() / 60) * 360,
      seconds: (now.getSeconds() / 60) * 360,
    };

  interface ClockhandProps {
    units: string;
    drawing: React.ReactNode;
  }

  const Clockhand = ({ units, drawing }: ClockhandProps) => {
    let currentGear: GearProps | undefined = undefined;

    if (units === "hours") {
      currentGear = hands.hours !== undefined ? gears[hands.hours!] : undefined;
    } else if (units === "minutes") {
      currentGear =
        hands.minutes !== undefined ? gears[hands.minutes!] : undefined;
    } else if (units === "seconds") {
      currentGear =
        hands.seconds !== undefined ? gears[hands.seconds!] : undefined;
    } else {
      return <span />;
    }

    if (
      currentGear === undefined ||
      currentGear!.positionOffset === undefined ||
      currentGear!.rotationOffset === undefined ||
      currentGear!.rpm === undefined ||
      currentGear!.pendulumAngleIncrement === undefined
    )
      return <span />;

    const pendulumAngleIncrement = !settings.isPendulum
      ? 0
      : currentGear.pendulumAngleIncrement;

    return (
      <div
        className={`gc-hand gc-hand--${units}`}
        style={{
          transform: `translateX(-50%) translateY(-50%) rotate(${
            currentGear.rotationOffset +
            pendulumAngleIncrement * pendulumIncrement
          }deg)`,
          transitionDuration: `${1 / settings.globalHertz}s`,
        }}
      >
        <div
          className="gc-hand__svg"
          style={{
            animationDuration: `${60 / currentGear.rpm}s`,
            animationDirection: currentGear.clockwise ? "normal" : "reverse",
          }}
        >
          {drawing}
        </div>
      </div>
    );
  };

  return (
    <div className="speed-menu">
      <div className="speed-menu__clock">
        <div
          className="rc-hand rc-hand--hours c-rate-hours"
          style={{ transform: `rotate(${handPositions.hours}deg)` }}
        />
        <div
          className="rc-hand rc-hand--minutes c-rate-minutes"
          style={{ transform: `rotate(${handPositions.minutes}deg)` }}
        />

        <Clockhand units="hours" drawing={<HandHours />} />
        <Clockhand units="minutes" drawing={<HandMinutes />} />
        <Clockhand units="seconds" drawing={<HandSeconds />} />
      </div>

      <div className="speed-menu__right">
        <div className="speed-menu__right__rpm">
          <input
            type="number"
            min={settings.isPendulum ? 0.25 : 1}
            max={settings.isPendulum ? 5 : 20}
            step={settings.isPendulum ? 0.25 : 1}
            value={
              settings.isPendulum ? settings.globalHertz : settings.globalRpm
            }
            onChange={(e) => {
              if (settings.isPendulum) {
                setSettings({
                  ...settings,
                  globalHertz: Number(e.target.value),
                });
              } else {
                setSettings({
                  ...settings,
                  globalRpm: Number(e.target.value),
                });
              }
            }}
          />
          <span>{settings.isPendulum ? "Hz" : "RPM"}</span>
        </div>

        <div className="speed-menu__right__buttons">
          <button
            className="ci-button ci-button--icon"
            onClick={() =>
              setSettings({ ...settings, isPaused: !settings.isPaused })
            }
          >
            {settings.isPaused ? <Play /> : <Pause />}
          </button>

          <button
            className={clsx(
              "ci-button ci-button--icon",
              !settings.isPendulum && "ci-button--selected"
            )}
            onClick={() => setSettings({ ...settings, isPendulum: false })}
            disabled={!settings.isPendulum}
          >
            <Battery />
          </button>
          <button
            className={clsx(
              "ci-button ci-button--icon",
              settings.isPendulum && "ci-button--selected"
            )}
            onClick={() => setSettings({ ...settings, isPendulum: true })}
            disabled={settings.isPendulum}
          >
            <Pendulum />
          </button>
        </div>
      </div>
    </div>
  );
};
