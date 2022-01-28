import React, { useContext } from "react";
import { ClockworksContext } from "../context/context";
import { newGearSettings } from "../Gear/GearSets";
import { GearTable } from "./GearTable";
import { GearMenu } from "./GearMenu";
import { GaugeMenu } from "./GaugeMenu";
import { SaveLoad } from "./SaveLoad";
import clsx from "clsx";
import "./Menu.scss";
import { SpeedMenu } from "./SpeedMenu";

interface MenuSectionProps {
  children: React.ReactNode;
  className?: string | undefined;
}

const MenuSection = ({ children, className }: MenuSectionProps) => {
  return (
    <div
      className={clsx(
        "menu__section",
        className !== undefined && "menu__section--" + className
      )}
    >
      {children}
    </div>
  );
};

export const Menu = () => {
  const { gears, setGears } = useContext(ClockworksContext);

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

      <MenuSection className="no-top-border">
        <SaveLoad />
      </MenuSection>

      <MenuSection>
        <SpeedMenu />
      </MenuSection>

      <MenuSection className="no-top-border">
        <GaugeMenu />
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
