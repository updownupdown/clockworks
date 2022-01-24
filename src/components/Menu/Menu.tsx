import React, { useState } from "react";
import { GearProps } from "../Gear/Gear";
import { defaultNewGear } from "../Gear/defaultGears";
import Play from "../Icons/Play";
import Pause from "../Icons/Pause";
import Pendulum from "../Icons/Pendulum";
import Battery from "../Icons/Battery";
import { GearTable } from "./GearTable";
import { GearMenu } from "./GearMenu";
import "./Menu.scss";

export interface HandsProps {
  seconds: number;
  minutes: number;
  hours: number;
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
  hands: {
    seconds: number;
    minutes: number;
    hours: number;
  };
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

  function addGear(gear: GearProps) {
    setGears([...gears, gear]);
  }

  const options = (
    <>
      {gears.map((val, index) => {
        return (
          <option value={index} key={index}>
            {index}
          </option>
        );
      })}
    </>
  );

  return (
    <div className={`menu menu--${showMenu ? "show" : "hide"}`}>
      <button
        className="toggle-menu-button"
        onClick={() => setShowMenu(!showMenu)}
      >
        {showMenu ? "Hide Menu" : "Show Menu"}
      </button>

      <div className="menu__hands">
        <div className="menu__hands__section">
          <span>Gear</span>
        </div>
        <div className="menu__hands__section">
          <span>Hours</span>
          <select
            value={hands.hours}
            onChange={(e) => {
              setHands({
                ...hands,
                hours: Number(e.target.value),
              });
            }}
          >
            {options}
          </select>

          <span>
            RPD:{" "}
            {gears[hands.hours] !== undefined &&
            gears[hands.hours].rpm !== undefined
              ? Math.round(gears[hands.hours].rpm! * 60 * 24 * 100) / 100
              : "N/A"}
          </span>
        </div>

        <div className="menu__hands__section">
          <span>Minutes</span>
          <select
            value={hands.minutes}
            onChange={(e) => {
              setHands({
                ...hands,
                minutes: Number(e.target.value),
              });
            }}
          >
            {options}
          </select>

          <span>
            RPH:{" "}
            {gears[hands.minutes] !== undefined &&
            gears[hands.minutes].rpm !== undefined
              ? Math.round(gears[hands.minutes].rpm! * 60 * 100) / 100
              : "N/A"}
          </span>
        </div>

        <div className="menu__hands__section">
          <span>Seconds</span>
          <select
            value={hands.seconds}
            onChange={(e) => {
              setHands({
                ...hands,
                seconds: Number(e.target.value),
              });
            }}
          >
            {options}
          </select>

          <span>
            RPM:{" "}
            {gears[hands.minutes] !== undefined &&
            gears[hands.minutes].rpm !== undefined
              ? Math.round(gears[hands.seconds].rpm! * 100) / 100
              : "N/A"}
          </span>
        </div>
      </div>

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

      <GearTable
        gears={gears}
        selectedGear={selectedGear}
        setSelectedGear={setSelectedGear}
      />

      <button
        className="add-gear-button"
        onClick={() => addGear(defaultNewGear)}
      >
        Add Gear
      </button>

      <GearMenu
        gears={gears}
        setGears={setGears}
        selectedGear={selectedGear}
        setSelectedGear={setSelectedGear}
        isPendulum={isPendulum}
      />
    </div>
  );
};
