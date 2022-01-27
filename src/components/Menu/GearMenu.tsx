import React, { useContext } from "react";
import { ClockworksContext } from "../context/context";
import Locked from "../Icons/Locked";
import Unlocked from "../Icons/Unlocked";
import Delete from "../Icons/Delete";
import { HandsProps } from "../Gear/Gearsets";
import clsx from "clsx";
import "./GearMenu.scss";

export const GearMenu = () => {
  const { gears, setGears, settings, setSettings, hands, setHands } =
    useContext(ClockworksContext);

  const handleTeethChange = (index: number | undefined, value: number) => {
    if (!index) return;

    const newGears = [...gears];
    newGears[index].teeth = value;
    setGears(newGears);
  };

  const handleOffsetChange = (index: number | undefined, value: number) => {
    if (!index) return;

    const newGears = [...gears];
    newGears[index].orientation = value;
    setGears(newGears);
  };

  function handleFixChange(index: number | undefined, fixed: boolean) {
    if (!index) return;

    const newGears = [...gears];
    newGears[index].fixed = !fixed;
    setGears(newGears);
  }

  function removeGear(gear: number | undefined) {
    if (!gear) return;

    const newHands: HandsProps = { ...hands };

    // unassign hands from gears
    if (
      hands.hours === gear ||
      (hands.hours !== undefined && hands.hours === gears.length - 1)
    ) {
      newHands.hours = undefined;
    }
    if (
      hands.minutes === gear ||
      (hands.minutes !== undefined && hands.minutes === gears.length - 1)
    ) {
      newHands.minutes = undefined;
    }
    if (
      hands.seconds === gear ||
      (hands.seconds !== undefined && hands.seconds === gears.length - 1)
    ) {
      newHands.seconds = undefined;
    }

    // shift gears if needed
    if (hands.hours !== undefined && gear < hands.hours) {
      newHands.hours = hands.hours - 1;
    }
    if (hands.minutes !== undefined && gear < hands.minutes) {
      newHands.minutes = hands.minutes - 1;
    }
    if (hands.seconds !== undefined && gear < hands.seconds) {
      newHands.seconds = hands.seconds - 1;
    }

    setHands(newHands);

    // remove gear
    const newGears = gears.filter((element, index) => index !== gear);

    // change selected gear
    let newSelectedGear = undefined;
    if (gear + 1 < gears.length) {
      newSelectedGear = gear;
    } else if (gear > 1) {
      newSelectedGear = gear - 1;
    }

    setGears(newGears);
    setSettings({ ...settings, selectedGear: newSelectedGear });
  }

  const handleShiftGear = (index: number | undefined, shiftDown: boolean) => {
    if (!index) return;
    const newGears = [...gears];
    const newPos = shiftDown ? index - 1 : index + 1;

    newGears.splice(newPos, 0, newGears.splice(index, 1)[0]);

    setGears(newGears);
    setSettings({ ...settings, selectedGear: newPos });
  };

  if (settings.selectedGear === undefined || gears.length === 0)
    return <span />;

  const gear = gears[settings.selectedGear];
  const isEscapementGear = settings.isPendulum && settings.selectedGear === 1;

  return (
    <div className="gear-menu">
      <div className="gear-menu__header">
        <button
          className={clsx("ci-button", gear.fixed && "ci-button--selected")}
          onClick={() => handleFixChange(settings.selectedGear, gear.fixed!)}
          disabled={settings.selectedGear === 0 || isEscapementGear}
        >
          {gear.fixed ? <Locked /> : <Unlocked />}
        </button>

        <span className="gear-menu__header__title">
          Gear {settings.selectedGear + 1}
        </span>

        <button
          className="ci-button"
          onClick={() => removeGear(settings.selectedGear)}
          disabled={gears.length === 1}
        >
          <Delete />
        </button>
      </div>

      <div className="gear-menu__setting">
        <span>Teeth</span>

        <input
          type="range"
          min="5"
          max="100"
          step="1"
          value={gear.teeth}
          onChange={(e) =>
            handleTeethChange(settings.selectedGear, Number(e.target.value))
          }
          disabled={settings.isPendulum && settings.selectedGear === 0}
        />

        <input
          type="number"
          min="5"
          max="100"
          step="1"
          value={gear.teeth}
          onChange={(e) =>
            handleTeethChange(settings.selectedGear, Number(e.target.value))
          }
          disabled={settings.isPendulum && settings.selectedGear === 0}
        />
      </div>

      <div className="gear-menu__setting">
        <span>Orientation</span>

        <input
          type="range"
          min="-180"
          max="180"
          step="1"
          value={gear.orientation}
          onChange={(e) =>
            handleOffsetChange(settings.selectedGear, Number(e.target.value))
          }
          disabled={gear.fixed}
        />

        <input
          type="number"
          min="-180"
          max="180"
          step="1"
          value={gear.orientation}
          onChange={(e) =>
            handleOffsetChange(settings.selectedGear, Number(e.target.value))
          }
          disabled={gear.fixed}
        />
      </div>

      <div className="gear-menu__shift">
        <button
          className="ci-button"
          onClick={() => handleShiftGear(settings.selectedGear, true)}
          disabled={settings.selectedGear === 0}
        >
          Move Up
        </button>
        <button
          className="ci-button"
          onClick={() => handleShiftGear(settings.selectedGear, false)}
          disabled={settings.selectedGear === gears.length - 1}
        >
          Move Down
        </button>
      </div>
    </div>
  );
};
