import "./Ranking.scss";
import Profile from "../../assets/images/Ivan Salgado  - Software Engineering - June Miami 2023.jpg";
function Ranking({ name, points, index, key }) {
  return (
    <div className="ranking">
      <div className="ranking__container">
        <img className="ranking__pic" src={Profile} alt="User" />
        <div className="ranking__container-user">
          <p>{name}</p>
          <p>{points} Points</p>
        </div>
        <div className="ranking__rank">
          <p>{index}</p>
        </div>
      </div>
    </div>
  );
}

export default Ranking;
