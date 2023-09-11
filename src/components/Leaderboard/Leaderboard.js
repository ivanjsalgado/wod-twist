import "./Leaderboard.scss";
import Back from "../../assets/images/Back_Button.png";
import { Link, useLocation } from "react-router-dom";
import Ranking from "../Ranking/Ranking";
import { db } from "../../firebase-config";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";

function Leaderboard() {
  const location = useLocation();
  const userPhoto = location.state.userPhoto;
  const [userList, setUserList] = useState([]);
  const userCollectionRef = collection(db, "users");

  const getUserList = async () => {
    try {
      const data = await getDocs(userCollectionRef);
      const userData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const sortUsers = userData.sort((a, b) => {
        return b.points - a.points;
      });
      setUserList(sortUsers);
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
          <img className="leaderboard__back" src={Back} alt="Back Icon" />
        </Link>
        <h1 className="leaderboard__heading">Leaderboard</h1>
        <img
          className="leaderboard__photo"
          src={userPhoto}
          alt="User Profile"
        />
      </div>
      {userList.map((user, index) => (
        <Ranking
          key={index + 1}
          index={index + 1}
          name={user.name}
          points={user.points}
          photo={user.photoURL}
        />
      ))}
    </div>
  );
}

export default Leaderboard;
