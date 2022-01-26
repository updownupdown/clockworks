import React, { useContext } from "react";
import { ClockworksContext } from "../context/context";
import { newGearSettings } from "../Gear/Gearsets";
import Play from "../Icons/Play";
import Pause from "../Icons/Pause";
import Pendulum from "../Icons/Pendulum";
import Battery from "../Icons/Battery";
import { GearTable } from "./GearTable";
import { GearMenu } from "./GearMenu";
import { Gauge } from "./Gauge";
import { SaveLoad } from "./SaveLoad";
import clsx from "clsx";
import "./Menu.scss";

export interface HandsProps {
  seconds: number | undefined;
  minutes: number | undefined;
  hours: number | undefined;
}

interface MenuSectionProps {
  children: React.ReactNode;
}

const MenuSection = ({ children }: MenuSectionProps) => {
  return <div className="menu__section">{children}</div>;
};

export const Menu = () => {
  const {
    gears,
    setGears,
    globalRpm,
    setGlobalRpm,
    globalHertz,
    setGlobalHertz,
    isPaused,
    setIsPaused,
    isPendulum,
    setIsPendulum,
    tolerance,
    setTolerance,
    hands,
    setHands,
  } = useContext(ClockworksContext);

  function addGear() {
    const newGear = { ...newGearSettings };
    setGears([...gears, newGear]);
  }

  return (
    <div className="menu">
      <div className="menu__section">
        <div className="menu-title">
          <div className="menu-title__text">
            <h1>Clockworks</h1>
            <a
              href="https://github.com/updownupdown/clockworks"
              target="_blank"
              rel="noreferrer"
            >
              About
            </a>
          </div>
        </div>
      </div>

      <MenuSection>
        <SaveLoad />
      </MenuSection>

      <MenuSection>
        <div className="menu__gauges">
          <Gauge
            assignedGear={hands.hours}
            gear={hands.hours ? gears[hands.hours] : undefined}
            hand="Hours"
            unit="day"
            multiplier={60 * 24}
            tolerance={tolerance}
            setHands={(value) => {
              setHands({
                ...hands,
                hours: value,
              });
            }}
            numGears={gears.length}
          />

          <Gauge
            assignedGear={hands.minutes}
            gear={hands.minutes ? gears[hands.minutes] : undefined}
            hand="Minutes"
            unit="hr"
            multiplier={60}
            tolerance={tolerance}
            setHands={(value) => {
              setHands({
                ...hands,
                minutes: value,
              });
            }}
            numGears={gears.length}
          />

          <Gauge
            assignedGear={hands.seconds}
            gear={hands.seconds ? gears[hands.seconds] : undefined}
            hand="Seconds"
            unit="min"
            multiplier={1}
            tolerance={tolerance}
            setHands={(value) => {
              setHands({
                ...hands,
                seconds: value,
              });
            }}
            numGears={gears.length}
          />
        </div>

        <div className="menu__tolerance">
          <span>Tolerance (%)</span>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={tolerance}
            onChange={(e) => {
              setTolerance(Number(e.target.value));
            }}
          />

          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={tolerance}
            onChange={(e) => {
              setTolerance(Number(e.target.value));
            }}
          />
        </div>
      </MenuSection>

      <MenuSection>
        <div className="menu__speed">
          <button
            className="ci-button ci-button--icon"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? <Play /> : <Pause />}
          </button>

          <div className="menu__speed__rpm">
            <input
              type="number"
              min={isPendulum ? 0.25 : 1}
              max={isPendulum ? 5 : 20}
              step={isPendulum ? 0.25 : 1}
              value={isPendulum ? globalHertz : globalRpm}
              onChange={(e) => {
                if (isPendulum) {
                  setGlobalHertz(Number(e.target.value));
                } else {
                  setGlobalRpm(Number(e.target.value));
                }
              }}
            />
            <span>{isPendulum ? "Hz" : "RPM"}</span>
          </div>

          <div className="menu__speed__type">
            <button
              className={clsx(
                "ci-button ci-button--icon",
                isPendulum && "ci-button--selected"
              )}
              onClick={() => setIsPendulum(true)}
              disabled={isPendulum}
            >
              <Pendulum />
            </button>

            <button
              className={clsx(
                "ci-button ci-button--icon",
                !isPendulum && "ci-button--selected"
              )}
              onClick={() => setIsPendulum(false)}
              disabled={!isPendulum}
            >
              <Battery />
            </button>
          </div>
        </div>
      </MenuSection>

      <MenuSection>
        <button className="ci-button add-gear-button" onClick={() => addGear()}>
          Add Gear
        </button>

        <GearTable />
      </MenuSection>

      <MenuSection>
        <GearMenu />
      </MenuSection>
    </div>
  );
};
