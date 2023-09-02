import "./Leaderboard.scss";
import BackAg from "../../assets/images/Back_Again.png";
import { Link } from "react-router-dom";
import Profile from "../../assets/images/Ivan Salgado  - Software Engineering - June Miami 2023.jpg";
import Ranking from "../Ranking/Ranking";
import { db } from "../../firebase-config";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";

function Leaderboard() {
  const [userList, setUserList] = useState([]);
  const userCollectionRef = collection(db, "users");

  const getUserList = async () => {
    try {
      const data = await getDocs(userCollectionRef);
      const userData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUserList(userData);
      userList.sort((a, b) => {
        return b.points - a.points;
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  if (userList.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard__header">
        <Link style={{ textDecoration: "none", display: "flex" }} to={"/home"}>
          <img className="leaderboard__back" src={BackAg} alt="Back Icon" />
        </Link>
        <h1 className="leaderboard__heading">Leaderboard</h1>
        <img className="leaderboard__photo" src={Profile} alt="User Profile" />
      </div>
      {userList.map((user, index) => (
        <Ranking
          key={index}
          index={index + 1}
          name={user.name}
          points={user.points}
        />
      ))}
    </div>
  );
}

export default Leaderboard;
