import { GearProps } from "../Gear/Gear";
import Locked from "../Icons/Locked";
import Unlocked from "../Icons/Unlocked";
import Delete from "../Icons/Delete";
import clsx from "clsx";
import "./GearMenu.scss";

interface Props {
  gears: GearProps[];
  setGears: (gears: GearProps[]) => void;
  selectedGear: number | undefined;
  setSelectedGear: (value: number | undefined) => void;
  isPendulum: boolean;
}

export const GearMenu = ({
  gears,
  selectedGear,
  setSelectedGear,
  setGears,
  isPendulum,
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
    const newGears = gears.filter((element, index) => index !== gear);
    document.body.classList.add("disable-animations");
    setGears(newGears);
    setSelectedGear(undefined);

    setTimeout(() => {
      document.body.classList.remove("disable-animations");
    }, 0);
  }

  if (selectedGear === undefined || gears.length === 0) return <span />;

  const gear = gears[selectedGear];
  const isEscapementGear = isPendulum && selectedGear == 1;

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
        <button
          className="gear-menu-button"
          onClick={() => removeGear(selectedGear)}
        >
          <Delete />
        </button>
      </div>

      <div className="gear-menu__setting">
        <span>Teeth</span>

        <input
          className="slider"
          type="range"
          min="4"
          max="80"
          step="1"
          value={gear.teeth}
          onChange={(e) =>
            handleTeethChange(selectedGear, Number(e.target.value))
          }
          disabled={isPendulum && selectedGear === 0}
        />

        <input
          type="number"
          min="4"
          max="80"
          step="1"
          value={gear.teeth}
          onChange={(e) =>
            handleTeethChange(selectedGear, Number(e.target.value))
          }
          disabled={isPendulum && selectedGear === 0}
        />
      </div>

      <div className="gear-menu__setting">
        <span>Angle</span>

        <input
          className="slider"
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
    </div>
  );
};
