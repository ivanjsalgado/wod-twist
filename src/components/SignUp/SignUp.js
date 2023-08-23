import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";
import "./SignUp.scss";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        alert("Failed to create account");
        return;
      });
  };

  return (
    <>
      <div className="sign">
        <div className="sign__heading-container">
          <h1 className="sign__heading-welcome">Sign Up</h1>
        </div>
        <form onSubmit={signUp} className="sign__form">
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
          <div className="sign__container-login">
            <button type="submit" className="sign__sign-button">
              Sign Up
            </button>
          </div>
        </form>
        <div className="sign__option-text">
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <p className="sign__small-text">Have an account? Log in</p>
          </Link>
        </div>
      </div>
    </>
  );
}
