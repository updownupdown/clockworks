import React, { useState, useContext } from "react";
import GearFixed from "../Icons/GearFixed";
import GearUnfixed from "../Icons/GearUnfixed";
import { ratioDisplay } from "../Gear/GearMath";
import clsx from "clsx";
import { ClockworksContext } from "../context/context";
import "./GearTable.scss";

export const GearTable = () => {
  const { gears, hands, settings, setSettings } = useContext(ClockworksContext);

  const [showColumn, setShowColumn] = useState("RPM");

  const gearList = gears.map((gear, index) => {
    if (gear.rpm === undefined) return <tr key={index} />;

    const displayRatio =
      index === 0 || gear.fixed ? "-" : ratioDisplay(gear.ratio!);

    let displaySpeedMultiplier = 1;
    if (showColumn === "RPH") displaySpeedMultiplier = 60;
    if (showColumn === "RPD") displaySpeedMultiplier = 60 * 24;

    let displaySpeed =
      Math.round(gear.rpm! * 100 * displaySpeedMultiplier) / 100;

    const gearHand = () => {
      if (hands.hours === index) return "H";
      if (hands.minutes === index) return "M";
      if (hands.seconds === index) return "S";
      return "";
    };

    return (
      <tr
        key={index}
        className={clsx(
          "gear-table__row",
          index === settings.selectedGear && "gear-table__row--current",
          gear.fixed ? "gear-table__row--locked" : "gear-table__row--unlocked"
        )}
        onClick={() => {
          const gearToSelect =
            settings.selectedGear === index ? undefined : index;
          setSettings({ ...settings, selectedGear: gearToSelect });
        }}
      >
        <td className="cell-gear-hand">{gearHand()}</td>
        <td className="cell-gear-fixed">
          {gear.fixed ? <GearFixed /> : <GearUnfixed />}
        </td>
        <td className="cell-gear-num">{index + 1}</td>
        <td className="cell-gear-teeth">{gear.teeth}</td>
        <td className="cell-gear-ratio">{displayRatio}</td>
        <td className="cell-gear-speed">{displaySpeed}</td>
      </tr>
    );
  });

  return (
    <div className="gear-table-wrap">
      <div className="table-select">
        <label className="small-label">Show rotation per:</label>

        <div className="ci-button-group">
          <button
            className={clsx(
              "ci-button ci-button--small",
              showColumn === "RPM" && "ci-button--selected"
            )}
            onClick={() => setShowColumn("RPM")}
            disabled={showColumn === "RPM"}
          >
            min
          </button>
          <button
            className={clsx(
              "ci-button ci-button--small",
              showColumn === "RPH" && "ci-button--selected"
            )}
            onClick={() => setShowColumn("RPH")}
            disabled={showColumn === "RPH"}
          >
            hr
          </button>
          <button
            className={clsx(
              "ci-button ci-button--small",
              showColumn === "RPD" && "ci-button--selected"
            )}
            onClick={() => setShowColumn("RPD")}
            disabled={showColumn === "RPD"}
          >
            day
          </button>
        </div>
      </div>

      <table className="gear-table">
        <thead>
          <tr>
            <th className="cell-gear-hand">&nbsp;</th>
            <th className="cell-gear-fixed">&nbsp;</th>
            <th className="cell-gear-num">#</th>
            <th className="cell-gear-teeth">Teeth</th>
            <th className="cell-gear-ratio">Ratio</th>
            <th className="cell-gear-speed">{showColumn}</th>
          </tr>
        </thead>
        <tbody>{gearList}</tbody>
      </table>
    </div>
  );
};
