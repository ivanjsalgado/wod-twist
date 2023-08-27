import "./Leaderboard.scss";
import BackAg from "../../assets/images/Back_Again.png";
import { Link } from "react-router-dom";
import Profile from "../../assets/images/Ivan Salgado  - Software Engineering - June Miami 2023.jpg";
import Ranking from "../Ranking/Ranking";
function Leaderboard() {
  return (
    <div className="leaderboard">
      <div className="leaderboard__header">
        <Link
          style={{ "text-decoration": "none", display: "flex" }}
          to={"/home"}
        >
          <img className="leaderboard__back" src={BackAg} alt="Back Icon" />
        </Link>
        <h1 className="leaderboard__heading">Leaderboard</h1>
        <img className="leaderboard__photo" src={Profile} alt="User Profile" />
      </div>
      <Ranking />
      <Ranking />
    </div>
  );
}

export default Leaderboard;
