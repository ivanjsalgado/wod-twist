import "./Ranking.scss";
import Profile from "../../assets/images/Ivan Salgado  - Software Engineering - June Miami 2023.jpg";
function Ranking() {
  return (
    <div className="ranking">
      <div className="ranking__container">
        <img className="ranking__pic" src={Profile} alt="User" />
        <div className="ranking__container-user">
          <p>Ivan Salgado</p>
          <p>300 Points</p>
        </div>
        <div className="ranking__rank">
          <p>1st</p>
        </div>
      </div>
    </div>
  );
}

export default Ranking;
