import React, { useState } from "react";
import { GearProps } from "../Gear/Gear";
import Locked from "../Icons/Locked";
import Unlocked from "../Icons/Unlocked";
import { ratioDisplay } from "../Gear/utils";
import clsx from "clsx";
import "./GearTable.scss";

interface Props {
  gears: GearProps[];
  selectedGear: number | undefined;
  setSelectedGear: (value: number | undefined) => void;
}

export const GearTable = ({ gears, selectedGear, setSelectedGear }: Props) => {
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
          index === selectedGear && "gear-table__row--current",
          gear.fixed ? "gear-table__row--locked" : "gear-table__row--unlocked"
        )}
        onClick={() => {
          const gearToSelect = selectedGear === index ? undefined : index;
          setSelectedGear(gearToSelect);
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
    <>
      <div className="table-select">
        <span>Show rotation per</span>
        <button
          onClick={() => setShowColumn("RPM")}
          disabled={showColumn === "RPM"}
        >
          minute
        </button>
        <button
          onClick={() => setShowColumn("RPH")}
          disabled={showColumn === "RPH"}
        >
          hour
        </button>
        <button
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
    </>
  );
};
