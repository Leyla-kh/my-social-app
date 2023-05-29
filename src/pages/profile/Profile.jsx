import "./profile.css";
import Topbar from "../../component/topbar/Topbar";
import Sidebar from "../../component/sidebar/Sidebar";
import Feed from "../../component/feed/Feed";
import Rightbar from "../../component/rightbar/Rightbar";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ThemeContext } from "../../Contex/ThemeContext";
import { axiosInstance } from "../../config";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const username = useParams().username;
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axiosInstance.get(`/user?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  return (
    <>
      <Topbar />
      <div className={`profile ${theme}`}>
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCoverBox">
              <img
                src={PF + user.coverPicture}
                alt=""
                className="profileCover"
              />
              <img
                src={PF + user.profilePicture}
                alt=""
                className="profileImage"
              />
              <div className="profileInfo">
                <h4 className="profileName">{username}</h4>
                <span className="profileDesc">{user.desc} </span>
              </div>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
