import "./Modal.scss";
import { useState } from "react";

const Modal = () => {
  const [showModal, setShowModal] = useState(false);
  const [minutes, setMinutes] = useState(null);
  const [seconds, setSeconds] = useState(null);

  const submit = () => {};
  return (
    <div>
      <button className="btn" onClick={() => setShowModal(true)}>
        Show Workout
      </button>
      {showModal ? (
        <div className="modal">
          <div className="modal__container-content">
            <div className="modal__close">
              <span
                className="modal__close-btn"
                onClick={() => setShowModal(false)}
              >
                &times;
              </span>
            </div>
            <h1 className="modal__heading">Workout</h1>
            <div className="modal__content">
              <p className="modal__sub-heading">For Time:</p>
              <p className="modal__rounds">X rounds for time of:</p>
              <p className="modal__movement">5 pull - ups</p>
              <p className="modal__movement">10 push - ups</p>
              <p className="modal__movement">15 Air Squats</p>
            </div>
            <form className="modal__form" onSubmit={submit}>
              <label className="modal__label">Minutes</label>
              <input
                className="modal__form-input"
                type="number"
                placeholder="Minutes"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
              <label className="modal__label">Seconds</label>
              <input
                className="modal__form-input"
                type="number"
                placeholder="Seconds"
                value={seconds}
                onChange={(e) => setMinutes(e.target.value)}
              />
              <button className="btn">Submit Time</button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Modal;
