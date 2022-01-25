import { GearProps } from "../Gear/Gear";
import "./Gauge.scss";

interface Props {
  gear: GearProps;
  unit: string;
  hand: string;
  multiplier: number;
  tolerance: number;
  setHands: (value: number) => void;
  numGears: number;
  assignedGear: number;
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
  if (gear === undefined || gear.rpm === undefined) return <span />;

  const speed = Math.round(gear.rpm * multiplier * 100) / 100;
  const range = hand === "hour" ? 2 : 1;
  const gaugePosition = speed / range;

  let indicatorPosition = gaugePosition / 2;
  if (indicatorPosition < 0) indicatorPosition = 0;
  if (indicatorPosition > 1) indicatorPosition = 1;

  const isInRange =
    indicatorPosition < 0.5 + tolerance / 100 / 2 &&
    indicatorPosition > 0.5 - tolerance / 100 / 2;

  const options = [];
  for (let i = 0; i < numGears; i++) {
    options.push(
      <option value={i} key={i}>
        {i + 1}
      </option>
    );
  }

  return (
    <div className={`gauge gauge--${isInRange ? "in-range" : "out-of-range"}`}>
      <span className="gauge__unit">{unit}s</span>

      <select
        value={assignedGear}
        onChange={(e) => {
          setHands(Number(e.target.value));
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
        <span
          className="gauge__bar__current"
          style={{ left: `${indicatorPosition * 100}%` }}
        />
      </span>
      <span className="gauge__speed">
        {speed} / {unit.toLowerCase().substring(0, 3)}
      </span>
    </div>
  );
};
