import "./Header.scss";
import Logo from "../../assets/images/WOD_TWIST_002-01.svg";
import { Link } from "react-router-dom";

function Header({ photo }) {
  return (
    <div className="header">
      <Link to={"/home"}>
        <img className="header__logo" src={Logo} alt="Logo" />
      </Link>
      <img className="header__profile" src={photo} alt="Profile Pic" />
    </div>
  );
}

export default Header;
