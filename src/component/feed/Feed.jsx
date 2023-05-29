import "./feed.css";
import Share from "../share/Share";
import Post from "../post/Post";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contex/AuthContext";
import { ThemeContext } from "../../Contex/ThemeContext";
import { axiosInstance } from "../../config";

export default function Feed({ username }) {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axiosInstance.get("/post/profile/" + username)
        : await axiosInstance.get("/post/timeline/" + user._id);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user._id]);

  return (
    <div className={`feed ${theme}`}>
      {(!username || username === user.username) && <Share />}
      {posts.map((p) => (
        <Post key={p._id} post={p} />
      ))}
    </div>
  );
}
