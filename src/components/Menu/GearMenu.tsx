import React, { useContext } from "react";
import { ClockworksContext } from "../context/context";
import GearFixed from "../Icons/GearFixed";
import GearUnfixed from "../Icons/GearUnfixed";
import Delete from "../Icons/Delete";
import { HandsProps } from "../Gear/GearSets";
import clsx from "clsx";
import "./GearMenu.scss";

export const GearMenu = () => {
  const { gears, setGears, settings, setSettings, hands, setHands } =
    useContext(ClockworksContext);

  const gear =
    settings.selectedGear === undefined
      ? undefined
      : gears[settings.selectedGear];
  // const isEscapementGear = settings.isPendulum && settings.selectedGear === 1;

  const isRemovable = () => {
    if (
      settings.selectedGear === undefined ||
      gears.length === 0 ||
      gears[settings.selectedGear] === undefined
    )
      return false;

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

  const gearHasAssignedHand =
    Object.values(hands).indexOf(settings.selectedGear) > -1;

  const handleTeethChange = (gearIndex: number | undefined, value: number) => {
    if (gearIndex === undefined) return;

    const newGears = [...gears];
    newGears[gearIndex].teeth = value;
    setGears(newGears);
  };

  const handleOffsetChange = (gearIndex: number | undefined, value: number) => {
    if (gearIndex === undefined) return;

    const newGears = [...gears];
    newGears[gearIndex].orientation = value;
    setGears(newGears);
  };

  function handleFixChange(gearIndex: number | undefined, fixed: boolean) {
    if (gearIndex === undefined) return;

    const newGears = [...gears];
    newGears[gearIndex].fixed = !fixed;
    setGears(newGears);
  }

  function removeGear(gearIndex: number) {
    if (gearIndex === undefined) return;

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

  function assignHand(type: string) {
    let newHands = { ...hands };

    // unassigned from other hands
    if (newHands.hours === settings.selectedGear) newHands.hours = undefined;
    if (newHands.minutes === settings.selectedGear)
      newHands.minutes = undefined;
    if (newHands.seconds === settings.selectedGear)
      newHands.seconds = undefined;

    if (type === "hours") {
      newHands.hours = settings.selectedGear;
    } else if (type === "minutes") {
      newHands.minutes = settings.selectedGear;
    } else if (type === "seconds") {
      newHands.seconds = settings.selectedGear;
    }

    setHands(newHands);
  }

  const parentGearOptions = () => {
    return gears.map((value, index) => {
      return (
        <option
          key={index}
          value={index}
          disabled={index === settings.selectedGear}
        >
          {index + 1}
        </option>
      );
    });
  };

  const handleParentChange = (parentIndex: number) => {
    if (settings.selectedGear === undefined) return;
    const newGears = [...gears];
    newGears[settings.selectedGear].parent = parentIndex;

    setGears(newGears);
  };

  return (
    <div
      className={clsx(
        "gear-menu",
        gear === undefined && "gear-menu--no-selection"
      )}
    >
      <div className="gear-menu__header">
        <span className="gear-menu__header__title">
          {gear === undefined
            ? "No gear selected"
            : `Gear #${settings.selectedGear! + 1}`}
        </span>

        <div
          className={clsx(
            "ci-button-group",
            (gear === undefined || settings.selectedGear === 0) &&
              "ci-button-group--disabled"
          )}
        >
          <button
            data-tip="Toggle fix to parent"
            className={clsx(
              "ci-button",
              gear !== undefined && gear.fixed && "ci-button--selected"
            )}
            onClick={() => {
              gear !== undefined &&
                handleFixChange(settings.selectedGear, false);
            }}
            disabled={
              gear === undefined || settings.selectedGear === 0 || gear.fixed
            }
          >
            <GearFixed />
          </button>
          <button
            data-tip="Toggle fix to parent"
            className={clsx(
              "ci-button",
              gear !== undefined &&
                !gear.fixed &&
                settings.selectedGear !== 0 &&
                "ci-button--selected"
            )}
            onClick={() => {
              gear !== undefined &&
                handleFixChange(settings.selectedGear, true);
            }}
            disabled={
              gear === undefined || settings.selectedGear === 0 || !gear.fixed
            }
          >
            <GearUnfixed />
          </button>
        </div>

        <button
          data-tip="Delete gear"
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
        <label
          className={clsx(
            "side-label",
            settings.selectedGear === undefined && "disabled-label"
          )}
        >
          Teeth
        </label>

        <input
          type="range"
          min="5"
          max="100"
          step="1"
          value={gear === undefined ? 0 : gear.teeth}
          onChange={(e) =>
            handleTeethChange(settings.selectedGear, Number(e.target.value))
          }
          disabled={settings.selectedGear === undefined}
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
          disabled={settings.selectedGear === undefined}
        />
      </div>

      <div className="gear-menu__setting">
        <label
          className={clsx(
            "side-label",
            (gear === undefined || gear.fixed) && "disabled-label"
          )}
        >
          Orientation
        </label>

        <input
          type="range"
          min="-180"
          max="180"
          step="1"
          value={gear === undefined || gear.fixed ? 0 : gear.orientation}
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
          value={gear === undefined || gear.fixed ? 0 : gear.orientation}
          onChange={(e) =>
            handleOffsetChange(settings.selectedGear, Number(e.target.value))
          }
          disabled={gear === undefined || gear.fixed}
        />
      </div>

      <div className="gear-menu__hands">
        <label className="side-label">Hand</label>

        <div
          className={clsx(
            "ci-button-group",
            settings.selectedGear === undefined && "ci-button-group--disabled"
          )}
        >
          <button
            className={clsx(
              "ci-button ci-button--small",
              settings.selectedGear !== undefined &&
                !gearHasAssignedHand &&
                "ci-button--selected"
            )}
            onClick={() => {
              assignHand("none");
            }}
            disabled={
              settings.selectedGear === undefined || !gearHasAssignedHand
            }
          >
            None
          </button>
          <button
            className={clsx(
              "ci-button ci-button--small",
              settings.selectedGear !== undefined &&
                hands.hours === settings.selectedGear &&
                "ci-button--selected"
            )}
            onClick={() => {
              assignHand("hours");
            }}
            disabled={
              settings.selectedGear === undefined ||
              hands.hours === settings.selectedGear
            }
          >
            H
          </button>
          <button
            className={clsx(
              "ci-button ci-button--small",
              settings.selectedGear !== undefined &&
                hands.minutes === settings.selectedGear &&
                "ci-button--selected"
            )}
            onClick={() => {
              assignHand("minutes");
            }}
            disabled={
              settings.selectedGear === undefined ||
              hands.minutes === settings.selectedGear
            }
          >
            M
          </button>
          <button
            className={clsx(
              "ci-button ci-button--small",
              settings.selectedGear !== undefined &&
                hands.seconds === settings.selectedGear &&
                "ci-button--selected"
            )}
            onClick={() => {
              assignHand("seconds");
            }}
            disabled={
              settings.selectedGear === undefined ||
              hands.seconds === settings.selectedGear
            }
          >
            S
          </button>
        </div>
      </div>

      <div className="gear-menu__hands">
        <label>Parent Gear</label>

        <select
          value={
            gear !== undefined && gear.parent !== undefined ? gear.parent : 0
          }
          onChange={(e) => handleParentChange(Number(e.target.value))}
          disabled={!isRemovable()}
        >
          {parentGearOptions()}
        </select>
      </div>
    </div>
  );
};
