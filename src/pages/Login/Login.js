import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./Login.scss";
import { signInWithGoogle, auth } from "../../firebase-config";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/home");
        console.log(userCredential);
      })
      .catch((error) => {
        alert("Invalid user email and/or password");
        return;
      });
  };

  return (
    <div className="login">
      <div className="login__heading-container">
        <h1 className="login__heading-welcome">Welcome!</h1>
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
        <Link to={"/signup"} style={{ textDecoration: "none" }}>
          <p className="login__sign-up">Don't have an account? Sign up</p>
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
    </div>
  );
};

export default Login;
