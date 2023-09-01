import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import "./Login.scss";
import { googleProvider, auth } from "../../firebase-config";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/IMG-5638.PNG";

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
        alert("Invalid user email and/or password");
        return;
      });
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login">
      <div className="login__heading-container">
        <h1 className="login__heading-welcome">Welcome to</h1>
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
        <div className="login__forgot-container">
          <p className="login__small-text">Forget Password?</p>
        </div>
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
      <div className="login__option-text">
        <p className="login__small-text">Or Login with</p>
      </div>
      <div className="login__option-icons">
        <button onClick={signInWithGoogle} class="login__google">
          Sign in with Google
        </button>
      </div>
      {/* <button onClick={logout}>Logout</button> */}
    </div>
  );
};

export default Login;
