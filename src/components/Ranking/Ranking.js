import "./Ranking.scss";
import Profile from "../../assets/images/Ivan Salgado  - Software Engineering - June Miami 2023.jpg";
function Ranking({ name, points, index, photo }) {
  return (
    <div className="ranking">
      <div
        className={
          index % 2 === 0 ? "ranking__container" : "ranking__container--color"
        }
      >
        <div className="ranking__container-two">
          <p className="ranking__rank">{index}</p>
          <img className="ranking__pic" src={photo} alt="User" />
          <p className="ranking__name">{name}</p>
        </div>
        <div className="ranking__container-points">
          <p className="ranking__points">{points}</p>
        </div>
      </div>
    </div>
  );
}

export default Ranking;
