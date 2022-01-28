import React from "react";
import HandHours from "../Icons/HandHours";
import HandMinutes from "../Icons/HandMinutes";
import HandSeconds from "../Icons/HandSeconds";
import { getGearWrapStyles, getGearStyles } from "../Gear/GearUtils";
import { GearProps, HandsProps, SettingsProps } from "../Gear/GearSets";

interface Props {
  gears: GearProps[];
  hands: HandsProps;
  settings: SettingsProps;
  pendulumIncrement: number;
}

export const DrawHands = ({
  gears,
  settings,
  pendulumIncrement,
  hands,
}: Props) => {
  let handsOutput: HTMLElement | any = [];

  function drawHand(index: number | undefined, hand: React.ReactNode) {
    if (index === undefined || gears[index] === undefined) return;

    handsOutput.push(
      <span
        className="clock-hand"
        style={getGearWrapStyles(gears[index], pendulumIncrement, settings)}
      >
        <div
          className="hand"
          style={getGearStyles(gears[index].rpm, gears[index].clockwise)}
        >
          {hand}
        </div>
      </span>
    );
  }

  drawHand(hands.hours, <HandHours />);
  drawHand(hands.minutes, <HandMinutes />);
  drawHand(hands.seconds, <HandSeconds />);

  return handsOutput.map((hand: HTMLElement, index: number) => (
    <span key={index}>{hand}</span>
  ));
};
