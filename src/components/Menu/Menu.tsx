import React, { useState } from "react";
import { GearProps } from "../Gear/Gear";
import { defaultNewGear } from "../Gear/defaultGears";
import Play from "../Icons/Play";
import Pause from "../Icons/Pause";
import Locked from "../Icons/Locked";
import Unlocked from "../Icons/Unlocked";
import Delete from "../Icons/Delete";
import Pendulum from "../Icons/Pendulum";
import Battery from "../Icons/Battery";
import { ratioDisplay } from "../Gear/utils";
import clsx from "clsx";
import "./Menu.scss";

export interface HandsProps {
  seconds: number;
  minutes: number;
  hours: number;
}

interface Props {
  gears: GearProps[];
  isPaused: boolean;
  setIsPaused: (value: boolean) => void;
  globalRpm: number;
  setGlobalRpm: (value: number) => void;
  globalHertz: number;
  setGlobalHertz: (value: number) => void;
  setGears: (gears: GearProps[]) => void;
  selectedGear: number | undefined;
  setSelectedGear: (value: number | undefined) => void;
  isPendulum: boolean;
  setIsPendulum: (value: boolean) => void;
  hands: {
    seconds: number;
    minutes: number;
    hours: number;
  };
  setHands: (hands: HandsProps) => void;
}

export const Menu = ({
  globalRpm,
  setIsPaused,
  setGlobalRpm,
  isPaused,
  gears,
  setGears,
  selectedGear,
  setSelectedGear,
  isPendulum,
  setIsPendulum,
  globalHertz,
  setGlobalHertz,
}: Props) => {
  const [showMenu, setShowMenu] = useState(
    window.innerWidth > 600 ? true : false
  );

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

  function addGear(gear: GearProps) {
    setGears([...gears, gear]);
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

  const GearList = (gears: GearProps[]) => {
    return gears.map((gear, index) => {
      const displayRatio =
        index === 0 || gear.fixed ? "-" : ratioDisplay(gear.ratio!);

      return (
        <tr
          key={index}
          className={clsx(
            "gear-list__row",
            index === selectedGear && "gear-list__row--current",
            gear.fixed ? "gear-list__row--locked" : "gear-list__row--unlocked"
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
          <td className="cell-gear-speed">{Math.round(gear.rpm! * 10) / 10}</td>
          <td className="cell-gear-angle">
            {Math.round(gear.parentOffset! * 10) / 10}°
          </td>
        </tr>
      );
    });
  };

  const GearMenu = (gears: GearProps[], selectedGear: number | undefined) => {
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
            max="50"
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
            max="50"
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

  return (
    <div className={`menu menu--${showMenu ? "show" : "hide"}`}>
      <button
        className="toggle-menu-button"
        onClick={() => setShowMenu(!showMenu)}
      >
        {showMenu ? "Hide Menu" : "Show Menu"}
      </button>
      <div className="menu__speed">
        <button
          className="movement-button movement-button--pause"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? <Play /> : <Pause />}
        </button>

        <div className="menu__speed__rpm">
          <input
            type="number"
            min={isPendulum ? 0.25 : 1}
            max={isPendulum ? 5 : 20}
            step={isPendulum ? 0.25 : 1}
            value={isPendulum ? globalHertz : globalRpm}
            onChange={(e) => {
              if (isPendulum) {
                setGlobalHertz(Number(e.target.value));
              } else {
                setGlobalRpm(Number(e.target.value));
              }
            }}
          />
          <span>{isPendulum ? "Hz" : "RPM"}</span>
        </div>

        <div className="menu__speed__type">
          <button
            className="movement-button movement-button--type"
            onClick={() => setIsPendulum(true)}
            disabled={isPendulum}
          >
            <Pendulum />
          </button>

          <button
            className="movement-button movement-button--type"
            onClick={() => setIsPendulum(false)}
            disabled={!isPendulum}
          >
            <Battery />
          </button>
        </div>
      </div>

      <table className="gear-list">
        <thead>
          <tr>
            <th className="cell-gear-fixed">&nbsp;</th>
            <th className="cell-gear-num">#</th>
            <th className="cell-gear-teeth">Teeth</th>
            <th className="cell-gear-ratio">Ratio</th>
            <th className="cell-gear-speed">RPM</th>
            <th className="cell-gear-angle">Offset</th>
          </tr>
        </thead>
        <tbody>{GearList(gears)}</tbody>
      </table>

      <button
        className="add-gear-button"
        onClick={() => addGear(defaultNewGear)}
      >
        Add Gear
      </button>

      {GearMenu(gears, selectedGear)}
    </div>
  );
};
