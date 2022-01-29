import React from "react";
import { Modal } from "./Modal";
import "./Help.scss";
import Gear from "../Icons/Gear";
import GearFixed from "../Icons/GearFixed";
import GearUnfixed from "../Icons/GearUnfixed";
import Import from "../Icons/Import";
import Export from "../Icons/Export";
import Battery from "../Icons/Battery";
import Pendulum from "../Icons/Pendulum";
import Reset from "../Icons/Reset";
import Play from "../Icons/Play";
import Pause from "../Icons/Pause";

interface Props {
  onClose: () => void;
}

export const Help = ({ onClose }: Props) => {
  return (
    <Modal onClose={onClose}>
      <div className="help">
        <h2>What's the point?</h2>
        <p>
          The goal of this web app is to build a clock. This is achieved by
          connecting gears together, achieving various gear size ratios, and
          adding clock hands to certain gears in order to have the clock hands
          rotating at the right speeds.
        </p>

        <hr />

        <h2>How does it work?</h2>
        <p>
          You will need to chain several gears together, using different sized
          gears, either side by side or fixed on top of one another, to convert
          a quickly rotating gear (i.e. 1 rotation per minute) to a slowly
          rotating gear (i.e. 1 rotation per hour, 1 rotation every 12 hours,
          etc.), step by step. The gauges and table will help you find the right
          gear ratios.
        </p>

        <p>
          You can also load a preset from the sidebar to help you visualize the
          end goal. Your work will be saved in your browser's local storage and
          will persist across reload. You can also import and export your work
          as a JSON file.
        </p>

        <div className="help-gears">
          <div className="hp-row hp-row-1">
            <span className="hp hp-1">
              <Gear />
            </span>
            <span className="hp hp-2 hp--small">
              <Gear />
            </span>
            <span className="hp hp-3">
              <Gear />
            </span>
            <span className="hp hp-4 hp--small">
              <Gear />
            </span>
            <span className="hp hp-5">
              <Gear />
            </span>
          </div>

          <p>Gears that are next to each other will not get any faster.</p>

          <div className="hp-row hp-row-2">
            <span className="hp">
              <Gear />
            </span>
            <span className="hp">
              <Gear />
            </span>
            <span className="hp hp--white hp--small">
              <Gear />
            </span>
            <span className="hp">
              <Gear />
            </span>
            <span className="hp hp--white hp--small">
              <Gear />
            </span>
            <span className="hp">
              <Gear />
            </span>
          </div>

          <p>
            Gears that on top of each other, or "fixed", can be used to increase
            or decrease the rate of rotation.
          </p>
        </div>

        <hr />
        <h2>Gear Options</h2>
        <p>
          <b>Teeth:</b> Changes the number of teeth for that gear.
        </p>
        <p>
          <b>Orientation:</b> Changes the angle of the gear relative to the
          previous gear. Fixed gears are always on top of the previous gear, so
          this setting is not avaible for fixed gears.
        </p>
        <p>
          <b>Hand:</b> Assigned a clock hand to the gear (hours, minutes, or
          seconds). A gear can only be assigne a single clock hand.
        </p>
        <hr />

        <div className="icon-explanations">
          <div className="icon-explanation">
            <GearUnfixed />
            <span>Selected gear is position next to previous gear.</span>
          </div>
          <div className="icon-explanation">
            <GearFixed />
            <span>
              Selected gear is "fixed" on top of the previous gear, so they
              rotate at the same speed and direction. Use to increase or
              decrease speed of the next gear.
            </span>
          </div>
          <div className="icon-explanation">
            <Battery />
            <span>
              "Smooth" motion mode. The driving gear will rotate at a continuous
              rate, set in RPM (rotation per minute).
            </span>
          </div>
          <div className="icon-explanation">
            <Pendulum />
            <span>
              "Pendulum" motion mode. The driving gear will rotate in steps, as
              driven by a pendulum and escapement mechanism, set in Hertz (steps
              per seconds).
            </span>
          </div>
          <div className="icon-explanation">
            <Export />
            <span>Export project as a JSON file.</span>
          </div>
          <div className="icon-explanation">
            <Import />
            <span>Import JSON file of a previously exported project.</span>
          </div>
          <div className="icon-explanation">
            <Reset />
            <span>Resets the project to a blank canvas.</span>
          </div>
        </div>

        <hr />

        <h4>Who made this?</h4>

        <p className="small">
          This web app is a hobby project designed and developed by{" "}
          <a
            href="https://www.jamescarmichael.ca/"
            target="_blank"
            rel="noreferrer"
          >
            James Carmichael
          </a>
          . The inspiration came from building a wooden pendulum clock kit, and
          being curious about the escapement mechanism and gearing. The visual
          style was heavily inspired by{" "}
          <a href="https://geargenerator.com/" target="_blank" rel="noreferrer">
            GearGenerator.com
          </a>
          . You can this this project's code on{" "}
          <a
            href="https://github.com/updownupdown/clockworks"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </Modal>
  );
};
