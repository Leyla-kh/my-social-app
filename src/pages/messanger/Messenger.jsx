import "./messenger.css";
import Topbar from "../../component/topbar/Topbar";
import Conversation from "../../component/conversation/Conversation";
import Message from "../../component/message/Message";
import { useContext } from "react";
import { AuthContext } from "../../Contex/AuthContext";
import { useState, useEffect, useRef } from "react";
import MessangerFriendList from "../../component/messangerFriendList/MessangerFriendList";
import { SocketContext } from "../../Contex/SocketContext";
import SearchIcon from "@mui/icons-material/Search";
import { ThemeContext } from "../../Contex/ThemeContext";
import { axiosInstance } from "../../config";

export default function Messenger() {
  const { user: currentUser } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollBar = useRef();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { socket, chatNotifications, setChatNotifications } =
    useContext(SocketContext);
  const [query, setQuery] = useState("");
  const [friends, setFriends] = useState([]);
  const { theme } = useContext(ThemeContext);

  const friendsId = friends
    .filter((f) => f.username.toLowerCase().includes(query))
    .map((item) => {
      return item._id;
    });

  // get new message from socket
  useEffect(() => {
    socket?.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, [socket]);

  //check ? is new message for current conversation?
  useEffect(() => {
    arrivalMessage &&
      currentConversation?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentConversation]);

  //clear chat notification after check conversation
  useEffect(() => {
    setChatNotifications(
      chatNotifications?.filter(
        (c) => !currentConversation?.members.includes(c.senderId)
      )
    );
  }, [currentConversation]);

  //to dont show notification for current conversation sender
  if (currentConversation !== null) {
    for (var i = 0; i < chatNotifications?.length; i++) {
      if (currentConversation.members.includes(chatNotifications[i].senderId)) {
        chatNotifications.splice(i, 1);
      }
    }
  }

  // get conversations
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axiosInstance.get(
          "/conversations/" + currentUser._id
        );
        setConversations(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
  }, [currentUser]);

  // get message for selected conversation
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axiosInstance.get(
          "/messages/" + currentConversation?._id
        );
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentConversation]);

  //scroll to last message
  useEffect(() => {
    scrollBar.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: currentUser._id,
      text: newMessage,
      conversationId: currentConversation._id,
    };
    const receiverId = currentConversation.members.find(
      (m) => m !== currentUser._id
    );
    socket.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId,
      text: newMessage,
      senderName: currentUser.username,
    });

    try {
      const res = await axiosInstance.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

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
    setFriends(
      friends.filter((f) =>
        conversations.some((c) => c.members.includes(f._id))
      )
    );
  }, [currentUser]);

  return (
    <>
      <Topbar />
      <div className={`messenger ${theme}`}>
        <div className="chatHistoryBox">
          <div className="chatHistoryBoxContainer">
            <div className="searchBox">
              <SearchIcon className="iconSearch" />
              <input
                type="text"
                className="inputSearch"
                placeholder="Search conversation..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {conversations
              .filter((c) => friendsId.some((f) => c.members.includes(f)))
              .map((c) => (
                <div
                  onClick={() => {
                    setCurrentConversation(c);
                    setQuery("");
                  }}
                >
                  <Conversation
                    conversation={c}
                    currentUser={currentUser}
                    messages={messages}
                    currentConversation={currentConversation}
                    chatNotifications={chatNotifications}
                  />
                </div>
              ))}
          </div>
        </div>

        <div className="chatBox">
          <div className="chatBoxContainer">
            {currentConversation ? (
              <>
                <div className="chatBoxTop">
                  {messages?.map((m) => (
                    <div ref={scrollBar}>
                      <Message message={m} own={m.sender === currentUser._id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    name=""
                    className="messageInput"
                    placeholder="Write your message ..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="sendMessageBtn" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="noConversationBox">
                <p className="noConversationText">
                  Select a conversation to start...
                </p>
                <img
                  src={PF + "messaging_app.svg"}
                  alt="messaging Svg"
                  className="svg"
                />
              </div>
            )}
          </div>
        </div>

        <div className="friendBox">
          <div className="friendBoxContainer">
            <MessangerFriendList
              currentUserId={currentUser._id}
              currentConversation={currentConversation}
              setCurrentConversation={setCurrentConversation}
              setConversations={setConversations}
            />
          </div>
        </div>
      </div>
    </>
  );
}
