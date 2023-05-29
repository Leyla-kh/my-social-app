import "./mainSearch.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contex/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { axiosInstance } from "../../config";

export default function Search({ query }) {
  const { user: currentUser } = useContext(AuthContext);
  //const [query, setQuery] = useState("");
  const [friends, setFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  const [home, setHome] = useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const pathname = window.location.pathname;

  useEffect(() => {
    if (pathname === "/") setHome(true);
  }, [pathname]);

  //get current user's friends
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendList = await axiosInstance.get(
          "/user/friends/" + currentUser._id
        );
        setFriends(friendList.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFriends();
  }, [currentUser]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axiosInstance.get("/post/timeline/" + currentUser._id);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [currentUser]);

  return (
    <>
      {query && (
        <div className="search">
          {friends
            ?.filter((f) => f.username.toLowerCase().includes(query))
            .map((friend) => (
              <Link to={"/profile/" + friend.username} className="searchLink">
                <div className="friendResultItem">
                  <div className="itemInfo">
                    <img
                      src={PF + friend.profilePicture}
                      alt=""
                      className="FriendResultImg"
                    />
                    <span className="friendResultName">{friend.username}</span>
                  </div>
                  <span>Friends</span>
                </div>
              </Link>
            ))}

          {home &&
            posts
              ?.filter((p) => p.caption.toLowerCase().includes(query))
              .map((post) => (
                <a href={`#${post._id}`} className="serachLink">
                  <div className="postResultItem">
                    <div className="itemInfo">
                      <img
                        src={PF + post.image}
                        alt=""
                        className="postResultImg"
                      />
                      <span className="postResultText">{post.caption}</span>
                    </div>

                    <span>Posts</span>
                  </div>
                </a>
              ))}
        </div>
      )}
    </>
  );
}
