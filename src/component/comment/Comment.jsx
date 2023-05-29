import "./comment.css";
import { format } from "timeago.js";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../config";

export default function Comment({ c }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axiosInstance.get(`/user/?userId=${c.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [c.userId]);

  return (
    <div className="commentItem">
      <img
        src={PF + user?.profilePicture}
        alt=""
        className="commentItemImage"
      />
      <p className="commentText">{c.text}</p>
      <span className="commentTime">{format(c.createdAt)}</span>
    </div>
  );
}
