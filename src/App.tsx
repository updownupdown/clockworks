import React, { useState, useEffect } from "react";
import {
  defaultGearsetName,
  defaultHandsSettings,
  defaultSettings,
  GearProps,
  getGearset,
  SettingsProps,
} from "./components/Gear/GearSets";
import { Menu } from "./components/Menu/Menu";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ZoomIn from "./components/Icons/ZoomIn";
import ZoomOut from "./components/Icons/ZoomOut";
import ZoomReset from "./components/Icons/ZoomReset";
import { HandsProps } from "./components/Gear/GearSets";
import { ClockworksContext } from "./components/context/context";
import { Canvas, canvasSettings } from "./components/Canvas/Canvas";
import { calculateGears } from "./components/Gear/CalculateGear";
import ReactTooltip from "react-tooltip";

function App() {
  // Load gears from localStorage, or defaults
  const storedGears = JSON.parse(localStorage.getItem("gears") || "[]");
  const loadGears =
    storedGears.length !== 0
      ? storedGears
      : getGearset(defaultGearsetName)!.gears;
  const [gears, _setGears] = useState<any[]>(loadGears);

  const setGears = (gears: GearProps[]) => {
    _setGears(calculateGears(gears, settings));
  };

  // Load hands from localStorage, or defaults
  const storedHands = JSON.parse(localStorage.getItem("hands") || "{}");
  const loadHands =
    Object.keys(storedHands).length !== 0 ? storedHands : defaultHandsSettings;
  const [hands, setHands] = useState<HandsProps>(loadHands);

  // Load settings from localStorage, or defaults
  const storedSettings = JSON.parse(localStorage.getItem("settings") || "{}");
  const loadSettings =
    Object.keys(storedSettings).length !== 0 ? storedSettings : defaultSettings;
  const [settings, setSettings] = useState<SettingsProps>(loadSettings);

  // Handle show/hide menu for mobile
  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
    if (showMenu) {
      document.body.classList.add("show-menu");
    } else {
      document.body.classList.remove("show-menu");
    }
  }, [showMenu]);

  // Pendulum increment for pendulum mode
  const [pendulumIncrement, setPendulumIncrement] = useState(0);

  return (
    <ClockworksContext.Provider
      value={{
        gears,
        setGears,
        hands,
        setHands,
        settings,
        setSettings,
        pendulumIncrement,
        setPendulumIncrement,
      }}
    >
      <button className="menu-trigger" onClick={() => setShowMenu(!showMenu)}>
        {showMenu ? "Hide" : "Show"} Menu
      </button>

      <div className="layout">
        <div className="layout__menu">
          <Menu />
        </div>

        <div className="layout__canvas">
          <TransformWrapper
            initialScale={1}
            minScale={0.2}
            initialPositionX={-canvasSettings.width / 2 + window.innerWidth / 2}
            initialPositionY={
              -canvasSettings.height / 3 + window.innerHeight / 2 - 200
            }
            limitToBounds={false}
            doubleClick={{ disabled: true }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <React.Fragment>
                <div className="canvas-actions">
                  <button onClick={() => zoomOut()}>
                    <ZoomOut />
                  </button>
                  <button onClick={() => zoomIn()}>
                    <ZoomIn />
                  </button>
                  <button onClick={() => resetTransform()}>
                    <ZoomReset />
                  </button>
                </div>

                <TransformComponent>
                  <Canvas />
                </TransformComponent>
              </React.Fragment>
            )}
          </TransformWrapper>
        </div>
      </div>

      <ReactTooltip effect="solid" className="tooltip-theme" delayShow={350} />
    </ClockworksContext.Provider>
  );
}

export default App;
