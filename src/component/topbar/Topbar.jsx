import "./topbar.css";
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import LightModeIcon from "@mui/icons-material/LightMode";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contex/AuthContext";
import { ThemeContext } from "../../Contex/ThemeContext";
import { SocketContext } from "../../Contex/SocketContext";
import MainSearch from "../mainSearch/MainSearch";

export default function Topbar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user, dispatch } = useContext(AuthContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const { socket, chatNotifications } = useContext(SocketContext);
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("Notification")) || []
  );
  const [openNotifications, setOpenNotifications] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    socket?.on("getNotification", (data) => {
      setNotifications((prev) => [...prev, data]);
      localStorage.setItem("Notification", JSON.stringify(notifications));
    });
  }, [socket]);

  useEffect(() => {
    localStorage.setItem("Notification", JSON.stringify(notifications));
  }, [notifications]);

  const handleTheme = () => {
    if (theme == "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const logOut = () => {
    dispatch({ type: "LOGOUT" });
  };

  const displayNotification = ({ senderName, type }) => {
    let action;
    if (type === "like") {
      action = "liked";
    } else if (type === "comment") {
      action = "commented";
    }
    console.log("display");
    return (
      <span className="notification">{`${senderName} ${action} your post.`}</span>
    );
  };

  const handleNotifications = () => {
    setOpenNotifications(false);
    setNotifications([]);
  };

  return (
    <div className={`topbarContainer ${theme}`}>
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src={PF + "social-logo.png"} className="social-logo" />
          <span className="topbarLogo">Friends</span>
        </Link>
        <div className="topbarLinks">
          {theme == "light" ? (
            <BedtimeIcon onClick={handleTheme} className="leftTopbarIcon" />
          ) : (
            <LightModeIcon onClick={handleTheme} className="leftTopbarIcon" />
          )}
          <Link to="/" className="link">
            <HomeIcon className="leftTopbarIcon" />
          </Link>
        </div>
      </div>
      <div className="topbarCenter">
        <div className="searchBar">
          <SearchIcon className="searchIcon" />
          <input
            placeholder="Search freind, image or video ..."
            className="searchInput"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {query && <MainSearch query={query} />}
      </div>

      <div className="topbarRight">
        <div className="topbarIconsList">
          <div className="topbarIcon">
            <LogoutIcon onClick={logOut} className="Icon" />
          </div>

          <div className="topbarIcon">
            <Link to="/messenger">
              <div>
                {chatNotifications.length > 0 && (
                  <span className="topbarIconBadge">
                    {chatNotifications.length}
                  </span>
                )}
                <ChatIcon className="Icon" />
              </div>
            </Link>
          </div>

          <div
            className="topbarIcon"
            onClick={() =>
              notifications.length > 0 && setOpenNotifications(true)
            }
          >
            <NotificationsIcon className="Icon" />
            {notifications.length > 0 && (
              <span className="topbarIconBadge">{notifications.length}</span>
            )}
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img src={PF + user.profilePicture} className="topbarImg" />
        </Link>
      </div>
      {openNotifications && (
        <div className="notifications">
          <div className="notificationItem">
            {notifications?.map((N) => displayNotification(N))}
          </div>
          <button className="notifBtn" onClick={handleNotifications}>
            Mark as read
          </button>
        </div>
      )}
    </div>
  );
}
