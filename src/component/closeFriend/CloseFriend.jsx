import { Link } from "react-router-dom";
import "./closeFriend.css";
export default function CloseFriend({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <li className="sidebarFriend">
      <div className="sidebarFriendInfo">
        <img
          src={PF + user.profilePicture}
          alt="profile"
          className="sidebarFriendImg"
        />
        <span className="sidebarFriendName">{user.username}</span>
      </div>
      <Link className="linkStyle" to={"/profile/" + user.username}>
        <button className="sidebarFriendBtn">Visit</button>
      </Link>
    </li>
  );
}
