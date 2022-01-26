import React, { useState, useContext } from "react";
import { ClockworksContext } from "../../App";
import { gearSets, getGearset, newGearSettings } from "../Gear/Gearsets";
import Play from "../Icons/Play";
import Pause from "../Icons/Pause";
import Pendulum from "../Icons/Pendulum";
import Battery from "../Icons/Battery";
import { GearTable } from "./GearTable";
import { GearMenu } from "./GearMenu";
import { Gauge } from "./Gauge";
import "./Menu.scss";
import { exportGearset } from "../utils/utils";
import clsx from "clsx";

export interface HandsProps {
  seconds: number | undefined;
  minutes: number | undefined;
  hours: number | undefined;
}

interface Props {
  resetHands: () => void;
  loadSettings: (name: string) => void;
}

export const Menu = ({ resetHands, loadSettings }: Props) => {
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
    hands,
    setHands,
  } = useContext(ClockworksContext);

  const [showMenu, setShowMenu] = useState(
    window.innerWidth > 600 ? true : false
  );
  const [tolerance, setTolerance] = useState(10);

  function addGear() {
    const newGear = { ...newGearSettings };
    setGears([...gears, newGear]);
  }

  function resetGears() {
    if (window.confirm("Are you sure you want to delete all gears?"))
      setGears([]);
  }

  const gearsetList = () => {
    return gearSets.map((gearset) => {
      return (
        <option key={gearset.name} value={gearset.name}>
          {gearset.name}
        </option>
      );
    });
  };

  return (
    <div className={`menu menu--${showMenu ? "show" : "hide"}`}>
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

          {/* <button
            className="toggle-menu-button"
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? "Hide Menu" : "Show Menu"}
          </button> */}
        </div>
      </div>

      <div className="menu__section">
        <div className="save-load">
          <select
            onChange={(e) => {
              if (
                window.confirm("Are you sure you want to update all gears?")
              ) {
                resetHands();
                loadSettings(e.target.value);
              }
            }}
          >
            {gearsetList()}
          </select>

          <div className="save-load__buttons">
            <button
              className="ci-button"
              onClick={() =>
                exportGearset(
                  isPendulum,
                  globalRpm,
                  globalHertz,
                  hands,
                  tolerance,
                  gears
                )
              }
            >
              Export Gears
            </button>

            <button className="ci-button" onClick={() => resetGears()}>
              Reset Gears
            </button>
          </div>
        </div>
      </div>

      <div className="menu__section">
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
      </div>

      <div className="menu__section">
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
      </div>

      <div className="menu__section">
        <button className="ci-button add-gear-button" onClick={() => addGear()}>
          Add Gear
        </button>

        <GearTable />
      </div>

      <div className="menu__section">
        <GearMenu />
      </div>
    </div>
  );
};
