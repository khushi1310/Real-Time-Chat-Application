import React, { useRef, useState } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Coversation/Conversation";
import LogoSearch from "../../components/LogoSearch/LogoSearch";
import "./Chat.css";
import { useEffect } from "react";
import { userChats } from "../../api/ChatRequests";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { logout } from "../../actions/AuthActions";
import { FaCheck } from 'react-icons/fa';

const Chat = () => {
  const dispatch = useDispatch();
  const socket = useRef();
  const { user } = useSelector((state) => state.authReducer.authData);
  //console.log(user);
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [activeButton, setActiveButton] = useState(null);

  function handleLogOut() {
    dispatch(logout());
  }

  function handleActive() {
    setActiveButton("active");
    socket.current.emit("new-user-add", user._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }

  function handleBusy() {
    setActiveButton("busy");
    socket.current.emit("user-disconnect");
    console.log("busy btn clicked!!");
  }

  // Get the chat in chat section
  useEffect(() => {
    console.log("HII", user)
    const getChats = async () => {
      try {
        const result = await userChats(user._id)
        const { data } = result;
        console.log(result);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user._id]);

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io("ws://localhost:8800");
    socket.current.emit("new-user-add", user._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage!==null) {
      socket.current.emit("send-message", sendMessage);}
  }, [sendMessage]);


  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      console.log(data)
      setReceivedMessage(data);
    }

    );
  }, []);


  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <LogoSearch />
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => {
                  setCurrentChat(chat);
                }}
              >
                <Conversation
                  data={chat}
                  currentUser={user._id}
                  online={checkOnlineStatus(chat)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}

      <div className="Right-side-chat">
      <div className="flex justify-end space-x-4 classx">
        <button className={`button busy-button ${activeButton === "busy" ? "active" : ""}`} onClick={handleBusy}>
        Busy {activeButton === "busy" && <FaCheck className="ml-1" />} {/* Render the check icon when active */}
        </button>
        <button className={`button active-button ${activeButton === "active" ? "active" : ""}`} onClick={handleActive}>
        Active {activeButton === "active" && <FaCheck className="ml-1" />} {/* Render the check icon when active */}
        </button>
        <button className="button logout-button" onClick={handleLogOut}>Log Out</button>
      </div>
        <ChatBox
          chat={currentChat}
          currentUser={user._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
          onlineUsers={onlineUsers}
        />
      </div>
    </div>
  );
};

export default Chat;
