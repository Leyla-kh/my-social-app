import { useContext, useEffect, useState } from "react";
import "./conversation.css";
import { axiosInstance } from "../../config";

export default function Conversation({
  conversation,
  currentUser,
  messages,
  currentConversation,
  chatNotifications,
}) {
  const [user, setUser] = useState("");
  const [lastMsg, setLastMsg] = useState("");
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  let currentNotifications = [];

  useEffect(() => {
    const friendId = conversation.members.find((id) => id !== currentUser._id);
    const getFriend = async () => {
      try {
        const res = await axiosInstance.get("/user?userId=" + friendId);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFriend();
  }, [currentUser, conversation]);

  if (chatNotifications.length > 0) {
    chatNotifications?.map(
      (c) => c.senderId == user._id && currentNotifications.push(c)
    );
  }

  useEffect(() => {
    if (conversation) {
      const getMessages = async () => {
        try {
          const res = await axiosInstance.get("/messages/" + conversation._id);
          setLastMsg(res.data[res.data.length - 1].text);
        } catch (error) {
          console.log(error);
        }
      };
      getMessages();
    }
  }, [conversation, messages]);

  return (
    <div
      className={
        currentConversation?.members.includes(user._id)
          ? "conversation active"
          : "conversation"
      }
    >
      <img src={PF + user.profilePicture} alt="" className="conversationImg" />
      <div className="conversationTexts">
        <span className="conversationName">{user.username}</span>
        <p className="lastMessage">{lastMsg}</p>
      </div>
      {currentNotifications.length > 0 && (
        <span className="iconBadge">{currentNotifications.length}</span>
      )}
    </div>
  );
}
