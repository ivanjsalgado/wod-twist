import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { getDoc, doc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import BarGraph from "../BarGraph/BarGraph";
import "./Home.scss";
import ProfilePic from "../../assets/images/Ivan Salgado  - Software Engineering - June Miami 2023.jpg";
import History from "../../assets/images/noun-recent-1076890.svg";
import Match from "../../assets/images/noun-group-4213640.svg";
import Leaderboard from "../../assets/images/noun-leaderboard-2696196.png";

export default function Home() {
  const [random, setRandom] = useState("");
  let location = useLocation();

  const handleClick = () => {
    console.log("Click");
  };

  useEffect(() => {
    const getRandom = async () => {
      try {
        const snap = await getDoc(doc(db, "users", location.state));

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
      <div className="home__top-container">
        <img className="home__profile" src={ProfilePic} alt="Profile Pic" />
        <div className="home__logo"></div>
        <div className="home__hamburger"></div>
      </div>
      <div className="home__deadline">
        <h1 className="home__title">Workout Deadline</h1>
        <p className="home__time">99:99:99</p>
      </div>
      <div className="home__workout-container">
        <button className="home__workout">See Workout</button>
      </div>
      <div className="home__graph">
        <BarGraph />
      </div>
      <div className="home__bot-container">
        <img
          onClick={handleClick}
          className="home__footer-btn"
          src={History}
          alt="History Icon"
        />
        <img className="home__footer-btn" src={Match} alt="History Icon" />
        <img
          className="home__footer-btn home__footer-btn--margin-right"
          src={Leaderboard}
          alt="History Icon"
        />
      </div>
    </div>
  );
}
