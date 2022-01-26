import React, { useContext } from "react";
import { ClockworksContext } from "../context/context";
import { GearProps } from "../Gear/Gearsets";
import { HandsProps } from "../Menu/Menu";

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

export const exportGearset = async (
  isPendulum: boolean,
  globalRpm: number,
  globalHertz: number,
  hands: HandsProps,
  tolerance: number,
  gears: GearProps[]
) => {
  let exportData: any = {
    isPendulum,
    globalRpm,
    globalHertz,
    hands,
    tolerance,
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
