import React from "react";
import Close from "../Icons/Close";
import "./Modal.scss";

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

export const Modal = ({ children, onClose }: Props) => {
  return (
    <div className="modal-wrap">
      <div className="modal">
        <button className="modal__close" onClick={onClose}>
          <Close />
        </button>

        <div className="modal__content">{children}</div>
      </div>
      <div className="modal-mask" onClick={onClose} />
    </div>
  );
};
