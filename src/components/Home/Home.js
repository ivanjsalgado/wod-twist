import { createContext, useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { getDoc, doc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import BarGraph from "../BarGraph/BarGraph";
import "./Home.scss";
import ProfilePic from "../../assets/images/Ivan Salgado  - Software Engineering - June Miami 2023.jpg";
import History from "../../assets/images/noun-recent-1076890.svg";
import Match from "../../assets/images/noun-group-4213640.svg";
import Leaderboard from "../../assets/images/Adobe_test.svg";
import Header from "../Header/Header";
import Modal from "../Modal/Modal";

export default function Home() {
  const loggedInUser = localStorage.getItem("user");

  const navigate = useNavigate();
  const [user, setUser] = useState(loggedInUser);

  const leaderboardClick = () => {
    navigate("/leaderboard");
  };

  const historyClick = () => {
    // Include the props to pass into history, probably UID
    navigate("/history");
  };

  useEffect(() => {
    const getRandom = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user));

        if (snap.exists()) {
          console.log(snap.data());
        } else {
          console.log("No such document");
        }
      } catch (err) {
        console.log(err);
      }
    };
    getRandom();
  }, []);
  return (
    <div className="home">
      <Header />
      <div className="home__deadline">
        <h1 className="home__title">Workout Deadline</h1>
        <p className="home__time">99:99:99</p>
      </div>
      <div className="home__workout-container">
        <Modal />
      </div>
      <div className="home__graph">
        <BarGraph />
      </div>
      <div className="home__bot-container">
        <img
          onClick={historyClick}
          className="home__footer-btn"
          src={History}
          alt="History Icon"
        />
        <img className="home__footer-btn" src={Match} alt="History Icon" />
        <img
          onClick={leaderboardClick}
          className="home__footer-btn"
          src={Leaderboard}
          alt="History Icon"
        />
      </div>
    </div>
  );
}
