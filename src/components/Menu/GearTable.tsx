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
  const gearList = gears.map((gear, index) => {
    const displayRatio =
      index === 0 || gear.fixed ? "-" : ratioDisplay(gear.ratio!);

    return (
      <tr
        key={index}
        className={clsx(
          "gear-table__row",
          index === selectedGear && "gear-table__row--current",
          gear.fixed ? "gear-table__row--locked" : "gear-table__row--unlocked"
        )}
        onClick={() => {
          setSelectedGear(index);
        }}
      >
        <td className="cell-gear-fixed">
          {gear.fixed ? <Locked /> : <Unlocked />}
        </td>
        <td className="cell-gear-num">{index + 1}</td>
        <td className="cell-gear-teeth">{gear.teeth}</td>
        <td className="cell-gear-ratio">{displayRatio}</td>
        <td className="cell-gear-speed">{Math.round(gear.rpm! * 100) / 100}</td>
        <td className="cell-gear-speed">
          {Math.round(gear.rpm! * 60 * 100) / 100}
        </td>
        <td className="cell-gear-speed">
          {Math.round(gear.rpm! * 60 * 24 * 100) / 100}
        </td>
      </tr>
    );
  });

  return (
    <table className="gear-table">
      <thead>
        <tr>
          <th className="cell-gear-fixed">&nbsp;</th>
          <th className="cell-gear-num">#</th>
          <th className="cell-gear-teeth">Teeth</th>
          <th className="cell-gear-ratio">Ratio</th>
          <th className="cell-gear-speed">RPM</th>
          <th className="cell-gear-speed">RPH</th>
          <th className="cell-gear-speed">RPD</th>
        </tr>
      </thead>
      <tbody>{gearList}</tbody>
    </table>
  );
};
