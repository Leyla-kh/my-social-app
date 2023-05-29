import "./rightbar.css";
import OnlineFriend from "../onlineFriends/OnlineFriend";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Contex/AuthContext";
import { ThemeContext } from "../../Contex/ThemeContext";
import { SocketContext } from "../../Contex/SocketContext";
import CancelIcon from "@mui/icons-material/Cancel";
import { axiosInstance } from "../../config";

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [userFriends, setUserFriends] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentUserFriends, setCurrentUserFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [follow, setFollow] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { socket } = useContext(SocketContext);
  let profileData = {};
  const [openEdit, setOpenEdit] = useState(false);
  const [profilePicture, setProfilePicture] = useState();
  const [coverPicture, setCoverPicture] = useState();
  const sampleOnlineUser = [
    { username: "Monica Geller", profilePicture: "6.jpg" },
    { username: "Chandler Bing", profilePicture: "4.jpg" },
  ];

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendList = await axiosInstance.get(
          "/user/friends/" + currentUser._id
        );
        setCurrentUserFriends(friendList.data);
        setFollow(friendList.data.some((f) => f._id === user?._id));
      } catch (error) {
        console.log(error);
      }
    };
    fetchFriends();
  }, [currentUser, user, follow]);

  // get online user from socket and filter online friends
  useEffect(() => {
    socket?.on("getOnlineUsers", (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });
  }, [currentUser, socket]);

  // get friends of a user , for profile page of that user
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendList = await axiosInstance.get("/user/friends/" + user._id);
        setUserFriends(friendList.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFriends();
  }, [user]);

  const handleClick = async () => {
    try {
      if (follow) {
        await axiosInstance.put("/user/" + user._id + "/unfollow", {
          userId: currentUser._id,
        });
      } else {
        await axiosInstance.put("/user/" + user._id + "/follow", {
          userId: currentUser._id,
        });
      }
      setFollow(!follow);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setOpenEdit(false);

    if (profilePicture) {
      const data = new FormData();
      data.append("file", profilePicture);

      try {
        const res = await axiosInstance.post("/upload", data);
        profileData.profilePicture = res.data.filename;
      } catch (error) {
        console.log("cant upload");
      }
    }

    if (coverPicture) {
      const data = new FormData();
      data.append("file", coverPicture);

      try {
        const res = await axiosInstance.post("/upload", data);
        profileData.coverPicture = res.data.filename;
      } catch (error) {
        console.log("cant upload");
      }
    }

    profileData.userId = currentUser._id;
    try {
      console.log(profileData);
      await axiosInstance.put(`/user/${currentUser._id}`, profileData);

      const res = await axiosInstance.get(`/user/?userId=${currentUser._id}`);
      console.log(res.data);
      dispatch({ type: "USER_EDITED", payload: res.data });

      if (!profileData.username) {
        window.location.reload();
      } else {
        window.location.replace(
          `http://localhost:3000/profile/${profileData.username}`
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="rightbarbirthday">
          <img
            src={`${PF}gift-icon.png`}
            alt=""
            className="rightbarBirthdayIcon"
          />
          <p className="rightbarBirthdayText">
            <b>J. Worra</b> and <b>3 other friends</b> have a birthday today
          </p>
        </div>
        <div className="rightbarAd">
          <p className="rightbarAdTitle">Sponsored</p>
          <a href="https://www.coca-colacompany.com/" target={"_blank"}>
            <img
              src={`${PF}cola-ad.jpg`}
              alt="coca cola advertisment"
              className="rightbarAdImage"
            />
          </a>
          <p className="rightbarAdText">
            Whoever You Are, Whatever You Do, Wherever You May Be, When You
            Think of Refreshment Think of Ice Cold Coca-Cola
          </p>
        </div>
        <div className="onlinefriendSection">
          <h4 className="onlineFriendsTitile">Online Friends</h4>
          <ul className="rightbarOnlineFriends">
            {currentUserFriends
              .filter((f) => onlineUsers.some((o) => o.userId == f._id))
              .map((u) => (
                <Link
                  className="onlineFriendLink"
                  to={"/profile/" + u.username}
                >
                  <OnlineFriend key={u.id} user={u} />
                </Link>
              ))}
            {sampleOnlineUser.map((u) => (
              <Link className="onlineFriendLink" to={"/profile/" + u.username}>
                <OnlineFriend key={u.id} user={u} />
              </Link>
            ))}
          </ul>
        </div>
      </>
    );
  };
  const ProfileRightbar = () => {
    return (
      <>
        <div className="topPart">
          <div className="LetfPart">
            <h4 className="rightbarTitle">User Information</h4>
            <div className="rightbarInfo">
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">City :</span>
                <span className="rightbarInfoValue">{user.city}</span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">From :</span>
                <span className="rightbarInfoValue">{user.from}</span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">Relationship :</span>
                <span className="rightbarInfoValue">
                  {user.relationShip === 1
                    ? "Single"
                    : user.relationship === 2
                    ? "Married"
                    : "Other"}
                </span>
              </div>
            </div>
          </div>
          <div className="RightPart">
            {user.username !== currentUser.username ? (
              <button className="followButton" onClick={handleClick}>
                {follow ? "Unfollow" : "Follow"}
              </button>
            ) : (
              <button
                className="followButton"
                onClick={() => {
                  window.scrollTo(0, 0);
                  setOpenEdit(true);
                }}
              >
                Edit profile
              </button>
            )}
          </div>
        </div>
        <h4 className="rightbarTitle">User Friends</h4>
        <div className="rightbarFollowings">
          {userFriends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              className="onlineFriendLink"
            >
              <div className="rightbarFollowing">
                <img
                  src={PF + friend.profilePicture}
                  alt="profile"
                  className="followingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>

        {openEdit && (
          <div className="editForm">
            <div className="editFormContainer">
              <div className="textInputs">
                <div className="textInputItem">
                  Name :
                  <input
                    name="username"
                    type="text"
                    className="editFormInput"
                    onChange={(e) => {
                      profileData.username = e.target.value;
                    }}
                  />
                </div>
                <div className="textInputItem">
                  Status :
                  <input
                    name="desc"
                    type="text"
                    className="editFormInput"
                    onChange={(e) => {
                      profileData.desc = e.target.value;
                    }}
                  />
                </div>
                <div className="textInputItem">
                  City :
                  <input
                    name="city"
                    type="text"
                    className="editFormInput"
                    onChange={(e) => {
                      profileData.city = e.target.value;
                    }}
                  />
                </div>
                <div className="textInputItem">
                  From :
                  <input
                    name="from"
                    type="text"
                    className="editFormInput"
                    onChange={(e) => {
                      profileData.from = e.target.value;
                    }}
                  />
                </div>
                <div className="textInputItem">
                  Relationship :
                  <input
                    name="relationship"
                    type="text"
                    className="editFormInput"
                    onChange={(e) => {
                      profileData.relationship = e.target.value;
                    }}
                  />
                </div>
              </div>
              <div className="fileInputs">
                <label htmlFor="coverPicture" className="buttonLabel">
                  Cover Picture
                  <input
                    type="file"
                    accept=".png,.jpeg,.jpg"
                    id="coverPicture"
                    style={{ display: "none" }}
                    onChange={(e) => setCoverPicture(e.target.files[0])}
                  />
                </label>

                <label htmlFor="profilePicture" className="buttonLabel">
                  Profile Picture
                  <input
                    type="file"
                    accept=".png,.jpeg,.jpg"
                    id="profilePicture"
                    style={{ display: "none" }}
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                  />
                </label>
              </div>
              <div className="preview">
                {coverPicture && (
                  <div className="previewContainer">
                    <img
                      src={URL.createObjectURL(coverPicture)}
                      alt=""
                      className="imagePreview"
                    />
                    <CancelIcon
                      className="cancelButton"
                      onClick={() => setCoverPicture(null)}
                    />
                  </div>
                )}
                {profilePicture && (
                  <div className="previewContainer">
                    <img
                      className="profileImagePreview"
                      src={URL.createObjectURL(profilePicture)}
                      alt=""
                    />
                    <CancelIcon
                      className="cancelButton"
                      onClick={() => setProfilePicture(null)}
                    />
                  </div>
                )}
              </div>
              <div className="editButtons">
                <button
                  className="editSubmitBtn"
                  onClick={() => {
                    setOpenEdit(false);
                    setCoverPicture(null);
                    setProfilePicture(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="editSubmitBtn"
                  type="submit"
                  onClick={handleEdit}
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className={`rightbar ${theme}`}>
      <div className="rightbarcontainer">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
