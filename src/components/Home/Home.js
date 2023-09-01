import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import {
  getDocs,
  getDoc,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  collection,
  arrayUnion,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import BarGraph from "../BarGraph/BarGraph";
import "./Home.scss";
import History from "../../assets/images/noun-recent-1076890.svg";
import MatchIcon from "../../assets/images/noun-group-4213640.svg";
import Match from "../Match/Match";
import Leaderboard from "../../assets/images/Adobe_test.svg";
import Header from "../Header/Header";
import Modal from "../Modal/Modal";

export default function Home() {
  const loggedInUser = localStorage.getItem("user");
  const navigate = useNavigate();
  const [user, setUser] = useState(loggedInUser);
  const [userData, setUserData] = useState(null);
  const [matchID, setMatchID] = useState("");
  const [matchTime, setMatchTime] = useState(0);
  const conditionUser = userData === null ? true : false;
  const [queued, setQueued] = useState(false);

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
      const queueDoc = doc(db, "users", user);
      await updateDoc(queueDoc, { queue: changeQueue });
      try {
        setQueued(true);
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
          await setDoc(queueDoc, { queue: userData.queue });
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
          setMatchTime(data.matchTime);
          console.log(userData);
        } else {
          console.log("No such document");
        }
      } catch (err) {
        console.log(err);
      }
    };
    getRandom();
  }, [conditionUser, queued]);

  useEffect(() => {
    if (matchID === "") return;
    const unsub = onSnapshot(doc(db, "matches", matchID), (currentMatch) => {
      const readyForWorkout = async () => {
        try {
          const matchRef = doc(db, "matches", matchID);
          const data = await getDoc(matchRef);
          const usersMatchData = data.data();
          const readyToGenerate =
            usersMatchData[loggedInUser].userSelected === true &&
            usersMatchData[userData.opponent].userSelected === true;
          const readyToLog =
            usersMatchData[loggedInUser].userTime !== 0 &&
            usersMatchData[userData.opponent].userTime !== 0;
          const readyToDelete =
            usersMatchData[loggedInUser].retrievedResult &&
            usersMatchData[userData.opponent].retrievedResult;
          if (readyToGenerate) {
            const opponentRef = doc(db, "users", userData.opponent);
            const getOpponentMovement = await getDoc(opponentRef);
            const opponentMovement = getOpponentMovement.data().movement;
            const workoutsRef = collection(db, "workouts");
            const workoutsData = await getDocs(workoutsRef);
            const workouts = workoutsData.docs.map((workout) => ({
              ...workout.data(),
              id: workout.id,
            }));
            const viableWorkouts = workouts.filter((workout) => {
              return workout[opponentMovement] && workout[userData.movement];
            });
            const index = Math.floor(Math.random() * viableWorkouts.length);
            const randomWorkoutID = viableWorkouts[index].id;
            const userRef = doc(db, "users", loggedInUser);
            await updateDoc(userRef, { workoutID: randomWorkoutID });
            await updateDoc(opponentRef, { workoutID: randomWorkoutID });
            await updateDoc(matchRef, {
              [`${loggedInUser}.userSelected`]: false,
            });
          }
          if (readyToLog) {
            const userRefAgain = doc(db, "users", loggedInUser);
            const matchRefAgain = doc(db, "matches", matchID);
            const fetchedMovements = await getDoc(matchRefAgain);
            const movementsData = fetchedMovements.data();
            let result = "";
            let points;
            if (
              movementsData[loggedInUser].userTime >
              movementsData[loggedInUser].opponentTime
            ) {
              result = "Lose";
              points = -20;
            } else if (
              movementsData[loggedInUser].userTime <
              movementsData[loggedInUser].opponentTime
            ) {
              result = "Win";
              points = 20;
            } else {
              result = "Tie";
              points = 0;
            }
            await updateDoc(matchRefAgain, {
              [`${loggedInUser}.retrievedResult`]: true,
            });
            await updateDoc(userRefAgain, {
              match: "",
              matchTime: 0,
              matched: false,
              movement: "",
              opponent: "",
              workoutID: "",
              points: userData.points + points,
              history: arrayUnion({
                movements: movementsData[loggedInUser].movements,
                repetitions: movementsData[loggedInUser].repetitions,
                workoutID: userData.workoutID,
                result: result,
              }),
            });
          }
          if (readyToDelete) {
            const deleteDocRef = doc(db, "matches", userData.match);
            await deleteDoc(deleteDocRef);
          }
        } catch (error) {
          console.log(error);
        }
        // return () => unsub();
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
        {userData.matched && userData.workoutID === "" ? (
          <Match data={userData} />
        ) : (
          <></>
        )}
        {userData.workoutID !== "" ? <Modal data={userData} /> : <></>}
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
          className={
            userData.queue ? "home__footer-btn-active" : "home__footer-btn"
          }
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
