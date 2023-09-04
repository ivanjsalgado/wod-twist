import "./History.scss";
import RoundDetails from "../RoundDetails/RoundDetails";
import Header from "../Header/Header";
import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { getDoc, doc } from "firebase/firestore";

function History() {
  const loggedInUser =
    sessionStorage.getItem("user") || localStorage.getItem("user");
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const userDoc = doc(db, "users", loggedInUser);
      const snap = await getDoc(userDoc);

      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
      } else {
        console.log("User was not found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  if (userData === null) {
    return <div>Loading...</div>;
  }
  return (
    <div className="history">
      <Header photo={userData.photoURL} />
      {userData.history.map((round, index) => (
        <RoundDetails
          index={index}
          workoutID={round.workoutID}
          result={round.result}
          opponentTime={round.opponentTime}
          time={round.time}
          name={userData.name}
          opponentName={round.opponentName}
          opponentPhoto={round.opponentPhoto}
          photo={userData.photoURL}
        />
      ))}
    </div>
  );
}

export default History;
