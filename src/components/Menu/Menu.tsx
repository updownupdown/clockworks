import React, { useState } from "react";
import { GearProps } from "../Gear/Gear";
import { defaultNewGear } from "../Gear/defaultGears";
import Play from "../Icons/Play";
import Pause from "../Icons/Pause";
import Pendulum from "../Icons/Pendulum";
import Battery from "../Icons/Battery";
import { GearTable } from "./GearTable";
import { GearMenu } from "./GearMenu";
import { Gauge } from "./Gauge";
import "./Menu.scss";

export interface HandsProps {
  seconds: number | undefined;
  minutes: number | undefined;
  hours: number | undefined;
}

interface Props {
  gears: GearProps[];
  isPaused: boolean;
  setIsPaused: (value: boolean) => void;
  globalRpm: number;
  setGlobalRpm: (value: number) => void;
  globalHertz: number;
  setGlobalHertz: (value: number) => void;
  setGears: (gears: GearProps[]) => void;
  selectedGear: number | undefined;
  setSelectedGear: (value: number | undefined) => void;
  isPendulum: boolean;
  setIsPendulum: (value: boolean) => void;
  hands: HandsProps;
  setHands: (hands: HandsProps) => void;
}

export const Menu = ({
  globalRpm,
  setIsPaused,
  setGlobalRpm,
  isPaused,
  gears,
  setGears,
  selectedGear,
  setSelectedGear,
  isPendulum,
  setIsPendulum,
  globalHertz,
  setGlobalHertz,
  hands,
  setHands,
}: Props) => {
  const [showMenu, setShowMenu] = useState(
    window.innerWidth > 600 ? true : false
  );
  const [tolerance, setTolerance] = useState(10);

  function addGear(gear: GearProps) {
    setGears([...gears, gear]);
  }

  function resetGears() {
    if (window.confirm("Are you sure you want to delete all gears?"))
      setGears([]);
  }

  return (
    <div className={`menu menu--${showMenu ? "show" : "hide"}`}>
      <div className="menu__title">
        <div className="menu__title__text">
          <h1>Clockworks</h1>
          <a
            href="https://github.com/updownupdown/clockworks"
            target="_blank"
            rel="noreferrer"
          >
            About
          </a>
        </div>

        <button
          className="toggle-menu-button"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? "Hide Menu" : "Show Menu"}
        </button>
      </div>

      <div className="menu__section">
        <div className="menu__gauges">
          <Gauge
            assignedGear={hands.hours}
            gear={hands.hours ? gears[hands.hours] : undefined}
            hand="hour"
            unit="Day"
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
            hand="minutes"
            unit="Minute"
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
            hand="second"
            unit="Second"
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
            className="movement-button movement-button--pause"
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
              className="movement-button movement-button--type"
              onClick={() => setIsPendulum(true)}
              disabled={isPendulum}
            >
              <Pendulum />
            </button>

            <button
              className="movement-button movement-button--type"
              onClick={() => setIsPendulum(false)}
              disabled={!isPendulum}
            >
              <Battery />
            </button>
          </div>
        </div>
      </div>

      <div className="menu__section">
        <GearTable
          gears={gears}
          selectedGear={selectedGear}
          setSelectedGear={setSelectedGear}
        />

        <div className="gear-actions">
          <button
            className="menu-button menu-button--add-gear"
            onClick={() => addGear(defaultNewGear)}
          >
            Add Gear
          </button>

          <button
            className="menu-button menu-button--reset-gears"
            onClick={() => resetGears()}
          >
            Reset Gears
          </button>
        </div>

        <GearMenu
          gears={gears}
          setGears={setGears}
          selectedGear={selectedGear}
          setSelectedGear={setSelectedGear}
          isPendulum={isPendulum}
          hands={hands}
          setHands={setHands}
        />
      </div>
    </div>
  );
};
