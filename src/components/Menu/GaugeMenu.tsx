import clsx from "clsx";
import { useContext } from "react";
import { ClockworksContext } from "../context/context";
import { GearProps } from "../Gear/GearSets";
import "./GaugeMenu.scss";

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

const GaugeTypes = {
  Hours: "Hours",
  Minutes: "Minutes",
  Seconds: "Seconds",
} as const;

const Gauge = ({ gear, unit, hand, multiplier, tolerance }: Props) => {
  const hasAssignedGear = gear !== undefined && gear.rpm !== undefined;

  let isInRange = false;
  let indicatorPosition = 0;
  let speed = 0;

  if (hasAssignedGear) {
    speed = Math.round(gear.rpm! * multiplier * 10) / 10;
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

    isInRange =
      gear.clockwise === true && speed >= rangeLow && speed <= rangeHigh;
  }

  const gaugeSpeedText = () => {
    if (gear && gear.clockwise === false) return "Wrong dir.";

    return hasAssignedGear ? `${speed} / ${unit}` : "N/A";
  };

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

      <span className="gauge__speed">{gaugeSpeedText()}</span>

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
    </div>
  );
};

export const GaugeMenu = () => {
  const { gears, settings, setSettings, hands, setHands } =
    useContext(ClockworksContext);

  return (
    <>
      <div className="gauge-menu__gauges">
        <Gauge
          assignedGear={hands.hours}
          gear={hands.hours !== undefined ? gears[hands.hours] : undefined}
          hand={GaugeTypes.Hours}
          unit="day"
          multiplier={60 * 24}
          tolerance={settings.tolerance}
          setHands={(value: number | undefined) => {
            setHands({
              ...hands,
              hours: value,
            });
          }}
          numGears={gears.length}
        />

        <Gauge
          assignedGear={hands.minutes}
          gear={hands.minutes !== undefined ? gears[hands.minutes] : undefined}
          hand={GaugeTypes.Minutes}
          unit="hr"
          multiplier={60}
          tolerance={settings.tolerance}
          setHands={(value: number | undefined) => {
            setHands({
              ...hands,
              minutes: value,
            });
          }}
          numGears={gears.length}
        />

        <Gauge
          assignedGear={hands.seconds}
          gear={hands.seconds !== undefined ? gears[hands.seconds] : undefined}
          hand={GaugeTypes.Seconds}
          unit="min"
          multiplier={1}
          tolerance={settings.tolerance}
          setHands={(value: number | undefined) => {
            setHands({
              ...hands,
              seconds: value,
            });
          }}
          numGears={gears.length}
        />
      </div>

      <div className="gauge-menu__tolerance">
        <label className="small-label">Tolerance</label>

        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={settings.tolerance}
          onChange={(e) => {
            setSettings({
              ...settings,
              tolerance: Number(e.target.value),
            });
          }}
        />

        <label className="tolerance-percentage small-label">
          {settings.tolerance}%
        </label>
      </div>
    </>
  );
};
