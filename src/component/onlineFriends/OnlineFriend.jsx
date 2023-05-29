import "./onlineFriends.css";

export default function OnlineFriend({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <li className="onlinefriend">
      <div className="onlineFriendImgContainer">
        <img
          src={PF + user.profilePicture}
          alt="profile"
          className="onlinefriendImg"
        />
        <span className="onlineFriendStatus"></span>
      </div>
      <span className="onlinefriendName">{user.username}</span>
    </li>
  );
}
