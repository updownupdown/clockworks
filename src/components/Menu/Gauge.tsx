import clsx from "clsx";
import { GearProps } from "../Gear/GearSets";
import "./Gauge.scss";

interface Props {
  gear: GearProps | undefined;
  unit: string;
  hand: string;
  multiplier: number;
  tolerance: number;
  setHands: (value: number | undefined) => void;
  numGears: number;
  assignedGear: number | undefined;
}

export const Gauge = ({
  gear,
  unit,
  hand,
  multiplier,
  tolerance,
  setHands,
  numGears,
  assignedGear,
}: Props) => {
  const hasAssignedGear = gear !== undefined && gear.rpm !== undefined;

  let isInRange = false;
  let indicatorPosition = 0;
  let speed = 0;

  if (hasAssignedGear) {
    speed = Math.round(gear.rpm! * multiplier * 100) / 100;
    const range = hand === "Hours" ? 2 : 1;
    const gaugePosition = speed / range;

    indicatorPosition = gaugePosition / 2;
    if (indicatorPosition < 0) indicatorPosition = 0;
    if (indicatorPosition > 1) indicatorPosition = 1;

    isInRange =
      indicatorPosition < 0.5 + tolerance / 100 / 2 &&
      indicatorPosition > 0.5 - tolerance / 100 / 2;
  }

  const options = [
    <option value={"none"} key="undefined">
      --
    </option>,
  ];
  for (let i = 0; i < numGears; i++) {
    options.push(
      <option value={i} key={i}>
        {i + 1}
      </option>
    );
  }

  return (
    <div
      className={clsx(
        "gauge",
        hasAssignedGear && isInRange && "gauge--in-range",
        hasAssignedGear && !isInRange && "gauge--out-of-range",
        !hasAssignedGear && "gauge--unassigned"
      )}
    >
      <span className="gauge__unit">{hand}</span>

      <select
        value={assignedGear ?? "none"}
        onChange={(e) => {
          setHands(
            e.target.value === "none" ? undefined : Number(e.target.value)
          );
        }}
      >
        {options}
      </select>

      <span className="gauge__bar">
        <span className="gauge__bar__range" />
        <span
          className="gauge__bar__tolerance"
          style={{ width: `${tolerance}%` }}
        />
        {hasAssignedGear && (
          <span
            className="gauge__bar__current"
            style={{ left: `${indicatorPosition * 100}%` }}
          />
        )}
      </span>
      <span className="gauge__speed">
        {hasAssignedGear ? `${speed} / ${unit}` : "N/A"}
      </span>
    </div>
  );
};
