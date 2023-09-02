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
  const loggedInUser =
    sessionStorage.getItem("user") || localStorage.getItem("user");
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [matchID, setMatchID] = useState("");
  const isUserLoading = userData === null;
  const [queued, setQueued] = useState(false);

  const leaderboardClick = () => {
    navigate("/leaderboard");
  };

  const historyClick = () => {
    navigate("/history");
  };

  const handleQueueClick = async () => {
    if (userData.matched) return;

    try {
      const changeQueue = !userData.queue;
      // Need for the button to turn green when queueing
      setUserData({ ...userData, queue: changeQueue });
      const queueDoc = doc(db, "users", loggedInUser);
      await updateDoc(queueDoc, { queue: changeQueue });
      setQueued(changeQueue);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!queued) return;

    const queueRef = doc(db, "queueList", "documents");

    const updateQueue = async (action) => {
      try {
        const queueSnap = await getDoc(queueRef);
        const documents = queueSnap.data().entries;
        const queueDoc = doc(db, "queueList", loggedInUser);

        if (action === "add") {
          await setDoc(queueDoc, { queue: userData.queue });
          await updateDoc(queueRef, { entries: documents + 1 });
        } else if (action === "delete") {
          await deleteDoc(queueDoc);
          await updateDoc(queueRef, { entries: documents - 1 });
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (userData.queue) {
      updateQueue("add");
    } else {
      updateQueue("delete");
    }
  }, [queued]);

  const getUserData = async () => {
    try {
      const userDoc = doc(db, "users", loggedInUser);
      const snap = await getDoc(userDoc);

      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setMatchID(data.match);
        setQueued(data.queue);
        console.log(userData);
      } else {
        console.log("User was not found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserData();
  }, [loggedInUser]);

  useEffect(() => {
    if (matchID === "") return;
    const unsub = onSnapshot(
      doc(db, "matches", matchID),
      async (currentMatch) => {
        try {
          const matchRef = doc(db, "matches", matchID);
          const data = await getDoc(matchRef);
          const usersMatchData = data.data();

          const readyToGenerate =
            usersMatchData[loggedInUser].userSelected &&
            usersMatchData[userData.opponent].userSelected;

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
            const opponentName = getOpponentMovement.data().name;
            const workoutsRef = collection(db, "workouts");
            const workoutsSnapshot = await getDocs(workoutsRef);
            const workouts = workoutsSnapshot.docs.map((workoutDoc) => ({
              ...workoutDoc.data(),
              id: workoutDoc.id,
            }));
            const viableWorkouts = workouts.filter(
              (workout) =>
                workout[opponentMovement] && workout[userData.movement]
            );
            const index = Math.floor(Math.random() * viableWorkouts.length);
            const randomWorkoutID = viableWorkouts[index].id;

            const userRef = doc(db, "users", loggedInUser);
            await Promise.all([
              updateDoc(userRef, {
                workoutID: randomWorkoutID,
                opponentName: opponentName,
              }),
              updateDoc(opponentRef, {
                workoutID: randomWorkoutID,
                opponentName: userData.name,
              }),
              updateDoc(matchRef, { [`${loggedInUser}.userSelected`]: false }),
            ]);
          }

          if (readyToLog) {
            const userRefAgain = doc(db, "users", loggedInUser);
            const matchRefAgain = doc(db, "matches", matchID);
            const fetchedMovements = await getDoc(matchRefAgain);
            const movementsData = fetchedMovements.data();
            let result = "";
            let points = 0;

            if (
              movementsData[loggedInUser].userTime <
              movementsData[loggedInUser].opponentTime
            ) {
              result = "Victory";
              points = -20;
            } else if (
              movementsData[loggedInUser].userTime >
              movementsData[loggedInUser].opponentTime
            ) {
              result = "Defeat";
              points = 20;
            } else {
              result = "Tie";
            }

            await Promise.all([
              updateDoc(matchRefAgain, {
                [`${loggedInUser}.retrievedResult`]: true,
              }),
              updateDoc(userRefAgain, {
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
                  time: Number(movementsData[loggedInUser].userTime),
                  opponentTime: Number(
                    movementsData[loggedInUser].opponentTime
                  ),
                  opponentName: userData.opponentName,
                  result,
                }),
              }),
            ]);
          }

          if (readyToDelete) {
            const deleteDocRef = doc(db, "matches", userData.match);
            await deleteDoc(deleteDocRef);
          }
        } catch (error) {
          console.log(error);
        }
      }
    );
  }, [matchID]);

  if (isUserLoading) {
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
        <BarGraph history={userData.history} />
      </div>
      <div className="home__bot-container">
        <img
          onClick={historyClick}
          className="home__footer-btn"
          src={History}
          alt="History Icon"
        />
        <img
          onClick={handleQueueClick}
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
