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
import History from "../../assets/images/History.svg";
import MatchIcon from "../../assets/images/Match.svg";
import Loading from "../../assets/images/loading.png";
import Match from "../Match/Match";
import Leaderboard from "../../assets/images/Leaderboard.svg";
import Header from "../Header/Header";
import Modal from "../Modal/Modal";

export default function Home() {
  const loggedInUser =
    sessionStorage.getItem("user") || localStorage.getItem("user");
  const loggedDoc = collection(db, loggedInUser);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [matchID, setMatchID] = useState("");
  const isUserLoading = userData === null;
  const [queued, setQueued] = useState(false);
  const [matched, setMatched] = useState(false);
  const [currentWorkoutID, setCurrentWorkoutID] = useState("");
  const [workout, setWorkout] = useState(false);
  const [generateResult, setGenerateResult] = useState(false);

  const updateDataInParent = (newData) => {
    setWorkout(newData);
  };

  const leaderboardClick = () => {
    navigate("/leaderboard", {
      state: {
        userPhoto: userData.photoURL,
      },
    });
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

    if (queued) {
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
        setMatched(data.matched);
        setCurrentWorkoutID(data.workoutID);
      } else {
        console.log("User was not found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(loggedDoc, (userSnapshot) => {
      getUserData();
    });
    return () => {
      unsubscribe();
    };
  }, [
    loggedInUser,
    matched,
    generateResult,
    currentWorkoutID,
    queued,
    workout,
  ]);

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
            usersMatchData[loggedInUser].movement !== "" &&
            usersMatchData[userData.opponent].movement !== "" &&
            currentWorkoutID === "";

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
            const workoutsSnapshot = await getDocs(workoutsRef);
            const workouts = workoutsSnapshot.docs.map((workoutDoc) => ({
              ...workoutDoc.data(),
              id: workoutDoc.id,
            }));

            const viableWorkouts = workouts.filter(
              (workout) =>
                workout[userData.movement] && workout[opponentMovement]
            );

            const index = Math.floor(Math.random() * viableWorkouts.length);
            const randomWorkoutID = viableWorkouts[index].id;
            if (randomWorkoutID !== "") {
              setCurrentWorkoutID(randomWorkoutID);
              updateDoc(matchRef, { [`${loggedInUser}.userSelected`]: false });
            }

            const userRef = doc(db, "users", loggedInUser);
            await Promise.all([
              updateDoc(userRef, {
                workoutID: randomWorkoutID,
              }),
              updateDoc(opponentRef, {
                workoutID: randomWorkoutID,
              }),
            ]);
            window.location.reload();
          }

          if (readyToLog) {
            const userRefAgain = doc(db, "users", loggedInUser);
            const userOpponentRef = doc(db, "users", userData.opponent);
            const userOpponentData = await getDoc(userOpponentRef);
            const opponentSnapData = userOpponentData.data();
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
              points = 20;
            } else if (
              movementsData[loggedInUser].userTime >
              movementsData[loggedInUser].opponentTime
            ) {
              result = "Defeat";
              points = -20;
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
                opponentName: "",
                opponentPhoto: "",
                workoutID: "",
                points: userData.points + points,
                history: arrayUnion({
                  movements: movementsData[loggedInUser].movements,
                  repetitions: movementsData[loggedInUser].repetitions,
                  workoutID: userData.workoutID,
                  time: Number(movementsData[loggedInUser].userTime),
                  opponent: userData.opponent,
                  opponentPhoto: opponentSnapData.photoURL,
                  opponentTime: Number(
                    movementsData[loggedInUser].opponentTime
                  ),
                  opponentName: opponentSnapData.name,
                  result,
                }),
              }),
            ]);
          }

          if (readyToDelete) {
            setGenerateResult(true);
            const deleteDocRef = doc(db, "matches", userData.match);
            await deleteDoc(deleteDocRef);
            setQueued(false);
            setMatched(false);
            setCurrentWorkoutID("");
            setMatchID("");
            setWorkout(false);
          }
        } catch (error) {
          console.log(error);
        }
      }
    );
  }, [matchID, workout]);

  const startMatchmaking = async () => {
    try {
      const queueSnapshot = await getDocs(collection(db, "queueList"));
      const queuedUsers = queueSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.queue === true);

      while (queuedUsers.length > 1) {
        console.log("Once match has been found");
        const [userOne, userTwo] = queuedUsers.splice(0, 2);
        const matchData = {
          userSelected: false,
          opponentTime: 0,
          userTime: 0,
          movements: [],
          repetitions: [],
          retrievedResult: false,
        };
        const generatedMatchID = userOne.id + userTwo.id;
        const matchDocRef = doc(db, "matches", generatedMatchID);
        const userOneDocRef = doc(db, "users", userOne.id);
        const userTwoDocRef = doc(db, "users", userTwo.id);
        const userOneQueueDocRef = doc(db, "queueList", userOne.id);
        const userTwoQueueDocRef = doc(db, "queueList", userTwo.id);

        await setDoc(matchDocRef, {
          [userOne.id]: matchData,
          [userTwo.id]: matchData,
        });

        await Promise.all([
          updateDoc(userOneDocRef, {
            matched: true,
            opponent: userTwo.id,
            match: generatedMatchID,
            queue: false,
            matchTime: 0,
          }),

          updateDoc(userTwoDocRef, {
            matched: true,
            opponent: userOne.id,
            match: generatedMatchID,
            queue: false,
            matchTime: 0,
          }),

          deleteDoc(userOneQueueDocRef),
          deleteDoc(userTwoQueueDocRef),
          setMatchID(generatedMatchID),
          setQueued(false),
          setMatched(true),
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unsub = onSnapshot(
    doc(db, "queueList", "documents"),
    (individualDocument) => {
      startMatchmaking();
    }
  );

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home">
      <Header photo={userData.photoURL} />
      <div className="home__deadline">
        <h1 className="home__title">Submission Timer</h1>
        <p className="home__time">00:00</p>
      </div>
      <div className="home__workout-container">
        {matched && userData.movement === "" && currentWorkoutID === "" ? (
          <Match updateDataInParent={updateDataInParent} data={userData} />
        ) : (
          <></>
        )}
        {currentWorkoutID !== "" ? <Modal data={userData} /> : <></>}
      </div>
      <div className="home__container-wods">
        <h2 className="home__wods-heading">WODs Completed</h2>
        <p className="home__wods">{userData.history.length}</p>
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
          className={queued ? "home__footer-btn-active" : "home__footer-btn"}
          src={queued ? Loading : MatchIcon}
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
