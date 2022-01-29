import React from "react";
import Close from "../Icons/Close";
import "./Welcome.scss";

interface Props {
  onClose: () => void;
  setShowHelp: () => void;
}

export const Welcome = ({ onClose, setShowHelp }: Props) => {
  return (
    <div className="welcome">
      <h2>Welcome to Clockworks!</h2>
      <p>
        Build your own clock by adding and connecting gears together in the
        right configuration! Press the help icon in the sidebar to{" "}
        <button
          className="learn-more"
          onClick={() => {
            setShowHelp();
            onClose();
          }}
        >
          learn more and get help!
        </button>
      </p>

      <button className="close-button" onClick={onClose}>
        <Close />
      </button>
    </div>
  );
};
