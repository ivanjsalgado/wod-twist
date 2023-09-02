import "./App.scss";
import "firebase/firestore";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import Home from "./components/Home/Home";
import History from "./components/History/History";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import { db } from "./firebase-config";
import {
  onSnapshot,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";

function App() {
  const startMatchmaking = async () => {
    try {
      const queueSnapshot = await getDocs(collection(db, "queueList"));
      const queuedUsers = queueSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.queue === true);

      while (queuedUsers.length > 1) {
        const [userOne, userTwo] = queuedUsers.splice(0, 2);
        const matchData = {
          userSelected: false,
          opponentTime: 0,
          userTime: 0,
          movements: [],
          repetitions: [],
          retrievedResult: false,
        };

        const matchID = userOne.id + userTwo.id;
        const matchDocRef = doc(db, "matches", matchID);
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
            match: matchID,
            queue: false,
            matchTime: 0,
          }),

          updateDoc(userTwoDocRef, {
            matched: true,
            opponent: userOne.id,
            match: matchID,
            queue: false,
            matchTime: 0,
          }),

          deleteDoc(userOneQueueDocRef),
          deleteDoc(userTwoQueueDocRef),
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

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
