import React, { useState, useContext } from "react";
import Locked from "../Icons/Locked";
import Unlocked from "../Icons/Unlocked";
import { ratioDisplay } from "../Gear/utils";
import clsx from "clsx";
import { ClockworksContext } from "../context/context";
import "./GearTable.scss";

export const GearTable = () => {
  const { gears, settings, setSettings } = useContext(ClockworksContext);

  const [showColumn, setShowColumn] = useState("RPM");

  const gearList = gears.map((gear, index) => {
    const displayRatio =
      index === 0 || gear.fixed ? "-" : ratioDisplay(gear.ratio!);

    let displaySpeedMultiplier = 1;
    if (showColumn === "RPH") displaySpeedMultiplier = 60;
    if (showColumn === "RPD") displaySpeedMultiplier = 60 * 24;

    let displaySpeed =
      Math.round(gear.rpm! * 100 * displaySpeedMultiplier) / 100;

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
        <td className="cell-gear-fixed">
          {gear.fixed ? <Locked /> : <Unlocked />}
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
        <span>Show rot. per: </span>
        <button
          className={clsx(
            "ci-button ci-button--small",
            showColumn === "RPM" && "ci-button--selected"
          )}
          onClick={() => setShowColumn("RPM")}
          disabled={showColumn === "RPM"}
        >
          minute
        </button>
        <button
          className={clsx(
            "ci-button ci-button--small",
            showColumn === "RPH" && "ci-button--selected"
          )}
          onClick={() => setShowColumn("RPH")}
          disabled={showColumn === "RPH"}
        >
          hour
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
      <table className="gear-table">
        <thead>
          <tr>
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
