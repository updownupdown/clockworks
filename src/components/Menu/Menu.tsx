import React, { useContext, useState } from "react";
import { ClockworksContext } from "../context/context";
import { newGearSettings } from "../Gear/GearSets";
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
import { SpeedMenu } from "./SpeedMenu";

interface MenuSectionProps {
  children: React.ReactNode;
}

const MenuSection = ({ children }: MenuSectionProps) => {
  return <div className="menu__section">{children}</div>;
};

export const Menu = () => {
  const { gears, setGears, settings, setSettings, hands, setHands } =
    useContext(ClockworksContext);

  function addGear() {
    const newGear = { ...newGearSettings };
    setGears([...gears, newGear]);
  }

  return (
    <div className="menu">
      <MenuSection>
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
      </MenuSection>

      <MenuSection>
        <SaveLoad />
      </MenuSection>

      <MenuSection>
        <SpeedMenu />
      </MenuSection>

      <MenuSection>
        <div className="menu__gauges">
          <Gauge
            assignedGear={hands.hours}
            gear={hands.hours !== undefined ? gears[hands.hours] : undefined}
            hand="Hours"
            unit="day"
            multiplier={60 * 24}
            tolerance={settings.tolerance}
            setHands={(value: number | undefined) => {
              setHands({
                ...hands,
                hours: value,
              });
            }}
            numGears={gears.length}
          />

          <Gauge
            assignedGear={hands.minutes}
            gear={
              hands.minutes !== undefined ? gears[hands.minutes] : undefined
            }
            hand="Minutes"
            unit="hr"
            multiplier={60}
            tolerance={settings.tolerance}
            setHands={(value: number | undefined) => {
              setHands({
                ...hands,
                minutes: value,
              });
            }}
            numGears={gears.length}
          />

          <Gauge
            assignedGear={hands.seconds}
            gear={
              hands.seconds !== undefined ? gears[hands.seconds] : undefined
            }
            hand="Seconds"
            unit="min"
            multiplier={1}
            tolerance={settings.tolerance}
            setHands={(value: number | undefined) => {
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
            value={settings.tolerance}
            onChange={(e) => {
              setSettings({
                ...settings,
                tolerance: Number(e.target.value),
              });
            }}
          />

          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={settings.tolerance}
            onChange={(e) => {
              setSettings({
                ...settings,
                tolerance: Number(e.target.value),
              });
            }}
          />
        </div>
      </MenuSection>

      <MenuSection>
        <GearMenu />
      </MenuSection>

      <MenuSection>
        <GearTable />

        <button className="ci-button add-gear-button" onClick={() => addGear()}>
          Add Gear
        </button>
      </MenuSection>
    </div>
  );
};
