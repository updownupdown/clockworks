import { GearProps } from "../Gear/Gear";
import Locked from "../Icons/Locked";
import Unlocked from "../Icons/Unlocked";
import Delete from "../Icons/Delete";
import { HandsProps } from "./Menu";
import clsx from "clsx";
import "./GearMenu.scss";
import HandSeconds from "../Hands/HandSeconds";

interface Props {
  gears: GearProps[];
  setGears: (gears: GearProps[]) => void;
  selectedGear: number | undefined;
  setSelectedGear: (value: number | undefined) => void;
  isPendulum: boolean;
  hands: HandsProps;
  setHands: (hands: HandsProps) => void;
}

export const GearMenu = ({
  gears,
  selectedGear,
  setSelectedGear,
  setGears,
  isPendulum,
  hands,
  setHands,
}: Props) => {
  const handleTeethChange = (index: number, value: number) => {
    const newGears = [...gears];
    newGears[index].teeth = value;
    setGears(newGears);
  };

  const handleOffsetChange = (index: number, value: number) => {
    const newGears = [...gears];
    newGears[index].parentOffset = value;
    setGears(newGears);
  };

  function handleFixChange(index: number, fixed: boolean) {
    const newGears = [...gears];
    newGears[index].fixed = !fixed;
    setGears(newGears);
  }

  function removeGear(gear: number) {
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
    setSelectedGear(newSelectedGear);
  }

  const handleShiftGear = (index: number, shiftDown: boolean) => {
    const newGears = [...gears];
    const newPos = shiftDown ? index - 1 : index + 1;

    newGears.splice(newPos, 0, newGears.splice(index, 1)[0]);

    setGears(newGears);
    setSelectedGear(newPos);
  };

  if (selectedGear === undefined || gears.length === 0) return <span />;

  const gear = gears[selectedGear];
  const isEscapementGear = isPendulum && selectedGear === 1;

  return (
    <div className="gear-menu">
      <div className="gear-menu__header">
        <span className="gear-menu__header__title">
          Gear {selectedGear + 1}
        </span>
        {selectedGear !== 0 && !isEscapementGear && (
          <button
            className={clsx(
              "gear-menu-button",
              gear.fixed ? "gear-menu-button--on" : "gear-menu-button--off"
            )}
            onClick={() => handleFixChange(selectedGear, gear.fixed!)}
          >
            {gear.fixed ? <Locked /> : <Unlocked />}
          </button>
        )}
        {gears.length > 1 && (
          <button
            className="gear-menu-button"
            onClick={() => removeGear(selectedGear)}
          >
            <Delete />
          </button>
        )}
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
            handleTeethChange(selectedGear, Number(e.target.value))
          }
          disabled={isPendulum && selectedGear === 0}
        />

        <input
          type="number"
          min="5"
          max="100"
          step="1"
          value={gear.teeth}
          onChange={(e) =>
            handleTeethChange(selectedGear, Number(e.target.value))
          }
          disabled={isPendulum && selectedGear === 0}
        />
      </div>

      <div className="gear-menu__setting">
        <span>Orientation</span>

        <input
          type="range"
          min="-180"
          max="180"
          step="1"
          value={gear.parentOffset}
          onChange={(e) =>
            handleOffsetChange(selectedGear, Number(e.target.value))
          }
          disabled={gear.fixed}
        />

        <input
          type="number"
          min="-180"
          max="180"
          step="1"
          value={gear.parentOffset}
          onChange={(e) =>
            handleOffsetChange(selectedGear, Number(e.target.value))
          }
          disabled={gear.fixed}
        />
      </div>

      <div className="gear-menu__shift">
        <button
          className="menu-button"
          onClick={() => handleShiftGear(selectedGear, true)}
          disabled={selectedGear === 0}
        >
          Move Gear Up
        </button>
        <button
          className="menu-button"
          onClick={() => handleShiftGear(selectedGear, false)}
          disabled={selectedGear === gears.length - 1}
        >
          Move Gear Down
        </button>
      </div>
    </div>
  );
};
