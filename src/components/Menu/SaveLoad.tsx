import React, { useContext, useRef } from "react";
import { ClockworksContext } from "../context/context";
import {
  defaultHandsSettings,
  defaultSettings,
  GearProps,
  gearsetNames,
  getGearset,
  HandsProps,
  SettingsProps,
} from "../Gear/GearSets";
import { GearSetProps } from "../Gear/GearSets";
import Download from "../Icons/Import";
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

export function loadPreset(
  gearsetName: string,
  setGears: (gears: GearProps[]) => void,
  setHands: (hands: HandsProps) => void,
  setSettings: (settings: SettingsProps) => void
) {
  const preset = getGearset(gearsetName);

  const gearsetGears = preset?.gears ? preset.gears : [];

  setGears(gearsetGears);

  const gearsetHands = preset?.hands ?? defaultHandsSettings;
  setHands(gearsetHands);

  const importedSettings = preset?.settings ?? defaultSettings;
  setSettings(importedSettings);
}

export const SaveLoad = () => {
  const { gears, setGears, hands, setHands, settings, setSettings } =
    useContext(ClockworksContext);

  function resetHands() {
    setHands(defaultHandsSettings);
  }

  function resetGears() {
    if (window.confirm("Are you sure you want to delete all gears?")) {
      setGears([]);
      setSettings(defaultSettings);
      setHands(defaultHandsSettings);
    }
  }

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
            loadPreset(e.target.value, setGears, setHands, setSettings);
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
        data-tip="Import"
        className="ci-button ci-button--icon"
        onClick={() => importGears()}
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
        data-tip="Export"
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
        data-tip="Reset"
        className="ci-button ci-button--icon"
        onClick={() => resetGears()}
        title="Reset"
      >
        <Reset />
      </button>
    </div>
  );
};
