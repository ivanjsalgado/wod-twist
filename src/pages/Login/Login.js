import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import "./Login.scss";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/WOD_TWIST_Text.svg";
import { db, auth } from "../../firebase-config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        let user = userCredential.user.uid;
        sessionStorage.setItem("user", user);
        localStorage.setItem("user", user);
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
        alert("Invalid user email and/or password");
        return;
      });
  };

  // const signInWithGoogle = async () => {
  //   const provider = new GoogleAuthProvider();
  //   signInWithPopup(auth, provider)
  //     .then(async (result) => {
  //       console.log(result, "result");
  //       const user = result.user;
  //       const userRef = doc(db, "users", user.uid);
  //       sessionStorage.setItem("user", user);
  //       localStorage.setItem("user", user);

  //       const userData = {
  //         email: user.email,
  //         photoURL: user.photoURL,
  //       };

  //       await setDoc(userRef, userData, { merge: true });
  //       navigate("/home");
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  return (
    <div className="login">
      <div className="login__heading-container">
        <img className="login__logo" src={Logo} alt="Logo" />
      </div>
      <form onSubmit={signIn} className="login__form">
        <input
          className="login__form-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login__form-input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* <div className="login__forgot-container">
          <p className="login__small-text">Forget Password?</p>
        </div> */}
        <div className="login__container-login">
          <button type="submit" className="login__login-button">
            Login
          </button>
        </div>
      </form>
      <div className="login__sign-container">
        <Link
          to={"/signup"}
          style={{ textDecoration: "none", display: "flex" }}
        >
          <p className="login__sign-up">Don't have an account?</p>
          <p className="login__sign-up login__sign-up--ml">Sign up</p>
        </Link>
      </div>
      {/* <div className="login__option-icons">
        <button onClick={signInWithGoogle} class="login__google">
          Sign in with Google
        </button>
      </div> */}
      {/* <button onClick={logout}>Logout</button> */}
    </div>
  );
};

export default Login;
