import "./sidebar.css";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import ChatIcon from "@mui/icons-material/Chat";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import WorkIcon from "@mui/icons-material/Work";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SchoolIcon from "@mui/icons-material/School";
import CloseFriend from "../closeFriend/CloseFriend.jsx";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../Contex/ThemeContext";
import { AuthContext } from "../../Contex/AuthContext";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../config";

export default function Sidebar() {
  const { theme } = useContext(ThemeContext);
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const FetchUser = async () => {
      try {
        const res = await axiosInstance.get("/user/users");
        setUsers(res.data.filter((u) => u._id !== currentUser._id));
      } catch (err) {
        console.log(err);
      }
    };
    FetchUser();
  }, [currentUser]);

  return (
    <div className={`sidebar ${theme}`}>
      <div className="sidebarContainer">
        <ul className="sideListItems">
          <Link to="/" className="linkStyle">
            <li className="sideListItem active">
              <RssFeedIcon className="sidebarIcon" />
              <span className="sideItemTitle">Feed</span>
            </li>
          </Link>
          <Link to="/messenger" className="linkStyle">
            <li className="sideListItem active">
              <ChatIcon className="sidebarIcon" />
              <span className="sideItemTitle">Chats</span>
            </li>
          </Link>
          <li className="sideListItem">
            <PlayCircleIcon className="sidebarIcon" />
            <span className="sideItemTitle">Videos</span>
          </li>
          <li className="sideListItem">
            <PeopleAltIcon className="sidebarIcon" />
            <span className="sideItemTitle">Groups</span>
          </li>
          <li className="sideListItem">
            <BookmarksIcon className="sidebarIcon" />
            <span className="sideItemTitle">Bookmarks</span>
          </li>
          <li className="sideListItem">
            <HelpOutlineIcon className="sidebarIcon" />
            <span className="sideItemTitle">Questions</span>
          </li>
          <li className="sideListItem">
            <WorkIcon className="sidebarIcon" />
            <span className="sideItemTitle">Jobs</span>
          </li>

          <li className="sideListItem">
            <SchoolIcon className="sidebarIcon" />
            <span className="sideItemTitle">Courses</span>
          </li>
        </ul>
        <hr className="sidebarHr" />
        <p className="sideTitle">Suggestion for you</p>
        <ul className="sidebarFriendList">
          {users.map((u) => (
            <CloseFriend key={u._id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  );
}
