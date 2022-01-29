import React, { useContext } from "react";
import { ClockworksContext } from "../context/context";
import { newGearSettings } from "../Gear/GearSets";
import { GearTable } from "./GearTable";
import { GearMenu } from "./GearMenu";
import { GaugeMenu } from "./GaugeMenu";
import { SaveLoad } from "./SaveLoad";
import { SpeedMenu } from "./SpeedMenu";
import clsx from "clsx";
import "./Menu.scss";
import Help from "../Icons/Help";

interface MenuSectionProps {
  children: React.ReactNode;
  className?: string | undefined;
}

const MenuSection = ({ children, className }: MenuSectionProps) => {
  return (
    <div
      className={clsx("menu__section", className !== undefined && className)}
    >
      {children}
    </div>
  );
};

interface Props {
  setShowHelp: () => void;
}

export const Menu = ({ setShowHelp }: Props) => {
  const { gears, setGears } = useContext(ClockworksContext);

  function addGear() {
    const newGear = { ...newGearSettings };
    setGears([...gears, newGear]);
  }

  return (
    <div className="menu">
      <MenuSection>
        <div className="menu-title">
          <h1>Clockworks</h1>

          <button onClick={() => setShowHelp()}>
            <Help />
          </button>
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
