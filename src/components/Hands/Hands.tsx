import React, { useContext } from "react";
import HandHours from "../Hands/HandHours";
import HandMinutes from "../Hands/HandMinutes";
import HandSeconds from "../Hands/HandSeconds";
import { getGearWrapStyles, getGearStyles } from "../Gear/GearUtils";
import { ClockworksContext } from "../context/context";

export const DrawHands = () => {
  const { gears, settings, pendulumIncrement, hands } =
    useContext(ClockworksContext);

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
