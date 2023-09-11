import "./Modal.scss";
import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { getDoc, doc, updateDoc } from "firebase/firestore";

const Modal = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [movements, setMovements] = useState([]);
  const [repetitions, setRepetitions] = useState([]);
  const loggedInUser = localStorage.getItem("user");
  const [userData, setUserData] = useState(data);
  const [timeSubmitted, setTimeSubmitted] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const getWorkout = async () => {
      const fetchWorkout = await getDoc(doc(db, "workouts", data.workoutID));
      const workout = fetchWorkout.data();

      if (workout.hasOwnProperty("Rounds")) {
        setRounds(workout["Rounds"]);
        delete workout["Rounds"];
      }

      setMovements(Object.keys(workout));
      setRepetitions(Object.values(workout));
    };
    getWorkout();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const matchDoc = doc(db, "matches", data.match);
    const userDoc = doc(db, "users", loggedInUser);

    setTimeSubmitted(true);

    try {
      const userTimeInSeconds = Number(minutes * 60) + Number(seconds);

      await Promise.all([
        updateDoc(matchDoc, {
          [`${loggedInUser}.userTime`]: userTimeInSeconds,
          [`${loggedInUser}.movements`]: movements,
          [`${loggedInUser}.repetitions`]: repetitions,
          [`${data.opponent}.opponentTime`]: userTimeInSeconds,
        }),
        updateDoc(userDoc, {
          matchTime: userTimeInSeconds,
        }),
      ]);

      setUserData((prevState) => ({
        ...prevState,
        matchTime: userTimeInSeconds,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  if (movements.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button className="btn" onClick={() => setShowModal(true)}>
        Show Workout
      </button>
      {showModal ? (
        <div className="modal">
          <div className="modal__container-content">
            <div className="modal__close">
              <span className="modal__close-btn" onClick={closeModal}>
                &times;
              </span>
            </div>
            <h1 className="modal__heading">WOD</h1>
            <div className="modal__content">
              {rounds !== 0 ? (
                <p className="modal__rounds">{rounds} rounds for time of:</p>
              ) : (
                <p className="modal__sub-heading">For Time</p>
              )}
              <div>
                {movements.map((movement, index) => {
                  return (
                    <p key={index} className="modal__movement">
                      {movement}: {repetitions[index]}
                    </p>
                  );
                })}
              </div>
            </div>
            {data.matchTime !== 0 || timeSubmitted ? (
              <p className="modal__submitted">Time has been submitted</p>
            ) : (
              <form className="modal__form" onSubmit={submit}>
                <div className="modal__form-container">
                  <div className="modal__form-minutes">
                    <label className="modal__label">Minutes</label>
                    <input
                      className="modal__form-input"
                      type="number"
                      placeholder="Minutes"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                    />
                  </div>
                  <div className="modal__form-seconds">
                    <label className="modal__label">Seconds</label>
                    <input
                      className="modal__form-input"
                      type="number"
                      placeholder="Seconds"
                      value={seconds}
                      onChange={(e) => setSeconds(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal__form-btn">
                  <button className="btn">Submit Time</button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Modal;
