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

export const GaugeTypes = {
  Hours: "Hours",
  Minutes: "Minutes",
  Seconds: "Seconds",
} as const;

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

  // 10   12       20
  // 12 - 10 / (20-10)

  if (hasAssignedGear) {
    speed = Math.round(gear.rpm! * multiplier * 100) / 100;
    const gaugeMiddle = hand === GaugeTypes.Hours ? 2 : 1;
    const gaugeLow = gaugeMiddle * 0.5;
    const gaugeHigh = gaugeMiddle * 1.5;
    const gaugeRange = gaugeHigh - gaugeLow;

    indicatorPosition = (speed - gaugeLow) / gaugeRange;

    const toleranceRange = (gaugeMiddle * tolerance) / 100 / 2;

    const rangeLow = gaugeMiddle - toleranceRange;
    const rangeHigh = gaugeMiddle + toleranceRange;

    // keep gauge within bar
    if (speed < gaugeLow) indicatorPosition = 0;
    if (speed > gaugeHigh) indicatorPosition = 1;

    isInRange = speed >= rangeLow && speed <= rangeHigh;
  }

  const options = [
    <option value={"none"} key="undefined">
      -
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
          style={{ width: `${tolerance}%`, left: `${0.5 * 100}%` }}
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
