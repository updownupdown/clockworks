import React, { useContext, useEffect } from "react";
import { ClockworksContext } from "../context/context";
import {
  defaultGearsetName,
  defaultHandsSettings,
  gearSets,
  getGearset,
  getHandsSettings,
} from "../Gear/Gearsets";
import "./Menu.scss";
import { exportGearset } from "../utils/utils";

export interface HandsProps {
  seconds: number | undefined;
  minutes: number | undefined;
  hours: number | undefined;
}

export const SaveLoad = () => {
  const {
    gears,
    setGears,
    globalRpm,
    globalHertz,
    isPendulum,
    tolerance,
    hands,
    setHands,
  } = useContext(ClockworksContext);

  function resetHands() {
    setHands(defaultHandsSettings);
  }

  function loadSettings(gearsetName: string) {
    setGears(getGearset(gearsetName));
    setHands(getHandsSettings(gearsetName));
  }

  function resetGears() {
    if (window.confirm("Are you sure you want to delete all gears?"))
      setGears([]);
  }

  useEffect(() => {
    loadSettings(defaultGearsetName);
  }, []);

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
    <div className="save-load">
      <select
        onChange={(e) => {
          if (window.confirm("Are you sure you want to update all gears?")) {
            resetHands();
            loadSettings(e.target.value);
          }
        }}
        value=""
      >
        <option value="" disabled>
          Load gearset...
        </option>
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
  );
};
