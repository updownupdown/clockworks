import React, { useContext, useEffect, useRef } from "react";
import { ClockworksContext } from "../context/context";
import {
  defaultGearsetName,
  defaultHandsSettings,
  defaultSettings,
  gearsetNames,
  getGearset,
} from "../Gear/Gearsets";
import { GearSetProps } from "../Gear/Gearsets";
import Download from "../Icons/Download";
import Export from "../Icons/Export";
import Reset from "../Icons/Reset";

function datetimestamp() {
  var now = new Date();

  return (
    now.getFullYear() +
    "-" +
    ("0" + (now.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + now.getDate()).slice(-2)
  );
}

export const exportGearset = async ({
  gears,
  hands,
  settings,
}: GearSetProps) => {
  let exportData: any = {
    hands,
    settings,
    gears: gears.map((gear) => {
      return {
        teeth: gear.teeth,
        orientation: gear.orientation,
        fixed: gear.fixed ? true : undefined,
        parent: gear.parent,
      };
    }),
  };

  const myData = exportData;
  const fileName = "gearset-" + datetimestamp();

  const json = JSON.stringify(myData);
  const blob = new Blob([json], { type: "application/json" });
  const href = await URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName + ".json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const SaveLoad = () => {
  const { gears, setGears, hands, setHands, settings, setSettings } =
    useContext(ClockworksContext);

  function resetHands() {
    setHands(defaultHandsSettings);
  }

  function loadSettings(gearsetName: string) {
    const gearset = getGearset(gearsetName);

    const gearsetGears = gearset?.gears ? gearset.gears : [];
    setGears(gearsetGears);

    const gearsetHands = gearset?.hands ?? defaultHandsSettings;
    setHands(gearsetHands);

    const importedSettings = gearset?.settings ?? defaultSettings;
    setSettings(importedSettings);
  }

  function resetGears() {
    if (window.confirm("Are you sure you want to delete all gears?"))
      setGears([]);
  }

  useEffect(() => {
    loadSettings(defaultGearsetName);
  }, []);

  const gearsetList = () => {
    return Object.entries(gearsetNames).map(([key, value]) => {
      return (
        <option key={key} value={value}>
          {value}
        </option>
      );
    });
  };

  const browseInput = useRef<HTMLInputElement | null>(null);

  function importGears() {
    // Trigger browse by clicking hidden input
    browseInput!.current!.click();
  }

  const handleBrowseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];

    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileContent = e.target!.result;
      const isValidJson = isValidJSONString(fileContent);

      if (
        isValidJson &&
        fileContent !== null &&
        typeof fileContent === "string"
      ) {
        const file = JSON.parse(fileContent);

        if (file.gears !== undefined && typeof file.gears === "object") {
          setGears(file.gears);
        }
        if (file.hands !== undefined && typeof file.hands === "object") {
          setHands(file.hands);
        }
        if (file.settings !== undefined && typeof file.settings === "object") {
          const importedSettings = defaultSettings;

          if (typeof file.settings.globalRpm === "number") {
            importedSettings.globalRpm = file.settings.globalRpm;
          }
          if (typeof file.settings.globalHertz === "number") {
            importedSettings.globalHertz = file.settings.globalHertz;
          }
          if (typeof file.settings.tolerance === "number") {
            importedSettings.tolerance = file.settings.tolerance;
          }
          if (typeof file.settings.isPaused === "boolean") {
            importedSettings.isPaused = file.settings.isPaused;
          }
          if (typeof file.settings.isPendulum === "boolean") {
            importedSettings.isPendulum = file.settings.isPendulum;
          }

          setSettings(importedSettings);
        }
      } else {
        alert("Invalid JSON file!");
      }

      // Reset input to allow uploading the same file again
      browseInput.current!.value = "";
    };
    reader.readAsText(file);
  };

  function isValidJSONString(item: any) {
    try {
      item = JSON.parse(item);
    } catch (e) {
      return false;
    }

    if (typeof item === "object" && item !== null) {
      return true;
    }

    return false;
  }

  return (
    <div className="save-load">
      <select
        onChange={(e) => {
          if (window.confirm("Are you sure you want to update all gears?")) {
            resetHands();
            loadSettings(e.target.value);
          }
        }}
        value=""
      >
        <option value="" disabled>
          Presets...
        </option>
        {gearsetList()}
      </select>

      <button
        className="ci-button ci-button--icon"
        onClick={() => importGears()}
        title="Import"
      >
        <Download />
      </button>
      <input
        type="file"
        id="file"
        ref={browseInput}
        style={{ display: "none" }}
        onChange={handleBrowseChange}
        accept="application/json"
      />

      <button
        className="ci-button ci-button--icon"
        onClick={() =>
          exportGearset({
            name: "gearset",
            gears,
            hands,
            settings,
          })
        }
        title="Export"
      >
        <Export />
      </button>

      <button
        className="ci-button ci-button--icon"
        onClick={() => resetGears()}
        title="Reset"
      >
        <Reset />
      </button>
    </div>
  );
};
