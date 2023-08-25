import "./Header.scss";
import ProfilePic from "../../assets/images/Ivan Salgado  - Software Engineering - June Miami 2023.jpg";

function Header() {
  return (
    <div className="header">
      <img className="header__profile" src={ProfilePic} alt="Profile Pic" />
      <div className="header__logo"></div>
      <div className="header__hamburger"></div>
    </div>
  );
}

export default Header;
