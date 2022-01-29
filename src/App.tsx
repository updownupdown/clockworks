import React, { useState, useEffect } from "react";
import {
  defaultGearsetName,
  defaultHandsSettings,
  defaultSettings,
  GearProps,
  SettingsProps,
} from "./components/Gear/GearSets";
import { Menu } from "./components/Menu/Menu";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ZoomIn from "./components/Icons/ZoomIn";
import ZoomOut from "./components/Icons/ZoomOut";
import ResetPosition from "./components/Icons/ResetPosition";
import { HandsProps } from "./components/Gear/GearSets";
import { ClockworksContext } from "./components/context/context";
import { Canvas, canvasSettings } from "./components/Canvas/Canvas";
import { calculateGears } from "./components/Gear/CalculateGear";
import ReactTooltip from "react-tooltip";
import { Help } from "./components/Modals/Help";
import { Welcome } from "./components/Modals/Welcome";
import { loadPreset } from "./components/Menu/SaveLoad";
import clsx from "clsx";
import Hamburger from "./components/Icons/Hamburger";

function App() {
  // Load gears from localStorage, or defaults
  const storedGears = JSON.parse(localStorage.getItem("gears") || "[]");
  const loadGears = storedGears.length !== 0 ? storedGears : [];
  const [gears, _setGears] = useState<any[]>(loadGears);

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

  useEffect(() => {
    if (loadGears.length === 0) {
      loadPreset(defaultGearsetName, setGears, setHands, setSettings);
    } else {
      setGears(gears);
    }
  }, []);

  const [showHelp, setShowHelp] = useState(false);

  // Handle show/hide menu for mobile
  const [showMenu, setShowMenu] = useState(false);

  const showWelcomeOnLoad = localStorage.getItem("showWelcome") !== "true";
  const [showWelcome, _setShowWelcome] = useState(showWelcomeOnLoad);

  const setShowWelcome = (show: boolean) => {
    localStorage.setItem("showWelcome", "true");
    _setShowWelcome(show);
  };

  // Pendulum increment for pendulum mode
  const [pendulumIncrement, setPendulumIncrement] = useState(0);
  const [wasPendulum, setWasPendulum] = useState(loadSettings.isPendulum);

  function temporarilyDisableAnimations() {
    document.body.classList.add("disable-animations");
    setTimeout(() => {
      document.body.classList.remove("disable-animations");
    }, 0);
  }

  const setGears = (gears: GearProps[]) => {
    // Prevent transitions when editing gears
    temporarilyDisableAnimations();

    _setGears(calculateGears(gears, settings));
  };

  useEffect(() => {
    // Disable animations when switching between modes
    if (wasPendulum !== settings.isPendulum) {
      setWasPendulum(settings.isPendulum);
      temporarilyDisableAnimations();
    }

    _setGears(calculateGears(gears, settings));
  }, [settings, pendulumIncrement]);

  const enableZoom = false;

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
      {showHelp && <Help onClose={() => setShowHelp(false)} />}
      {showWelcome && (
        <Welcome
          onClose={() => setShowWelcome(false)}
          setShowHelp={() => setShowHelp(true)}
        />
      )}

      {!showMenu && (
        <button className="menu-trigger" onClick={() => setShowMenu(true)}>
          <Hamburger />
        </button>
      )}

      <div className="layout">
        <div
          className={clsx("layout__menu", !showMenu && "layout__menu--hide")}
        >
          <Menu
            setShowHelp={() => setShowHelp(true)}
            setShowMenu={() => setShowMenu(false)}
          />
        </div>

        <div className="layout__canvas">
          <TransformWrapper
            initialScale={1}
            minScale={enableZoom ? 0.4 : 1}
            maxScale={enableZoom ? 3 : 1}
            initialPositionX={
              -canvasSettings.width / 2 + window.innerWidth / 2 - 300
            }
            initialPositionY={
              -canvasSettings.height / 3 + window.innerHeight / 2 - 300
            }
            limitToBounds={false}
            doubleClick={{ disabled: true }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <React.Fragment>
                <div className="canvas-actions">
                  {enableZoom && (
                    <>
                      <button onClick={() => zoomOut()}>
                        <ZoomOut />
                      </button>
                      <button onClick={() => zoomIn()}>
                        <ZoomIn />
                      </button>
                    </>
                  )}
                  <button onClick={() => resetTransform()}>
                    <ResetPosition />
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

      <ReactTooltip effect="solid" className="tooltip-theme" delayShow={300} />
    </ClockworksContext.Provider>
  );
}

export default App;
