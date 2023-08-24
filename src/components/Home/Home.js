import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { getDoc, doc } from "firebase/firestore";
import { useLocation } from "react-router-dom";

export default function Home() {
  const [random, setRandom] = useState("");
  let location = useLocation();

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
  return <div>Home</div>;
}
