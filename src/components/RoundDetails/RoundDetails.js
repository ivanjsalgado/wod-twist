import "./RoundDetails.scss";
import ProfilePic from "../../assets/images/Ivan Salgado  - Software Engineering - June Miami 2023.jpg";
import Workout from "../Workout/Workout";

function RoundDetails({
  result,
  opponentTime,
  time,
  name,
  opponentName,
  workoutID,
}) {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  let opponentMinutes = Math.floor(opponentTime / 60);
  let opponentSeconds = opponentTime % 60;

  function minTwoDigits(n) {
    return (n < 10 ? "0" : "") + n;
  }

  return (
    <div className="round">
      <div
        className={
          result === "Victory" || result === "Tie"
            ? "round__container-win"
            : "round__container-lose"
        }
      >
        <div className="round__user">
          <img
            className="round__picture"
            src={ProfilePic}
            alt="User One Profile"
          />
          <h2 className="round__userName">{name}</h2>
          <p>
            {minTwoDigits(minutes)}:{minTwoDigits(seconds)}
          </p>
        </div>
        <div className="round__result-container">
          <div className="round__wl-container">
            <h1 className="round__result">{result}</h1>
          </div>
          <Workout workoutID={workoutID} />
        </div>
        <div className="round__user">
          <img
            className="round__picture"
            src={ProfilePic}
            alt="User Two Profile"
          />
          <h2 className="round__userName">{opponentName}</h2>
          <p>
            {minTwoDigits(opponentMinutes)}:{minTwoDigits(opponentSeconds)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default RoundDetails;
