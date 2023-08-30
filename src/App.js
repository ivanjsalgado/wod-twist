import "./App.scss";
import firebase from "firebase/app";
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
  getDoc,
  getDocs,
  doc,
  update,
  updateDoc,
  setDoc,
  deleteDoc,
  collection,
  getCountFromServer,
  where,
  addDoc,
} from "firebase/firestore";

function App() {
  const unsub = onSnapshot(
    doc(db, "queueList", "documents"),
    (individualDocument) => {
      const checkCount = async () => {
        try {
          const data = await getDocs(collection(db, "queueList"));
          const filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          let test = filteredData.filter((item) => item.queue === true);
          while (test.length > 1) {
            const userOne = test[0].id;
            const userTwo = test[1].id;
            test.splice(0, 2);
            const id = crypto.randomUUID();
            // I had to sum the ids because it would create multiple matches otherwise
            setDoc(doc(db, "matches", userOne + userTwo), {
              [userOne]: false,
              [userTwo]: false,
            });
            const userOneDoc = doc(db, "users", userOne);
            const userTwoDoc = doc(db, "users", userTwo);
            await updateDoc(userOneDoc, {
              matched: true,
              match: userOne + userTwo,
              queue: false,
            });

            await updateDoc(userTwoDoc, {
              match: userOne + userTwo,
              matched: true,
              queue: false,
            });
            const userOneQueueDoc = doc(db, "queueList", userOne);
            const userTwoQueueDoc = doc(db, "queueList", userTwo);
            await deleteDoc(userOneQueueDoc);
            await deleteDoc(userTwoQueueDoc);
          }
        } catch (err) {
          console.error(err);
        }
      };
      checkCount();
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
