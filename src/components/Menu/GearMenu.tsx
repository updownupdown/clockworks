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

  function removeGear(gearIndex: number) {
    if (!gear) return;

    const newHands: HandsProps = { ...hands };

    // unassign hands from gears
    if (
      hands.hours === gearIndex ||
      (hands.hours !== undefined && hands.hours === gears.length - 1)
    ) {
      newHands.hours = undefined;
    }
    if (
      hands.minutes === gearIndex ||
      (hands.minutes !== undefined && hands.minutes === gears.length - 1)
    ) {
      newHands.minutes = undefined;
    }
    if (
      hands.seconds === gearIndex ||
      (hands.seconds !== undefined && hands.seconds === gears.length - 1)
    ) {
      newHands.seconds = undefined;
    }

    // shift hands to new gears if needed
    if (hands.hours !== undefined && gearIndex < hands.hours) {
      newHands.hours = hands.hours - 1;
    }
    if (hands.minutes !== undefined && gearIndex < hands.minutes) {
      newHands.minutes = hands.minutes - 1;
    }
    if (hands.seconds !== undefined && gearIndex < hands.seconds) {
      newHands.seconds = hands.seconds - 1;
    }

    setHands(newHands);

    // remove gear
    const newGears = gears.filter((gear, index) => index !== gearIndex);

    // change selected gear
    let newSelectedGear = undefined;
    const deletedGearParent = gears[gearIndex].parent;

    if (
      deletedGearParent !== undefined &&
      deletedGearParent < newGears.length
    ) {
      // Select gear's parent;
      newSelectedGear = deletedGearParent;
    } else if (gearIndex + 1 < gears.length) {
      // Select next gear
      newSelectedGear = gearIndex;
    } else if (gearIndex > 1) {
      // Select previous gear;
      newSelectedGear = gearIndex - 1;
    }

    setSettings({ ...settings, selectedGear: newSelectedGear });
    setGears(newGears);
  }

  const gear =
    settings.selectedGear === undefined
      ? undefined
      : gears[settings.selectedGear];
  const isEscapementGear = settings.isPendulum && settings.selectedGear === 1;

  const isRemovable = () => {
    if (settings.selectedGear === undefined) return false;

    // Don't delete if only one gear left
    if (gears.length === 1) return false;

    // Check for forks...
    let lastParent = gears[settings.selectedGear].parent;
    if (lastParent === undefined) return false;

    // Don't delete if gear is a fork, unless it's the last gear
    if (
      settings.selectedGear !== lastParent + 1 &&
      settings.selectedGear !== gears.length - 1
    ) {
      return false;
    }

    // Don't delete if gearset "forks" after the selected gear
    for (let i = settings.selectedGear + 1; i < gears.length; i++) {
      const gearParent = gears[i].parent ?? 0;
      if (gearParent !== lastParent + 1) return false;
      lastParent = gearParent;
    }

    return true;
  };

  return (
    <div className="gear-menu">
      <div className="gear-menu__header">
        <span
          className={clsx(
            "gear-menu__header__title",
            gear === undefined && "gear-menu__header__title--no-selection"
          )}
        >
          {settings.selectedGear === undefined
            ? "No gear selected"
            : `Gear ${settings.selectedGear! + 1}`}
        </span>

        <button
          className={clsx(
            "ci-button",
            gear !== undefined && gear.fixed && "ci-button--selected"
          )}
          onClick={() => {
            gear !== undefined &&
              handleFixChange(settings.selectedGear, gear.fixed!);
          }}
          disabled={gear === undefined || isEscapementGear}
        >
          {gear !== undefined && gear.fixed ? <Locked /> : <Unlocked />}
        </button>

        <button
          className="ci-button"
          onClick={() => {
            settings.selectedGear !== undefined &&
              removeGear(settings.selectedGear);
          }}
          disabled={!isRemovable()}
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
          value={gear === undefined ? 0 : gear.teeth}
          onChange={(e) =>
            handleTeethChange(settings.selectedGear, Number(e.target.value))
          }
          disabled={
            settings.selectedGear === undefined ||
            (settings.isPendulum && settings.selectedGear === 0)
          }
        />

        <input
          type="number"
          min="5"
          max="100"
          step="1"
          value={gear === undefined ? 0 : gear.teeth}
          onChange={(e) =>
            handleTeethChange(settings.selectedGear, Number(e.target.value))
          }
          disabled={
            settings.selectedGear === undefined ||
            (settings.isPendulum && settings.selectedGear === 0)
          }
        />
      </div>

      <div className="gear-menu__setting">
        <span>Orientation</span>

        <input
          type="range"
          min="-180"
          max="180"
          step="1"
          value={gear === undefined ? 0 : gear.orientation}
          onChange={(e) =>
            handleOffsetChange(settings.selectedGear, Number(e.target.value))
          }
          disabled={gear === undefined || gear.fixed}
        />

        <input
          type="number"
          min="-180"
          max="180"
          step="1"
          value={gear === undefined ? 0 : gear.orientation}
          onChange={(e) =>
            handleOffsetChange(settings.selectedGear, Number(e.target.value))
          }
          disabled={gear === undefined || gear.fixed}
        />
      </div>
    </div>
  );
};
