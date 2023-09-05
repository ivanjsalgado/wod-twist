import "./SignUp.scss";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import Logo from "../../assets/images/WOD_TWIST_002-01.svg";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    const defaultAvatar = ref(storage, "images/user.png");
    getDownloadURL(defaultAvatar)
      .then((url) => {
        setImageURL(url);
      })
      .catch((error) => {
        console.error("Error getting image URL:", error);
      });
  }, []);

  const uploadImageToFirebaseStorage = async (file, destination) => {
    if (!file) return;
    const storageRef = ref(storage, destination);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      console.log("Image uploaded:", snapshot);
      return snapshot;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    const uniqueFileName = `${Date.now()}_${file.name}`;
    const uploadSnapshot = await uploadImageToFirebaseStorage(
      file,
      `images/${uniqueFileName}`
    );
    setImageURL(await getDownloadURL(uploadSnapshot.ref));
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userID = userCredential.user.uid;

      await setDoc(doc(db, "users", userID), {
        email: email,
        name: name,
        match: "",
        matchTime: 0,
        matched: false,
        movement: "",
        opponent: "",
        opponentName: "",
        points: 0,
        queue: false,
        workoutID: "",
        history: [],
        photoURL: imageURL,
      });

      alert("Account has been successfully created");
      navigate("/");
    } catch (error) {
      alert("Failed to create account: " + error.message);
    }
  };

  const signUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password doesn't match");
      return;
    }
    if (password.length < 6) {
      alert("Password must have at least 6 characters");
      return;
    }
    handleSignUp();
  };

  return (
    <>
      <div className="sign">
        <img className="sign__logo" src={Logo} alt="Logo" />
        <form onSubmit={signUp} className="sign__form">
          <label className="sign__label">Name</label>
          <input
            className="sign__form-input"
            type="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label className="sign__label">Email</label>
          <input
            className="sign__form-input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="sign__label">Password</label>
          <input
            className="sign__form-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="sign__label">Confirm Password</label>
          <input
            className="sign__form-input"
            type="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="sign__form-upload">
            <label className="sign__label">Upload Photo:</label>
            <input
              placeholder="Import Photo"
              type="file"
              onChange={handleChange}
              className="sign__import"
            />
          </div>
          <div className="sign__container-login">
            <button type="submit" className="sign__sign-button">
              Sign Up
            </button>
          </div>
        </form>
        <div className="sign__option-text">
          <Link to={"/"} style={{ textDecoration: "none", display: "flex" }}>
            <p className="sign__small-text">Have an account?</p>
            <p className="sign__small-text sign__small-text--ml">Log in</p>
          </Link>
        </div>
      </div>
    </>
  );
}
