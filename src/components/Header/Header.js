import "./Header.scss";
import ProfilePic from "../../assets/images/Ivan Salgado  - Software Engineering - June Miami 2023.jpg";
import Logo from "../../assets/images/IMG-5638.PNG";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="header">
      <img className="header__profile" src={ProfilePic} alt="Profile Pic" />
      <Link to={"/home"}>
        <img className="header__logo" src={Logo} alt="Logo" />
      </Link>
      <div className="header__hamburger"></div>
    </div>
  );
}

export default Header;
