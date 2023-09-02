import "./Workout.scss";
import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { getDoc, doc } from "firebase/firestore";

const Workout = ({ workoutID }) => {
  const [showModal, setShowModal] = useState(false);
  const [rounds, setRounds] = useState(0);
  const [movements, setMovements] = useState([]);
  const [repetitions, setRepetitions] = useState([]);

  useEffect(() => {
    const getWorkout = async () => {
      const fetchWorkout = await getDoc(doc(db, "workouts", workoutID));
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

  if (movements.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="button">
      <button className="button__btn" onClick={() => setShowModal(true)}>
        Show Workout
      </button>
      {showModal ? (
        <div className="workout">
          <div className="workout__container-content">
            <div className="workout__close">
              <span
                className="workout__close-btn"
                onClick={() => setShowModal(false)}
              >
                &times;
              </span>
            </div>
            <h1 className="workout__heading">Workout</h1>
            <div className="workout__content">
              {rounds !== 0 ? (
                <p className="workout__rounds">{rounds} rounds for time of:</p>
              ) : (
                <p className="workout__sub-heading">For Time:</p>
              )}
              <div>
                {movements.map((movement, index) => {
                  return (
                    <p key={index} className="workout__movement">
                      {movement}: {repetitions[index]}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Workout;
