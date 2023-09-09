import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../Contex/SocketContext";
import "./messangerFriendList.css";
import { axiosInstance } from "../../config";

export default function MessangerFriendList({
  currentUserId,
  currentConversation,
  setCurrentConversation,
  setConversations,
}) {
  const [friend, setFriend] = useState([]);
  const [onlineUser, setOnlineUser] = useState([]);
  const [onlineFriend, setOnlineFriend] = useState([]);
  const [oflineFriend, setOflineFriend] = useState([]);
  const { socket } = useContext(SocketContext);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axiosInstance.get("/user/friends/" + currentUserId);
        setFriend(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
  }, [currentUserId]);

  // get online user from socket and filter online friends
  useEffect(() => {
    socket?.on("getOnlineUsers", (onlineUsers) => {
      setOnlineUser(onlineUsers);
    });
  }, [currentUserId, socket]);
  console.log(onlineUser);
  console.log(onlineFriend);
  console.log(oflineFriend);

  useEffect(() => {
    setOnlineFriend(
      friend.filter((f) => onlineUser.some((o) => o.userId === f._id))
    );
    const onlineFriendIds = onlineFriend.map((o) => {
      return o._id;
    });
    setOflineFriend(friend.filter((f) => !onlineFriendIds.includes(f._id)));
  }, [friend, onlineUser]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axiosInstance.get("/conversations/" + currentUserId);
        setConversations(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
  }, [currentConversation]);

  const startConversation = async (e) => {
    const id = e.target.id;
    try {
      const res = await axiosInstance.get("/conversations/" + currentUserId);
      const Conversations = res.data;
      const findConversation = Conversations?.find((c) =>
        c.members.includes(id)
      );
      if (!findConversation) {
        try {
          const res = await axiosInstance.post("/conversations", {
            senderId: currentUserId,
            receiverId: id,
          });
          setCurrentConversation(res.data);
        } catch (error) {
          console.log(error);
        }
      } else {
        setCurrentConversation(findConversation);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {onlineFriend?.map((o) => (
        <div className="friend">
          <div className="friendInfo">
            <span className="friendBadge"></span>
            <img src={PF + o.profilePicture} alt="" className="friendImage" />
            <span className="friendName">{o.username}</span>
          </div>
          <button className="friendSendMsg">Message</button>
        </div>
      ))}
      {oflineFriend?.map((o) => (
        <div className="friend">
          <div className="friendInfo">
            <img src={PF + o.profilePicture} alt="" className="friendImage" />
            <span className="friendName">{o.username}</span>
          </div>
          <button
            className="friendSendMsg"
            id={o._id}
            onClick={startConversation}
          >
            Message
          </button>
        </div>
      ))}
    </div>
  );
}
