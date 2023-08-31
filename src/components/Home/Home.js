import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import {
  getDoc,
  doc,
  update,
  updateDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import BarGraph from "../BarGraph/BarGraph";
import "./Home.scss";
import ProfilePic from "../../assets/images/Ivan Salgado  - Software Engineering - June Miami 2023.jpg";
import History from "../../assets/images/noun-recent-1076890.svg";
import MatchIcon from "../../assets/images/noun-group-4213640.svg";
import Match from "../Match/Match";
import Leaderboard from "../../assets/images/Adobe_test.svg";
import Header from "../Header/Header";
import Modal from "../Modal/Modal";
import { all } from "axios";

export default function Home() {
  const loggedInUser = localStorage.getItem("user");
  const navigate = useNavigate();
  const [user, setUser] = useState(loggedInUser);
  const [userData, setUserData] = useState(null);
  const [matchID, setMatchID] = useState("");
  const conditionUser = userData === null ? true : false;

  const leaderboardClick = () => {
    navigate("/leaderboard");
  };

  const historyClick = () => {
    navigate("/history");
  };

  const queueClick = () => {
    if (userData.matched) return;
    const updateQueue = async () => {
      const changeQueue = !userData.queue;
      setUserData({ ...userData, queue: changeQueue });
      try {
        const queueDoc = doc(db, "users", user);
        await updateDoc(queueDoc, { queue: changeQueue });
      } catch (error) {
        console.log(error);
      }
    };
    updateQueue();
  };

  useEffect(() => {
    if (!userData) return;
    if (userData.queue) {
      const addQueue = async () => {
        const queueRef = doc(db, "queueList", "documents");
        const queueSnap = await getDoc(queueRef);
        const documents = queueSnap.data().entries;
        try {
          const queueDoc = doc(db, "queueList", user);
          setDoc(queueDoc, { queue: userData.queue });
          await updateDoc(queueRef, { entries: documents + 1 });
        } catch (error) {
          console.log(error);
        }
      };
      addQueue();
    } else {
      const deleteQueue = async () => {
        const queueRef = doc(db, "queueList", "documents");
        const queueSnap = await getDoc(queueRef);
        const documents = queueSnap.data().entries;
        try {
          const queueDoc = doc(db, "queueList", user);
          await deleteDoc(queueDoc);
          await updateDoc(queueRef, { entries: documents - 1 });
        } catch (error) {
          console.log(error);
        }
      };
      deleteQueue();
    }
  }, [userData]);

  useEffect(() => {
    const getRandom = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user));

        if (snap.exists()) {
          let data = snap.data();
          setUserData(data);
          setMatchID(data.match);
          console.log(userData);
        } else {
          console.log("No such document");
        }
      } catch (err) {
        console.log(err);
      }
    };
    getRandom();
  }, [conditionUser]);

  useEffect(() => {
    if (matchID === "") return;
    const unsub = onSnapshot(doc(db, "matches", matchID), (currentMatch) => {
      const readyForWorkout = async () => {
        try {
          const matchRef = doc(db, "matches", matchID);
          const data = await getDoc(matchRef);
          const allPropertiesAreTrue = Object.values(data.data()).every(
            (value) => value === true
          );
          if (allPropertiesAreTrue) {
            const opponentRef = await doc(db, "users", userData.opponent);
            const getOpponentMovement = await getDoc(opponentRef);
            const movement = getOpponentMovement.data().movement;
            console.log(movement);
          }
        } catch (error) {
          console.log(error);
        }
      };
      readyForWorkout();
    });
  }, [matchID]);

  if (conditionUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home">
      <Header />
      <div className="home__deadline">
        <h1 className="home__title">Workout Deadline</h1>
        <p className="home__time">99:99:99</p>
      </div>
      <div className="home__workout-container">
        {userData.matched ? <Match data={userData} /> : <></>}
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
        <img
          onClick={queueClick}
          className="home__footer-btn"
          src={MatchIcon}
          alt="History Icon"
        />
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
