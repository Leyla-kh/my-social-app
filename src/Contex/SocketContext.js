import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { user: currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [chatNotifications, setChatNotifications] = useState(
    JSON.parse(localStorage.getItem("ChatNotification")) || []
  );

  useEffect(() => {
    setSocket(io("https://socialsocket.onrender.com"));
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket?.emit("addUser", currentUser._id);
    }

    socket?.on("getChatNotification", (data) => {
      setChatNotifications((prev) => [...prev, data]);
      localStorage.setItem(
        "ChatNotification",
        JSON.stringify(chatNotifications)
      );
    });
  }, [socket, currentUser]);

  useEffect(() => {
    localStorage.setItem("ChatNotification", JSON.stringify(chatNotifications));
  }, [chatNotifications]);

  return (
    <SocketContext.Provider
      value={{ socket, chatNotifications, setChatNotifications }}
    >
      {children}
    </SocketContext.Provider>
  );
};
