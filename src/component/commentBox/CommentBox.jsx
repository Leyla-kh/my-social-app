import { useContext, useState } from "react";
import { useRef } from "react";
import { SocketContext } from "../../Contex/SocketContext";
import Comment from "../comment/Comment";
import "./commentBox.css";
import { axiosInstance } from "../../config";

export default function CommentBox({ post, user, comments, setFetch }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const newComment = useRef();
  const { socket } = useContext(SocketContext);

  console.log(user);
  const handle = async () => {
    const addNewComment = {
      userId: user._id,
      postId: post._id,
      text: newComment.current.value,
    };
    try {
      await axiosInstance.post("/comment", addNewComment);
      newComment.current.value = "";
      setFetch(true);
      socket.emit("sendNotification", {
        senderName: user.username,
        receiverId: post.userId,
        type: "comment",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="comment">
      <div className="commentContainer">
        <div className="commentTop">
          <img src={PF + user.profilePicture} alt="" className="commentImage" />
          <input
            type="text"
            className="commentInput"
            placeholder="Write your comment ..."
            ref={newComment}
          />
          <button className="commentBtn" onClick={handle}>
            Send
          </button>
        </div>
        <hr className="commentHr" />
        <div className="commentBottom">
          {comments?.map((c) => (
            <Comment id={c.key} c={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
