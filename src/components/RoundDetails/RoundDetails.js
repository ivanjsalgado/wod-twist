import "./RoundDetails.scss";
import ProfilePic from "../../assets/images/Ivan Salgado  - Software Engineering - June Miami 2023.jpg";

function RoundDetails() {
  return (
    <div className="round">
      <div className="round__container-one">
        <div className="round__userOne round__userOne--green">
          <img
            className="round__picture"
            src={ProfilePic}
            alt="User One Profile"
          />
          <h2 className="round__userName">Ivan</h2>
          <p>9:33</p>
        </div>
        <div className="round__result-container">
          <div className="round__wl-container">
            <h1 className="round__result">W</h1>
            <h1 className="round__result round__result--margin">-</h1>
            <h1 className="round__result">L</h1>
          </div>
          <button className="round__btn">See Workout</button>
        </div>
        <div className="round__userTwo round__userTwo--mercury">
          <img
            className="round__picture"
            src={ProfilePic}
            alt="User Two Profile"
          />
          <h2 className="round__userName">Ivan</h2>
          <p>9:33</p>
        </div>
      </div>
    </div>
  );
}

export default RoundDetails;
