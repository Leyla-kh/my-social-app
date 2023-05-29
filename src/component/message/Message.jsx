import "./message.css";
import { format } from "timeago.js";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../config";

export default function Message({ message, own }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [sender, setSender] = useState("");

  useEffect(() => {
    const getSender = async () => {
      try {
        const res = await axiosInstance.get("/user?userId=" + message.sender);
        setSender(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSender();
  }, [message.sender]);

  return (
    <div className={own ? "message own" : "message "}>
      <img src={PF + sender.profilePicture} alt="" className="messageImage" />
      <div className="messageTextWrapper">
        <p className="messageText">{message.text}</p>
        <span className="messageTextTime">{format(message.createdAt)}</span>
      </div>
    </div>
  );
}
