import "./Match.scss";
import { useState, useEffect } from "react";
import ProfilePic from "../../assets/images/Ivan Salgado  - Software Engineering - June Miami 2023.jpg";
import { db } from "../../firebase-config";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const Match = ({ matchID, updateDataFromMatch }) => {
  const loggedInUser =
    sessionStorage.getItem("user") || localStorage.getItem("user");
  const [showModal, setShowModal] = useState(false);
  // const [userData, setUserData] = useState(null);
  const [movement, setMovement] = useState("Pull-ups");
  const [movementSubmitted, setMovementSubmitted] = useState(false);
  const [matchData, setMatchData] = useState(true);

  const handleChange = (e) => {
    setMovement(e.target.value);
  };

  const submitMovement = async (e) => {
    e.preventDefault();

    try {
      const userDoc = doc(db, "users", loggedInUser);
      const matchDoc = doc(db, "matches", matchID);

      await Promise.all([
        updateDoc(userDoc, { movement: movement }),
        updateDoc(matchDoc, { [`${loggedInUser}.userSelected`]: true }),
      ]);

      setMovementSubmitted(true);
      updateDataFromMatch(matchData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button className="btn" onClick={() => setShowModal(true)}>
        Show Matching
      </button>
      {showModal ? (
        <div className="match">
          <div className="match__container-content">
            <div className="match__close">
              <span
                className="match__close-btn"
                onClick={() => setShowModal(false)}
              >
                &times;
              </span>
            </div>
            <h1 className="match__heading">Matched</h1>
            <div className="match__content">
              <div className="match__users">
                <img
                  className="match__user"
                  src={ProfilePic}
                  alt="Placeholder"
                />
                <img
                  className="match__user"
                  src={ProfilePic}
                  alt="Placeholder"
                />
              </div>
              {movementSubmitted ? (
                <div>
                  <p className="match__submitted">
                    Movement Submitted: {movement}
                  </p>
                  <p className="match__submitted">
                    Waiting for Opponent's Selection
                  </p>
                </div>
              ) : (
                <form onSubmit={submitMovement} className="match__form">
                  <label className="match__label" for="movement">
                    Select Movement
                  </label>
                  <select
                    className="match__select"
                    name="movements"
                    id="movement"
                    onChange={handleChange}
                    value={movement}
                  >
                    <option value="Pull-ups">Pull-ups</option>
                    <option value="Push-ups">Push-ups</option>
                    <option value="Run">Run</option>
                    <option value="Sit-ups">Sit-ups</option>
                    <option value="Air Squats">Air Squats</option>
                  </select>
                  <button type="submit" className="btn">
                    Submit Movement
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Match;
